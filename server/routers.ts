import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb, createStoreOrder, getStoreOrderByOrderId, getStoreProductsByIds, updateStoreOrderPayment } from "./db";
import { storageGetSignedUrl, storagePut } from "./storage";
import { storeProducts } from "../drizzle/schema";
import { createCryptomusInvoice, isCryptomusConfigured, type CryptomusNetwork } from "./cryptomus";

const checkoutNetwork = z.enum(["TRC20", "BEP20", "ERC20", "SOL", "ARB"]);
const cryptomusNetwork: Record<z.infer<typeof checkoutNetwork>, CryptomusNetwork> = {
  TRC20: "tron",
  BEP20: "bsc",
  ERC20: "eth",
  SOL: "sol",
  ARB: "arbitrum",
};

const getPublicOrigin = (req: { protocol: string; get: (name: string) => string | undefined }) => {
  const forwardedProto = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host");
  return `${forwardedProto || req.protocol}://${host}`;
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  products: router({
    publish: adminProcedure.input(z.object({ title: z.string().min(1).max(240), category: z.string().min(1).max(120), price: z.string().regex(/^\\d+(\\.\\d{1,2})?$/), coverName: z.string().min(1), coverType: z.string().min(1), coverBase64: z.string().min(1), fileName: z.string().min(1), fileType: z.string().min(1), fileBase64: z.string().min(1) })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const cover = await storagePut(`products/${ctx.user.id}/${input.coverName}`, Buffer.from(input.coverBase64, "base64"), input.coverType);
      const file = await storagePut(`products/${ctx.user.id}/${input.fileName}`, Buffer.from(input.fileBase64, "base64"), input.fileType);
      const result = await db.insert(storeProducts).values({ ownerId: ctx.user.id, title: input.title, category: input.category, price: input.price, coverKey: cover.key, coverUrl: cover.url, fileKey: file.key, fileUrl: file.url });
      return { id: Number(result[0].insertId), coverUrl: cover.url, fileUrl: file.url };
    }),
  }),
  payments: router({
    createInvoice: publicProcedure.input(z.object({
      items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1),
      customerEmail: z.string().email(),
      network: checkoutNetwork,
    })).mutation(async ({ input, ctx }) => {
      if (!isCryptomusConfigured()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Cryptomus API is not configured yet." });
      const numericIds = input.items.map(item => Number(item.productId)).filter(Number.isInteger);
      const publishedProducts = await getStoreProductsByIds(numericIds);
      const products = input.items.map(item => {
        const product = publishedProducts.find(candidate => String(candidate.id) === item.productId);
        if (!product) throw new TRPCError({ code: "BAD_REQUEST", message: "This product is not published or is unavailable for delivery." });
        return { productId: String(product.id), title: product.title, quantity: item.quantity, unitPrice: Number(product.price), fileKey: product.fileKey };
      });
      const totalAed = products.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const amountUsd = (totalAed / 3.67).toFixed(2);
      const orderId = `LL-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      const origin = getPublicOrigin(ctx.req);
      await createStoreOrder({ orderId, customerEmail: input.customerEmail, amountUsd, currency: "USD", status: "pending", itemsJson: JSON.stringify(products) });
      const invoice = await createCryptomusInvoice({ orderId, amountUsd, email: input.customerEmail, network: cryptomusNetwork[input.network], urlCallback: `${origin}/api/payments/cryptomus/webhook`, urlReturn: `${origin}/checkout?order=${orderId}`, urlSuccess: `${origin}/checkout?order=${orderId}&success=1` });
      await updateStoreOrderPayment(orderId, { status: "pending", invoiceUuid: invoice.uuid, invoiceUrl: invoice.url });
      return { orderId, invoiceUrl: invoice.url };
    }),
    status: publicProcedure.input(z.object({ orderId: z.string().min(1) })).query(async ({ input }) => {
      const order = await getStoreOrderByOrderId(input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      return { orderId: order.orderId, status: order.status, invoiceUrl: order.invoiceUrl };
    }),
    downloads: publicProcedure.input(z.object({ orderId: z.string().min(1), customerEmail: z.string().email() })).query(async ({ input }) => {
      const order = await getStoreOrderByOrderId(input.orderId);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      if (order.customerEmail.trim().toLowerCase() !== input.customerEmail.trim().toLowerCase()) {
        throw new TRPCError({ code: "FORBIDDEN", message: "The email does not match this order." });
      }
      if (order.status !== "paid" && order.status !== "paid_over") {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Downloads become available after payment confirmation." });
      }
      const items = JSON.parse(order.itemsJson) as Array<{ productId: string; title: string; fileKey?: string }>;
      const downloads = await Promise.all(items.map(async item => {
        if (!item.fileKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "A purchased file is not configured." });
        return { productId: item.productId, title: item.title, url: await storageGetSignedUrl(item.fileKey) };
      }));
      return { orderId: order.orderId, downloads };
    }),
  }),
});

export type AppRouter = typeof appRouter;

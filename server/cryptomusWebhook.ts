import type { Express, Request, Response } from "express";
import { getStoreOrderByOrderId, updateStoreOrderPayment } from "./db";
import { verifyCryptomusWebhook, type CryptomusWebhook } from "./cryptomus";

const toOrderStatus = (status: string | undefined): "pending" | "paid" | "paid_over" | "wrong_amount" | "failed" | "cancelled" => {
  if (status === "paid") return "paid";
  if (status === "paid_over") return "paid_over";
  if (status === "wrong_amount" || status === "wrong_amount_waiting") return "wrong_amount";
  if (status === "cancel") return "cancelled";
  if (status === "fail" || status === "system_fail" || status === "refund_fail") return "failed";
  return "pending";
};

async function handleCryptomusWebhook(req: Request, res: Response) {
  const payload = req.body as CryptomusWebhook;
  if (!verifyCryptomusWebhook(payload)) return res.status(401).json({ ok: false, error: "Invalid signature" });
  if (!payload.order_id) return res.status(400).json({ ok: false, error: "Missing order_id" });
  const order = await getStoreOrderByOrderId(payload.order_id);
  if (!order) return res.status(404).json({ ok: false, error: "Unknown order" });
  const status = toOrderStatus(payload.status);
  const paidAt = status === "paid" || status === "paid_over" ? new Date() : undefined;
  await updateStoreOrderPayment(order.orderId, { status, invoiceUuid: payload.uuid ?? order.invoiceUuid ?? undefined, paidAt });
  return res.json({ ok: true });
}

export function registerCryptomusWebhook(app: Express) {
  app.post("/api/payments/cryptomus/webhook", (req, res) => {
    void handleCryptomusWebhook(req, res).catch(error => {
      console.error("[Cryptomus] webhook error", error);
      if (!res.headersSent) res.status(500).json({ ok: false });
    });
  });
}

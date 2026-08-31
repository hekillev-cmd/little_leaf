import { NOT_ADMIN_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "./adminAuth";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

function parseCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(";").find(c => c.trim().startsWith(`${name}=`));
  return match?.trim().slice(name.length + 1);
}

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    const token = parseCookie(ctx.req.headers.cookie, ADMIN_COOKIE_NAME);
    const isAdmin = await verifyAdminToken(token);

    if (!isAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
      },
    });
  })
);
import { createHash, timingSafeEqual } from "node:crypto";
import { ENV } from "./_core/env";

const CRYPTOMUS_API = "https://api.cryptomus.com/v1";

export type CryptomusNetwork = "tron" | "bsc" | "eth" | "sol" | "arbitrum";

export type CryptomusWebhook = {
  sign?: string;
  type?: string;
  uuid?: string;
  order_id?: string;
  amount?: string;
  status?: string;
  is_final?: boolean;
  txid?: string;
  network?: string;
  currency?: string;
  additional_data?: string | null;
  [key: string]: unknown;
};

function serializeForSign(payload: unknown) {
  return JSON.stringify(payload).replace(/\//g, "\\/");
}

export function cryptomusSign(payload: unknown, apiKey = ENV.cryptomusApiKey) {
  return createHash("md5")
    .update(Buffer.from(serializeForSign(payload)).toString("base64") + apiKey)
    .digest("hex");
}

export function verifyCryptomusWebhook(payload: CryptomusWebhook) {
  if (!ENV.cryptomusApiKey || !payload.sign) return false;
  const { sign, ...unsignedPayload } = payload;
  const expected = cryptomusSign(unsignedPayload);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(sign);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function isCryptomusConfigured() {
  return Boolean(ENV.cryptomusMerchantId && ENV.cryptomusApiKey);
}

export async function checkCryptomusCredentials() {
  await cryptomusRequest<unknown>("/payment/services", {});
  return true;
}

async function cryptomusRequest<T>(path: string, payload: Record<string, unknown>) {
  if (!isCryptomusConfigured()) throw new Error("Cryptomus is not configured");
  const body = JSON.stringify(payload);
  const response = await fetch(`${CRYPTOMUS_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      merchant: ENV.cryptomusMerchantId,
      sign: cryptomusSign(payload),
    },
    body,
  });
  const data = (await response.json().catch(() => ({}))) as T & { state?: number; message?: string };
  if (!response.ok || data.state === 0) {
    throw new Error(`Cryptomus request failed (${response.status}): ${data.message ?? response.statusText}`);
  }
  return data;
}

export async function createCryptomusInvoice(input: {
  orderId: string;
  amountUsd: string;
  email: string;
  urlCallback: string;
  urlReturn: string;
  urlSuccess: string;
  network?: CryptomusNetwork;
}) {
  const payload: Record<string, unknown> = {
    amount: input.amountUsd,
    currency: "USD",
    order_id: input.orderId,
    url_callback: input.urlCallback,
    url_return: input.urlReturn,
    url_success: input.urlSuccess,
    lifetime: 3600,
    is_payment_multiple: false,
    to_currency: "USDT",
    additional_data: JSON.stringify({ email: input.email }),
  };
  if (input.network) payload.network = input.network;
  const response = await cryptomusRequest<{ result?: { uuid?: string; url?: string } }>("/payment", payload);
  if (!response.result?.url || !response.result.uuid) throw new Error("Cryptomus returned an incomplete invoice");
  return { uuid: response.result.uuid, url: response.result.url };
}

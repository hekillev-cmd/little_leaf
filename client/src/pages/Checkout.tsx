import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clipboard, Copy, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { formatPrice } from "@/lib/catalog";
import { getCartProducts, useStore } from "@/contexts/StoreContext";
import { useI18n } from "@/contexts/I18nContext";
import { getCheckoutRedirectPath, getPaymentAddress, getUsdtAmount } from "@/lib/checkout";
import { trpc } from "@/lib/trpc";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart, cartTotal } = useStore();
  const { t, localizeProduct } = useI18n();
  const items = getCartProducts(cart);
  const [network, setNetwork] = useState("TRC20");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order");
  const storedEmail = orderId ? window.sessionStorage.getItem(`little-leaf-order-email:${orderId}`) || "" : "";
  const statusQuery = trpc.payments.status.useQuery({ orderId: orderId || "pending" }, { enabled: Boolean(orderId), refetchInterval: query => query.state.data?.status === "pending" ? 5000 : false });
  const canDownload = Boolean(orderId && storedEmail && (statusQuery.data?.status === "paid" || statusQuery.data?.status === "paid_over"));
  const downloadsQuery = trpc.payments.downloads.useQuery({ orderId: orderId || "pending", customerEmail: storedEmail || "customer@example.com" }, { enabled: canDownload });
  const invoiceMutation = trpc.payments.createInvoice.useMutation({ onSuccess: ({ invoiceUrl, orderId: createdOrderId }) => { window.sessionStorage.setItem(`little-leaf-order-email:${createdOrderId}`, email.trim()); toast.success(t.invoiceRedirect); window.location.href = invoiceUrl; }, onError: error => toast.error(error.message || t.gatewayUnavailable) });
  const networkOptions = [["TRC20", t.networkTron], ["BEP20", t.networkBnb], ["ERC20", t.networkEthereum], ["SOL", t.networkSolana], ["ARB", t.networkArbitrum]] as const;
  const paymentAddress = getPaymentAddress(network as "TRC20" | "BEP20" | "ERC20" | "SOL" | "ARB");

  useEffect(() => {
    if (!orderId) {
      const redirectPath = getCheckoutRedirectPath(items.length);
      if (redirectPath) setLocation(redirectPath);
    }
  }, [items.length, orderId, setLocation]);

  const copyAddress = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(paymentAddress);
      else { const textarea = document.createElement("textarea"); textarea.value = paymentAddress; textarea.style.position = "fixed"; textarea.style.opacity = "0"; document.body.appendChild(textarea); textarea.select(); document.execCommand("copy"); textarea.remove(); }
      setCopied(true); toast.success(t.saved); window.setTimeout(() => setCopied(false), 1600);
    } catch { toast.error(t.copyFailed); }
  };

  const createInvoice = () => {
    if (!email.trim()) { toast.error(t.required); return; }
    invoiceMutation.mutate({ items: Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([productId, quantity]) => ({ productId, quantity })), customerEmail: email.trim(), network: network as "TRC20" | "BEP20" | "ERC20" | "SOL" | "ARB" });
  };

  if (orderId) {
    const isPaid = statusQuery.data?.status === "paid" || statusQuery.data?.status === "paid_over";
    return <div className="store-shell checkout-shell"><main className="inner-page"><div className="container checkout-top"><Link href="/" className="checkout-brand"><span className="brand-mark"><span>ل</span></span><strong>لُعْبَة</strong></Link><Link href="/" className="back-cart"><ArrowRight size={15} /> {t.backStore}</Link></div><section className="container checkout-layout"><div className="checkout-main"><div className="checkout-card"><div className="checkout-card-heading"><div><span className="eyebrow">{isPaid ? t.paymentPaid : t.paymentPending}</span><h1>{isPaid ? t.downloadReady : t.paymentPending}</h1></div><ShieldCheck size={22} /></div>{!isPaid ? <p className="checkout-intro">{t.downloadUnavailable}</p> : downloadsQuery.isLoading ? <p className="checkout-intro"><LoaderCircle className="spin" size={17} /> {t.processing}</p> : downloadsQuery.isError ? <p className="checkout-intro">{t.downloadUnavailable}</p> : <div className="network-options">{downloadsQuery.data?.downloads.map(file => <a className="button-primary button-wide" href={file.url} target="_blank" rel="noreferrer" key={file.productId}><ArrowLeft size={17} /> {t.downloadFile}: {file.title}</a>)}</div>}<Link href="/" className="text-link">{t.backStore}</Link></div></div></section></main></div>;
  }

  return <div className="store-shell checkout-shell"><main className="inner-page"><div className="container checkout-top"><Link href="/" className="checkout-brand"><span className="brand-mark"><span>ل</span></span><strong>لُعْبَة</strong></Link><div className="checkout-steps"><span className="done">1 {t.cart}</span><i /><span className="active">2 {t.paymentMethod}</span><i /><span>3 {t.instantDownload}</span></div><Link href="/cart" className="back-cart"><ArrowRight size={15} /> {t.backToCart}</Link></div><section className="container checkout-layout"><div className="checkout-main"><div className="simulation-banner"><ShieldCheck size={18} /><div><strong>{t.safePurchase}</strong><span>{t.noShippingWait}</span></div></div><div className="checkout-card"><div className="checkout-card-heading"><div><span className="eyebrow">{t.paymentMethod}</span><small className="checkout-provider">Cryptomus · USDT</small><h1>{t.finishOrder}</h1></div><LockKeyhole size={20} /></div><p className="checkout-intro">{t.chooseNetwork}</p><div className="network-options">{networkOptions.map(([value, label]) => <label key={value} className={network === value ? "selected" : ""}><input type="radio" name="network" value={value} checked={network === value} onChange={() => setNetwork(value)} /><span><b>{value}</b><small>{label}</small></span><i /></label>)}</div><div className="payment-instructions"><span className="step-number">01</span><div><strong>{t.sendAmount}</strong><div className="usdt-amount"><b>{getUsdtAmount(cartTotal).toFixed(2)} USDT</b><span>≈ {formatPrice(cartTotal)}</span></div></div></div><label className="customer-email"><span>{t.customerEmail}</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={t.emailPlaceholder} required /></label><div className="payment-instructions"><span className="step-number">02</span><div className="address-block"><strong>{t.toAddress} {network}</strong><div className="address-field"><code>{paymentAddress}</code><button type="button" onClick={copyAddress} aria-label={t.copyAddress}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><small><Clipboard size={13} /> {t.chooseNetwork}</small></div></div><button type="button" className="button-primary button-wide confirm-button" disabled={invoiceMutation.isPending} onClick={createInvoice}>{invoiceMutation.isPending ? <><LoaderCircle className="spin" size={17} /> {t.processing}</> : <>{t.payNow} <ArrowLeft size={17} /></>}</button></div></div><aside className="checkout-summary"><span className="eyebrow">{t.orderSummary}</span>{items.map(product => { const viewProduct = localizeProduct(product); return <div className="checkout-item" key={product.id}><div><strong>{viewProduct.title}</strong><small>{t.quantity}: {cart[product.id]}</small></div><span>{formatPrice(product.price * cart[product.id])}</span></div>; })}<div className="summary-total"><span>{t.subtotal}</span><strong>{formatPrice(cartTotal)}</strong></div><div className="checkout-legal"><ShieldCheck size={16} /><span>{t.digitalOnly}<br />{t.noShippingWait}</span></div></aside></section></main></div>;
}

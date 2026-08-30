import React, { useMemo, useState } from "react";
import { ArrowLeft, Check, CreditCard, ImagePlus, Link as LinkIcon, Save, UploadCloud } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/catalog";
import { useI18n } from "@/contexts/I18nContext";
import { trpc } from "@/lib/trpc";
import { toggleGateway, validatePublishDraft } from "@/lib/studio";

const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] || ""); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

const gateways = [
  { id: "usdt", label: "USDT", detail: "TRC20 · BEP20 · ERC20" },
  { id: "paypal", label: "PayPal", detail: "يتطلب ربط حساب PayPal" },
  { id: "stripe", label: "Stripe", detail: "بطاقات بنكية ومحافظ رقمية" },
  { id: "bank", label: "تحويل بنكي", detail: "تأكيد يدوي للطلب" },
];

export default function Studio() {
  const { t, localizeCategory } = useI18n();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]?.slug || "كتب-التلوين");
  const [cover, setCover] = useState<File | null>(null);
  const [download, setDownload] = useState<File | null>(null);
  const [enabled, setEnabled] = useState<string[]>(["usdt"]);
  const publishMutation = trpc.products.publish.useMutation({ onSuccess: () => toast.success(t.published), onError: (error) => toast.error(error.message || t.comingSoon) });
  const coverPreview = useMemo(() => cover && typeof URL.createObjectURL === "function" ? URL.createObjectURL(cover) : "", [cover]);
  const publish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validatePublishDraft({ title, price, category, cover, download }).valid || !cover || !download) { toast.error(t.required); return; }
    try {
      await publishMutation.mutateAsync({ title, price, category, coverName: cover.name, coverType: cover.type, coverBase64: await fileToBase64(cover), fileName: download.name, fileType: download.type, fileBase64: await fileToBase64(download) });
    } catch { /* mutation displays the localized error */ }
  };
  const saveGateways = () => { localStorage.setItem("little-leaf-payment-gateways", JSON.stringify(enabled)); toast.success(t.settingsSaved); };
  const changeGateway = (id: string) => setEnabled((current) => toggleGateway(current, id));
  return <div className="store-shell"><main className="inner-page"><div className="container studio-top"><div><span className="eyebrow">{t.adminTitle}</span><h1>{t.publishProduct}</h1><p>{t.digitalOnly} · {t.demo}</p></div><Link href="/" className="button-quiet"><ArrowLeft size={16} /> {t.backStore}</Link></div><section className="container studio-grid"><form className="studio-card" onSubmit={publish}><div className="studio-card-heading"><div><span className="eyebrow">01 · {t.publishProduct}</span><h2>{t.productTitle}</h2></div><UploadCloud size={20} /></div><label>{t.productTitle}<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.productTitle} required /></label><label>{t.productCategory}<select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((item) => <option key={item.slug} value={item.slug}>{localizeCategory(item.label)}</option>)}</select></label><label>{t.productPrice}<div className="price-input"><input type="number" min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="7.50" required /><span>د.إ</span></div></label><label className="file-drop"><ImagePlus size={19} /><span>{t.productCover}<small>{cover ? cover.name : t.required}</small></span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCover(e.target.files?.[0] || null)} required /></label>{coverPreview && <img className="cover-preview" src={coverPreview} alt={t.preview} />}<label className="file-drop"><UploadCloud size={19} /><span>{t.productFile}<small>{download ? download.name : t.required}</small></span><input type="file" accept="application/pdf,application/zip" onChange={(e) => setDownload(e.target.files?.[0] || null)} required /></label><button className="button-primary button-wide" type="submit" disabled={publishMutation.isPending}>{publishMutation.isPending ? t.processing : t.publish} <Check size={17} /></button></form><aside className="studio-card gateway-card"><div className="studio-card-heading"><div><span className="eyebrow">02 · {t.gatewayTitle}</span><h2>{t.gatewayTitle}</h2></div><CreditCard size={20} /></div><p>{t.gatewayHint}</p><div className="gateway-list">{gateways.map((gateway) => <label className={`gateway-row ${enabled.includes(gateway.id) ? "is-enabled" : ""}`} key={gateway.id}><input type="checkbox" checked={enabled.includes(gateway.id)} onChange={() => changeGateway(gateway.id)} /><span><b>{gateway.label}</b><small>{gateway.detail}</small></span><em>{gateway.id === "usdt" ? t.demo : t.comingSoon}</em></label>)}</div><button className="button-dark button-wide" type="button" onClick={saveGateways}><Save size={16} /> {t.saveSettings}</button><div className="studio-note"><LinkIcon size={16} /><span>USDT يعمل هنا كمحاكاة فقط. ربط PayPal أو Stripe أو بنك حقيقي يحتاج مفاتيح API والتحقق من الخادم.</span></div></aside></section></main></div>;
}

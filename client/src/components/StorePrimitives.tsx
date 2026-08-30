import React, { useEffect, useRef } from "react";
import { ArrowUpLeft, ExternalLink, Heart, Plus, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import type { AffiliateProduct, Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
import { Illustration } from "@/components/Illustration";
import { useStore } from "@/contexts/StoreContext";
import { useI18n } from "@/contexts/I18nContext";

export function AdSlot({ label = "مساحة إعلانية" }: { label?: string }) {
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID as string | undefined;
  const adRef = useRef<HTMLModElement>(null);
  useEffect(() => {
    if (!publisherId?.startsWith("ca-pub-")) return;
    const activate = () => {
      try {
        const ads = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle ||= [];
        ads.push({});
      } catch (error) {
        console.warn("[AdSense] Unit activation deferred", error);
      }
    };
    const existing = document.querySelector('script[data-adsense="little-leaf"]');
    if (existing) window.setTimeout(activate, 0);
    else {
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.adsense = "little-leaf";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
      script.onload = activate;
      document.head.appendChild(script);
    }
  }, [publisherId]);
  if (publisherId?.startsWith("ca-pub-")) return <div className="ad-slot ad-slot-live" aria-label={label}><ins ref={adRef} className="adsbygoogle" style={{ display: "block", minHeight: 90 }} data-ad-client={publisherId} data-ad-slot={slotId} data-ad-format="auto" data-full-width-responsive="true" /><small>{label}</small></div>;
  return <div className="ad-slot" aria-label={label}><span><span className="ad-dot" /> {label}</span><small>ستظهر الإعلانات بعد إضافة Publisher ID وقبول الموقع</small></div>;
}

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { addToCart } = useStore();
  const { t, localizeProduct } = useI18n();
  const viewProduct = localizeProduct(product);
  return (
    <article className={`product-card ${featured ? "product-card-featured" : ""}`}>
      <Link href={`/product/${product.id}`} className="product-card-link" aria-label={viewProduct.title}>
        <div className="product-cover-wrap">
          <Illustration kind={viewProduct.cover} />
          <span className={`product-tag tag-${viewProduct.accent}`}>{viewProduct.tag}</span>
          <button type="button" className="favorite-button" aria-label={t.favorites} onClick={(event) => { event.preventDefault(); toast.success(t.saved); }}><Heart size={17} /></button>
        </div>
        <div className="product-card-body">
          <div className="product-card-meta"><span>{viewProduct.category}</span><span>{viewProduct.pages}</span></div>
          <h3>{viewProduct.title}</h3>
          <p>{viewProduct.subtitle}</p>
          <div className="product-card-bottom"><strong>{formatPrice(viewProduct.price)}</strong><span className="mini-arrow"><ArrowUpLeft size={16} /></span></div>
        </div>
      </Link>
      <button className="quick-add" type="button" onClick={() => { addToCart(product.id); toast.success(`${t.added}: ${viewProduct.title}`); }}><Plus size={16} /> {t.addCart}</button>
    </article>
  );
}

export function AffiliateCard({ product }: { product: AffiliateProduct }) {
  const { t, localizeAffiliate } = useI18n();
  const viewProduct = localizeAffiliate(product);
  return (
    <article className={`affiliate-card affiliate-${viewProduct.accent}`}>
      <div className="affiliate-art"><ShoppingBag size={26} /><span>↗</span></div>
      <div className="affiliate-content"><span className="affiliate-label">{viewProduct.label}</span><h3>{viewProduct.title}</h3><p>{viewProduct.description}</p><strong>{viewProduct.price}</strong></div><a className="affiliate-link" href={viewProduct.href} target="_blank" rel="noreferrer" onClick={() => toast.info(t.comingSoon)}>{t.openTool} <ExternalLink size={15} /></a>
    </article>
  );
}

export function StoreFooter() {
  const { t, localizeCategory } = useI18n();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand"><span className="brand-mark"><span>ل</span></span><div><strong>لُعْبَة</strong><p>{t.footerTagline}</p></div></div>
        <div><h4>{t.browse}</h4><Link href="/">{t.backHome}</Link><Link href="/category/كتب-التلوين">{localizeCategory("كتب التلوين")}</Link><Link href="/category/دفاتر-الرسم">{localizeCategory("دفاتر الرسم")}</Link></div>
        <div><h4>{t.help}</h4><Link href="/legal/contact">{t.help}</Link><Link href="/legal/privacy">Privacy / الخصوصية</Link><Link href="/legal/terms">Terms / الشروط</Link><Link href="/legal/refund">Refunds / الاسترجاع</Link></div>
        <div className="footer-newsletter"><span className="eyebrow">{t.newsletterEyebrow}</span><h4>{t.newsletterTitle}</h4><div className="newsletter-field"><input placeholder={t.emailPlaceholder} aria-label={t.emailPlaceholder} /><button type="button" onClick={() => toast.success(t.saved)}>{t.subscribe}</button></div></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 لُعْبَة · Issa Cisse · Nouakchott, Mauritania</span><span>{t.code} · {t.digitalOnly} · Issacisse.x@gmail.com</span></div>
    </footer>
  );
}

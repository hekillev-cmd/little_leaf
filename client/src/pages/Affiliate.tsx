import React from "react";
import { ArrowLeft, ArrowUpLeft, ExternalLink, Info, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AFFILIATE_PRODUCTS } from "@/lib/catalog";
import { AffiliateCard, AdSlot, StoreFooter } from "@/components/StorePrimitives";
import { useI18n } from "@/contexts/I18nContext";

export default function Affiliate() {
  const { t } = useI18n();
  return <div className="store-shell"><main className="inner-page"><div className="container breadcrumb"><Link href="/">{t.backHome}</Link><ArrowUpLeft size={14} /><span>{t.tools}</span></div><section className="container affiliate-hero"><div><span className="eyebrow"><Sparkles size={14} /> {t.affiliateLabel}</span><h1>{t.affiliateHeading}<br /><em>{t.editorialTitleB}</em></h1><p>{t.affiliateText}</p></div><div className="affiliate-hero-shape"><span>✎</span><small>{t.todayPicks}</small></div></section><section className="container affiliate-disclosure"><Info size={18} /><p>{t.disclosure}: {t.affiliateDisclosure}</p></section><section className="container affiliate-page-grid">{AFFILIATE_PRODUCTS.map((product) => <AffiliateCard key={product.id} product={product} />)}</section><section className="container affiliate-callout"><div><span className="eyebrow">{t.editorialEyebrow}</span><h2>{t.ready}</h2><p>{t.editorialText}</p></div><Link href="/category/all" className="button-dark">{t.browseProducts} <ArrowLeft size={17} /></Link></section><section className="container bottom-ad"><AdSlot label={t.tools} /></section></main><StoreFooter /></div>;
}

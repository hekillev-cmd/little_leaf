import React from "react";
import { ArrowLeft, ArrowRight, ArrowUpLeft, Check, Download, Heart, LockKeyhole, Plus, Share2, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { CATEGORIES, findProduct, formatPrice, PRODUCTS } from "@/lib/catalog";
import { Illustration } from "@/components/Illustration";
import { AdSlot, ProductCard, StoreFooter } from "@/components/StorePrimitives";
import { useStore } from "@/contexts/StoreContext";
import { useI18n } from "@/contexts/I18nContext";

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const product = findProduct(params?.id);
  const { addToCart } = useStore();
  const { t, localizeProduct, localizeCategory } = useI18n();
  if (!product) return <div className="store-shell"><main className="empty-page"><h1>{t.noResults}</h1><Link className="button-primary" href="/">{t.backHome} <ArrowLeft size={17} /></Link></main></div>;
  const viewProduct = localizeProduct(product);
  const categorySlug = CATEGORIES.find((category) => category.label === product.category)?.slug || "all";
  return <div className="store-shell"><main className="inner-page"><div className="container breadcrumb"><Link href="/">{t.backHome}</Link><ArrowRight size={14} /><Link href={`/category/${categorySlug}`}>{localizeCategory(product.category)}</Link><ArrowRight size={14} /><span>{viewProduct.title}</span></div><section className="container product-detail"><div className="product-gallery"><div className="detail-cover"><Illustration kind={product.cover} /></div><div className="gallery-thumbs"><button className="thumb is-selected" type="button"><Illustration kind={product.cover} compact /></button><button className="thumb" type="button"><Illustration kind="draw" compact /></button><button className="thumb" type="button"><Illustration kind="letters" compact /></button><span className="gallery-note">{t.instantDigital}</span></div></div><div className="product-detail-copy"><span className="eyebrow"><Sparkles size={14} /> {viewProduct.tag}</span><h1>{viewProduct.title}</h1><p className="detail-subtitle">{viewProduct.subtitle}</p><div className="detail-price-row"><strong>{formatPrice(product.price)}</strong><span>{t.noShipping}</span></div><p className="detail-description">{viewProduct.description}</p><div className="detail-specs">{viewProduct.details.map((detail) => <span key={detail}><Check size={16} /> {detail}</span>)}</div><div className="detail-actions"><button className="button-primary button-large" type="button" onClick={() => { addToCart(product.id); toast.success(`${t.added}: ${viewProduct.title}`); }}>{t.addToCart} <Plus size={18} /></button><button className="icon-square" type="button" aria-label={t.favorites} onClick={() => toast.success(t.saved)}><Heart size={19} /></button><button className="icon-square" type="button" aria-label={t.comingSoon} onClick={() => toast.info(t.comingSoon)}><Share2 size={18} /></button></div><div className="detail-reassurance"><span><Download size={16} /><b>{t.instantDownload}</b><small>{t.safe}</small></span><span><LockKeyhole size={16} /><b>{t.safePurchase}</b><small>{t.demoPayment}</small></span></div></div></section><section className="container product-note"><div className="product-note-icon">✦</div><div><b>{t.parentsNote}</b><p>{t.digitalOnly}. {t.noShippingWait}.</p></div></section><section className="container product-related"><div className="section-heading compact-heading"><div><span className="eyebrow">{t.maybeAlso}</span><h2>{t.popularHeading}</h2></div><Link href="/category/all" className="text-link">{t.allProducts} <ArrowUpLeft size={16} /></Link></div><div className="product-grid">{PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <ProductCard key={item.id} product={item} />)}</div></section><section className="container bottom-ad"><AdSlot label={t.affiliateNav} /></section></main><StoreFooter /></div>;
}

import { ArrowLeft, ArrowUpLeft, Download, Settings2, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { Illustration } from "@/components/Illustration";
import { AdSlot, AffiliateCard, ProductCard, StoreFooter } from "@/components/StorePrimitives";
import { AFFILIATE_PRODUCTS } from "@/lib/catalog";
import { useI18n } from "@/contexts/I18nContext";

export default function Home() {
  const { t, localizeProduct } = useI18n();
  const localizedProducts = PRODUCTS.map(localizeProduct);
  return (
    <div className="store-shell">
      <main>
        <section className="hero-section">
          <Link href="/settings" className="home-settings-link" aria-label="إعدادات المتجر"><Settings2 size={17} /><span>الإعدادات</span></Link>
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><Sparkles size={14} /> {t.heroEyebrow}</span>
              <h1>{t.heroTitleA}<br /><em>{t.heroTitleB}</em></h1>
              <p>{t.heroParagraph}</p>
              <div className="hero-actions"><Link className="button-primary" href="/category/كتب-التلوين">{t.discoverBooks} <ArrowLeft size={17} /></Link><button className="button-quiet" type="button" onClick={() => toast.info(t.howItWorksToast)}>{t.howWorks} <span>↗</span></button></div>
              <div className="hero-trust"><span><Download size={16} /> {t.instantDownload}</span><span><ShieldCheck size={16} /> {t.safePurchase}</span></div>
            </div>
            <div className="hero-art-wrap">
              <div className="hero-blob" />
              <div className="hero-art-main"><Illustration kind="garden" /></div>
              <div className="hero-note note-one"><span>✿</span><b>لحظة إبداع</b><small>جاهزة للطباعة</small></div>
              <div className="hero-note note-two"><span>✎</span><b>ارسم · لوّن · اكتشف</b></div>
              <div className="hero-scribble">✦</div>
            </div>
          </div>
        </section>

        <section className="category-strip container-section">
          <div className="container section-heading compact-heading"><div><span className="eyebrow">{t.categoryEyebrow}</span><h2>{t.categoryHeading}</h2></div><Link href="/category/all" className="text-link">{t.allProducts} <ArrowUpLeft size={16} /></Link></div>
          <div className="container category-grid">
            {CATEGORIES.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className={`category-tile category-${category.color}`}><span className="category-icon">{category.icon}</span><span><strong>{category.label}</strong><small>{t.discoverCollection}</small></span><ArrowUpLeft size={18} /></Link>)}
          </div>
        </section>

        <section className="products-section container-section">
          <div className="container section-heading"><div><span className="eyebrow">{t.popularEyebrow}</span><h2>{t.popularHeading}</h2></div><Link href="/category/all" className="text-link">{t.viewAll} <ArrowUpLeft size={16} /></Link></div>
          <div className="container product-grid">{localizedProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} featured />)}</div>
        </section>

        <section className="container ad-container"><AdSlot label="مساحة إعلانية · أعلى المحتوى" /></section>

        <section className="editorial-section container-section">
          <div className="container editorial-card"><div className="editorial-art"><Illustration kind="draw" compact /><span className="editorial-star">✦</span></div><div className="editorial-copy"><span className="eyebrow">{t.editorialEyebrow}</span><h2>{t.editorialTitleA}<br /><em>{t.editorialTitleB}</em></h2><p>{t.editorialText}</p><button type="button" className="button-dark" onClick={() => toast.success(t.guideToast)}>{t.readGuide} <ArrowLeft size={17} /></button></div></div>
        </section>

        <section className="affiliate-section container-section">
          <div className="container section-heading"><div><span className="eyebrow">{t.affiliateEyebrow}</span><h2>{t.affiliateHeading}</h2><p className="section-lede">{t.affiliateText} <strong>{t.commission}</strong></p></div><Link href="/affiliate" className="text-link">{t.affiliateAll} <ArrowUpLeft size={16} /></Link></div>
          <div className="container affiliate-grid">{AFFILIATE_PRODUCTS.map((product) => <AffiliateCard key={product.id} product={product} />)}</div>
        </section>

        <section className="container bottom-ad"><AdSlot label="مساحة إعلانية · بين الأقسام" /></section>
      </main>
      <StoreFooter />
    </div>
  );
}

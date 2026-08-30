import React from "react";
import { ArrowRight, ArrowUpLeft, SlidersHorizontal } from "lucide-react";
import { Link, useRoute } from "wouter";
import { CATEGORIES, getProductsForCategory } from "@/lib/catalog";
import { ProductCard, StoreFooter } from "@/components/StorePrimitives";
import { useI18n } from "@/contexts/I18nContext";

export default function Category() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug === "all" ? undefined : decodeURIComponent(params?.slug || "");
  const products = getProductsForCategory(slug);
  const category = CATEGORIES.find((item) => item.slug === slug);
  const { t, localizeCategory } = useI18n();
  const title = category ? localizeCategory(category.label) : t.allProducts;
  return <div className="store-shell"><main className="inner-page"><div className="container breadcrumb"><Link href="/">{t.backHome}</Link><ArrowRight size={14} /><span>{title}</span></div><section className="container category-hero"><div><span className="eyebrow">{t.categoryGroup}</span><h1>{title}</h1><p>{category ? t.categoryEyebrow : t.heroParagraph}</p></div><div className={`category-hero-stamp category-${category?.color || "coral"}`}>{category?.icon || "✦"}<small>{products.length} · {t.allProducts.toLocaleLowerCase()}</small></div></section><section className="container category-toolbar"><div className="category-pills"><Link href="/category/all" className={!category ? "is-active" : ""}>{t.allProducts}</Link>{CATEGORIES.map((item) => <Link key={item.slug} href={`/category/${item.slug}`} className={item.slug === slug ? "is-active" : ""}>{localizeCategory(item.label)}</Link>)}</div><button type="button" className="sort-button"><SlidersHorizontal size={16} /> {t.popularEyebrow} <ArrowUpLeft size={15} /></button></section><section className="container category-products"><div className="category-result-line"><span>{products.length} · {t.allProducts}</span><span>{t.instantDigital}</span></div><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main><StoreFooter /></div>;
}

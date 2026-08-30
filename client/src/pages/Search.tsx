import React from "react";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { Link, useSearch } from "wouter";
import { searchProducts } from "@/lib/catalog";
import { useI18n } from "@/contexts/I18nContext";
import { ProductCard, StoreFooter } from "@/components/StorePrimitives";

export default function Search() {
  const { t } = useI18n();
  const search = useSearch();
  const query = new URLSearchParams(window.location.search || search).get("q") || "";
  const results = searchProducts(query);
  return <div className="store-shell"><main className="inner-page"><div className="container breadcrumb"><Link href="/">{t.backHome}</Link><ArrowRight size={14} /><span>{t.searchResults}</span></div><section className="container search-heading"><span className="eyebrow"><SearchIcon size={14} /> {t.searchResults}</span><h1>{t.searchResults}: «{query}»</h1><p>{results.length ? `${results.length} · ${t.allProducts}` : t.noResults}</p></section><section className="container search-results">{results.length ? <div className="product-grid">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="search-empty"><span>⌕</span><h2>{t.noResults}</h2><p>{t.browseProducts}</p><Link href="/category/all" className="button-primary">{t.browseProducts} <ArrowRight size={17} /></Link></div>}</section></main><StoreFooter /></div>;
}

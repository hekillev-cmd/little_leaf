import React, { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Heart, Languages, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/contexts/StoreContext";
import { useI18n, type Language } from "@/contexts/I18nContext";

export function StoreHeader() {
  const [, setLocation] = useLocation();
  const { cartCount } = useStore();
  const { lang, setLang, t, localizeCategory } = useI18n();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(() => new URLSearchParams(window.location.search).get("menu") === "open");

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) { toast.info(t.searchPlaceholder); return; }
    setMobileOpen(false);
    setLocation(`/search?q=${encodeURIComponent(value)}`);
  };

  const changeLanguage = (value: string) => setLang(value as Language);

  return (
    <header className="site-header">
      <div className="announcement-bar"><div className="container announcement-inner"><span><Sparkles size={14} /> {t.announcement}</span><span className="announcement-note">{t.announcementNote}</span></div></div>
      <div className="header-main container">
        <Link href="/" className="brand" onClick={() => setMobileOpen(false)}><span className="brand-mark"><span>ل</span></span><span className="brand-copy"><strong>لُعْبَة</strong><em>{t.brandTag}</em></span></Link>
        <form className="search-box" onSubmit={submitSearch} role="search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} /><button type="submit">{t.searchButton}</button></form>
        <div className="header-actions"><label className="language-control"><Languages size={16} /><span className="sr-only">{t.language}</span><select value={lang} onChange={(event) => changeLanguage(event.target.value)} aria-label={t.language}><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option></select></label><Link href="/studio" className="icon-link desktop-only" aria-label={t.adminTitle}><UserRound size={19} /><span>{t.account}</span></Link><button className="icon-link desktop-only" type="button" onClick={() => toast.success(t.saved)} aria-label={t.favorites}><Heart size={19} /><span>{t.favorites}</span></button><Link href="/cart" className="cart-link" aria-label={`${t.cart}، ${cartCount}`}><ShoppingBag size={20} /><span className="cart-label">{t.cart}</span>{cartCount > 0 && <b>{cartCount}</b>}</Link><button className="mobile-menu-button" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? t.closeMenu : t.openMenu}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
      </div>
      <nav className={`category-nav ${mobileOpen ? "is-open" : ""}`} aria-label={t.navigation}><div className="container category-nav-inner"><Link href="/" className="nav-highlight" onClick={() => setMobileOpen(false)}>{t.todayPicks} <span>✦</span></Link>{CATEGORIES.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setMobileOpen(false)}>{localizeCategory(category.label)}</Link>)}<Link href="/affiliate" className="affiliate-nav" onClick={() => setMobileOpen(false)}>{t.affiliateNav} <span>↗</span></Link><button type="button" className="mobile-account-link" onClick={() => toast.info(t.comingSoon)}>{t.account} · {t.favorites}</button></div></nav>
    </header>
  );
}

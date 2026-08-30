// @vitest-environment jsdom
import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Studio from "../client/src/pages/Studio";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import Search from "../client/src/pages/Search";
import Checkout from "../client/src/pages/Checkout";
import { StoreHeader } from "../client/src/components/StoreHeader";
import Product from "../client/src/pages/Product";
import { StoreProvider } from "../client/src/contexts/StoreContext";
import { I18nProvider } from "../client/src/contexts/I18nContext";

const studioMock = vi.hoisted(() => ({ mutateAsync: vi.fn().mockResolvedValue({ id: 1 }), useMutation: vi.fn() }));
const invoiceMock = vi.hoisted(() => ({ mutate: vi.fn(), useMutation: vi.fn() }));
const paypalMock = vi.hoisted(() => ({ mutate: vi.fn(), useMutation: vi.fn() }));
vi.mock("../client/src/lib/trpc", () => ({ trpc: { products: { publish: { useMutation: () => ({ mutateAsync: studioMock.mutateAsync, isPending: false }) } }, payments: { createInvoice: { useMutation: () => ({ mutate: invoiceMock.mutate, isPending: false }) }, createPayPalOrder: { useMutation: () => ({ mutate: paypalMock.mutate, isPending: false }) }, status: { useQuery: () => ({ data: undefined, isLoading: false }) }, downloads: { useQuery: () => ({ data: undefined, isLoading: false, isError: false }) } } } }));

afterEach(() => cleanup());
beforeEach(() => {
  window.localStorage.clear();
  window.history.pushState({}, "", "/");
});

const renderWithStore = (page: React.ReactNode, path: string) => {
  const [pathname, search = ""] = path.split("?");
  const location = memoryLocation({ path: pathname, searchPath: search, record: true });
  render(<Router hook={location.hook} searchHook={location.searchHook}><I18nProvider><StoreProvider>{page}</StoreProvider></I18nProvider></Router>);
  return location;
};

describe("store pages", () => {
  it("opens the mobile menu without mixing RTL and LTR labels", async () => {
    renderWithStore(<StoreHeader />, "/");
    fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }));
    expect(document.querySelector(".category-nav.is-open")).toBeInTheDocument();
    expect(screen.getByText("كتب التلوين")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "اللغة" }), { target: { value: "fr" } });
    await waitFor(() => expect(document.documentElement.dir).toBe("ltr"));
    expect(screen.getByText("Livres de coloriage")).toBeInTheDocument();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth || 1024);
  });

  it("switches language copy and document direction", async () => {
    renderWithStore(<StoreHeader />, "/");
    const select = screen.getByRole("combobox", { name: "اللغة" });
    fireEvent.change(select, { target: { value: "fr" } });
    await waitFor(() => expect(document.documentElement.dir).toBe("ltr"));
    expect(screen.getByPlaceholderText("Rechercher un livre, une activité…")).toBeInTheDocument();
    expect(screen.getByText("Sélection du jour")).toBeInTheDocument();
  });

  it("translates an internal product page after switching language", async () => {
    renderWithStore(<><StoreHeader /><Product /></>, "/product/little-garden");
    fireEvent.change(screen.getByRole("combobox", { name: "اللغة" }), { target: { value: "fr" } });
    await waitFor(() => expect(screen.getByRole("heading", { name: "Le petit jardin des couleurs" })).toBeInTheDocument());
    expect(screen.getByText("PDF haute qualité")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("translates checkout labels and networks after switching language", async () => {
    window.localStorage.setItem("little-leaf-cart", JSON.stringify({ "little-garden": 1 }));
    renderWithStore(<><StoreHeader /><Checkout /></>, "/checkout");
    fireEvent.change(screen.getByRole("combobox", { name: "اللغة" }), { target: { value: "fr" } });
    await waitFor(() => expect(screen.getByText("Mode de paiement")).toBeInTheDocument());
    expect(screen.getByText("Réseau Tron")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("validates and submits the Studio publish form", async () => {
    renderWithStore(<Studio />, "/studio");
    fireEvent.change(screen.getByPlaceholderText("عنوان المنتج"), { target: { value: "كتاب جديد" } });
    fireEvent.change(screen.getByPlaceholderText("7.50"), { target: { value: "8.5" } });
    const files = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
    fireEvent.change(files[0], { target: { files: [new File(["cover"], "cover.png", { type: "image/png" })] } });
    fireEvent.change(files[1], { target: { files: [new File(["pdf"], "book.pdf", { type: "application/pdf" })] } });
    fireEvent.submit(screen.getByRole("button", { name: /نشر الآن/ }).closest("form")!);
    await waitFor(() => expect(studioMock.mutateAsync).toHaveBeenCalled());
  });

  it("saves payment gateway choices from Studio", async () => {
    renderWithStore(<Studio />, "/studio");
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByRole("button", { name: /حفظ الإعدادات/ }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("little-leaf-payment-gateways") || "[]")).toContain("paypal"));
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByRole("button", { name: /حفظ الإعدادات/ }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("little-leaf-payment-gateways") || "[]")).not.toContain("paypal"));
  });

  it("renders Arabic search results from the URL query", () => {
    window.history.pushState({}, "", "/search?q=تلوين");
    const location = renderWithStore(<Search />, "/search?q=تلوين");
    expect(location.history).toContain("/search?q=تلوين");
    expect(screen.getByRole("heading", { name: "حديقة الألوان الصغيرة" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "مغامرة في الفضاء" })).toBeInTheDocument();
  });

  it("redirects checkout to the cart when the cart is empty", async () => {
    const location = renderWithStore(<Checkout />, "/checkout");
    await waitFor(() => expect(location.history.at(-1)).toBe("/cart"));
  });

  it("shows the correct wallet address across languages and copies it", async () => {
    window.localStorage.setItem("little-leaf-cart", JSON.stringify({ "little-garden": 1 }));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderWithStore(<><StoreHeader /><Checkout /></>, "/checkout");
    expect(screen.getByText("TD8y8sdVXHweLijpTitWnhoResJhvTdFiF")).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("BEP20"));
    expect(screen.getByText("0x525aA8d9E33a5193985490D871b154209Bf801f7")).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("ERC20"));
    expect(screen.getAllByText("0x525aA8d9E33a5193985490D871b154209Bf801f7").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByDisplayValue("SOL"));
    expect(screen.getByText("2eCoA9BHVaSzdVqRH7jmjsosF7puqtkXeYJ7bpw89syj")).toBeInTheDocument();
    fireEvent.click(screen.getByDisplayValue("ARB"));
    expect(screen.getAllByText("0x525aA8d9E33a5193985490D871b154209Bf801f7").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "نسخ عنوان الدفع" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("0x525aA8d9E33a5193985490D871b154209Bf801f7"));
    fireEvent.change(screen.getByRole("combobox", { name: "اللغة" }), { target: { value: "fr" } });
    await waitFor(() => expect(screen.getByText("Réseau Arbitrum")).toBeInTheDocument());
    expect(screen.getAllByText("0x525aA8d9E33a5193985490D871b154209Bf801f7").length).toBeGreaterThan(0);
    fireEvent.change(screen.getByRole("combobox", { name: "Langue" }), { target: { value: "en" } });
    await waitFor(() => expect(screen.getByText("Arbitrum network")).toBeInTheDocument());
    expect(screen.getAllByText("0x525aA8d9E33a5193985490D871b154209Bf801f7").length).toBeGreaterThan(0);
  });

  it("creates a Cryptomus invoice request after the customer enters email", async () => {
    window.localStorage.setItem("little-leaf-cart", JSON.stringify({ "little-garden": 1 }));
    renderWithStore(<Checkout />, "/checkout");
    fireEvent.change(screen.getByRole("textbox", { name: "البريد الإلكتروني" }), { target: { value: "buyer@example.com" } });
    fireEvent.click(await screen.findByRole("button", { name: /الانتقال إلى الدفع الآمن/ }));
    await waitFor(() => expect(invoiceMock.mutate).toHaveBeenCalledWith(expect.objectContaining({ customerEmail: "buyer@example.com", network: "TRC20", items: [{ productId: "little-garden", quantity: 1 }] })));
  });
});

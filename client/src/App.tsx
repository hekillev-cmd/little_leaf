import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./contexts/StoreContext";
import { I18nProvider } from "./contexts/I18nContext";
import { StoreHeader } from "./components/StoreHeader";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Affiliate from "./pages/Affiliate";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Studio from "./pages/Studio";
import { LegalRoute } from "./pages/Legal";
import Settings from "./pages/Settings";

function Router() {
  const [location] = useLocation();
  const isCheckout = location === "/checkout";
  return <>
    {!isCheckout && <StoreHeader />}
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={Category} />
      <Route path="/product/:id" component={Product} />
      <Route path="/affiliate" component={Affiliate} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/search" component={Search} />
      <Route path="/studio" component={Studio} />
      <Route path="/legal/:kind" component={LegalRoute} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  </>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster position="bottom-center" /><I18nProvider><StoreProvider><Router /></StoreProvider></I18nProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;

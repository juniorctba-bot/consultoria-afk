import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogTag from "./pages/BlogTag";
import BlogSearch from "./pages/BlogSearch";

// Admin pages
import Admin from "./pages/Admin";
import AdminPosts from "./pages/AdminPosts";
import AdminPostEdit from "./pages/AdminPostEdit";
import AdminCategorias from "./pages/AdminCategorias";
import AdminTags from "./pages/AdminTags";
import AdminContatos from "./pages/AdminContatos";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/contato" component={Contato} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/tag/:slug" component={BlogTag} />
      <Route path="/blog/busca" component={BlogSearch} />
      <Route path="/blog/:slug" component={BlogPost} />
      
      {/* Admin routes */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/:id" component={AdminPostEdit} />
      <Route path="/admin/categorias" component={AdminCategorias} />
      <Route path="/admin/tags" component={AdminTags} />
      <Route path="/admin/contatos" component={AdminContatos} />
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

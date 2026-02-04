import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
};

export default function AdminLayout({
  children,
  navItems,
  title = "Admin",
  onLogout,
}: {
  children: React.ReactNode;
  navItems: MenuItem[];
  title?: string;
  onLogout: () => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();

  const handleNavClick = (href: string) => {
    setLocation(href);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-afk-gray-dark text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-afk-yellow">AFK Admin</h1>
                <p className="text-xs text-gray-400 mt-1">Painel de Postagens</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white border-0"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-afk-gray-dark">{title}</h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

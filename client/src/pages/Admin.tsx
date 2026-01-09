import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MailOpen,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-heading text-afk-gray-dark mb-4">
            Acesso Restrito
          </h1>
          <p className="text-afk-gray mb-6">
            Faça login para acessar o painel administrativo.
          </p>
          <a href={getLoginUrl()} className="btn-primary inline-block">
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-heading text-afk-gray-dark mb-4">
            Acesso Negado
          </h1>
          <p className="text-afk-gray mb-6">
            Você não tem permissão para acessar esta área.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Voltar ao Site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="AFK Admin">
      <AdminDashboard />
    </DashboardLayout>
  );
}

function AdminDashboard() {
  const { data: posts } = trpc.posts.listAll.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: contacts } = trpc.contact.list.useQuery();

  const publishedPosts = posts?.filter(p => p.published).length || 0;
  const draftPosts = posts?.filter(p => !p.published).length || 0;
  const unreadContacts = contacts?.filter(c => !c.read).length || 0;

  const stats = [
    { label: "Posts Publicados", value: publishedPosts, icon: Eye, color: "bg-green-100 text-green-600" },
    { label: "Rascunhos", value: draftPosts, icon: EyeOff, color: "bg-yellow-100 text-yellow-600" },
    { label: "Categorias", value: categories?.length || 0, icon: FolderOpen, color: "bg-blue-100 text-blue-600" },
    { label: "Contatos Não Lidos", value: unreadContacts, icon: Mail, color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading text-afk-gray-dark">Dashboard</h1>
        <Link href="/admin/posts/novo">
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-afk-gray-dark">{stat.value}</p>
                <p className="text-sm text-afk-gray">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-heading text-afk-gray-dark">Posts Recentes</h2>
          <Link href="/admin/posts" className="text-afk-yellow-dark hover:underline text-sm">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {posts?.slice(0, 5).map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="font-medium text-afk-gray-dark">{post.title}</p>
                  <p className="text-sm text-afk-gray">{post.category?.name || 'Sem categoria'}</p>
                </div>
              </div>
              <Link href={`/admin/posts/${post.id}`}>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
          {(!posts || posts.length === 0) && (
            <div className="p-8 text-center text-afk-gray">
              Nenhum post criado ainda.
            </div>
          )}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-heading text-afk-gray-dark">Contatos Recentes</h2>
          <Link href="/admin/contatos" className="text-afk-yellow-dark hover:underline text-sm">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {contacts?.slice(0, 5).map((contact) => (
            <div key={contact.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {contact.read ? (
                  <MailOpen className="w-5 h-5 text-gray-400" />
                ) : (
                  <Mail className="w-5 h-5 text-afk-yellow-dark" />
                )}
                <div>
                  <p className="font-medium text-afk-gray-dark">{contact.name}</p>
                  <p className="text-sm text-afk-gray">{contact.email}</p>
                </div>
              </div>
              <Badge variant={contact.read ? "secondary" : "default"}>
                {contact.read ? "Lido" : "Novo"}
              </Badge>
            </div>
          ))}
          {(!contacts || contacts.length === 0) && (
            <div className="p-8 text-center text-afk-gray">
              Nenhum contato recebido ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

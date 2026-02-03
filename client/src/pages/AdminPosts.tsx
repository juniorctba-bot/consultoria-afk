import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
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
  Search,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function AdminPosts() {
  const [, setLocation] = useLocation();
  const [adminAuth] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  useEffect(() => {
    if (!adminAuth) {
      setLocation('/admin/login');
    }
  }, [adminAuth, setLocation]);

  if (!adminAuth) {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} title="AFK Admin">
      <PostsList />
    </DashboardLayout>
  );
}

function PostsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { data: posts, isLoading, refetch } = trpc.posts.listAll.useQuery();
  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("Post excluído com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir post.");
    }
  });

  const filteredPosts = posts?.filter((post: any) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading text-afk-gray-dark">Posts</h1>
        <Link href="/admin/posts/novo">
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-afk-yellow mx-auto" />
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {filteredPosts?.map((post: any) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category?.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? (
                        <><Eye className="w-3 h-3 mr-1" /> Publicado</>
                      ) : (
                        <><EyeOff className="w-3 h-3 mr-1" /> Rascunho</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/posts/${post.id}`}>
                        <Button variant="ghost" size="sm" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Excluir"
                        onClick={() => setDeleteId(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-afk-gray">
            {searchTerm ? "Nenhum post encontrado." : "Nenhum post criado ainda."}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

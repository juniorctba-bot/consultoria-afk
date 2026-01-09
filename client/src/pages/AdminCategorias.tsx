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
  Loader2,
  Save,
  X,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function AdminCategorias() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-heading text-afk-gray-dark mb-4">
            Acesso Restrito
          </h1>
          <p className="text-afk-gray mb-6">
            Faça login como administrador para acessar esta área.
          </p>
          <a href={getLoginUrl()} className="btn-primary inline-block">
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="AFK Admin">
      <CategoriasList />
    </DashboardLayout>
  );
}

function CategoriasList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<{
    id?: number;
    name: string;
    slug: string;
    description: string;
  } | null>(null);
  
  const { data: categories, isLoading, refetch } = trpc.categories.list.useQuery();
  
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      refetch();
      setEditCategory(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar categoria.");
    }
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      refetch();
      setEditCategory(null);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar categoria.");
    }
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Categoria excluída com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir categoria.");
    }
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSave = () => {
    if (!editCategory?.name.trim()) {
      toast.error("O nome é obrigatório.");
      return;
    }

    const data = {
      name: editCategory.name,
      slug: editCategory.slug || generateSlug(editCategory.name),
      description: editCategory.description || undefined,
    };

    if (editCategory.id) {
      updateMutation.mutate({ id: editCategory.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading text-afk-gray-dark">Categorias</h1>
        <Button 
          className="btn-primary"
          onClick={() => setEditCategory({ name: "", slug: "", description: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-afk-yellow mx-auto" />
          </div>
        ) : categories && categories.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-gray-500">{category.slug}</TableCell>
                  <TableCell className="text-gray-500 max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Editar"
                        onClick={() => setEditCategory({
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                          description: category.description || "",
                        })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Excluir"
                        onClick={() => setDeleteId(category.id)}
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
            Nenhuma categoria criada ainda.
          </div>
        )}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={editCategory !== null} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory?.id ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={editCategory?.name || ""}
                onChange={(e) => setEditCategory(prev => prev ? {
                  ...prev,
                  name: e.target.value,
                  slug: prev.id ? prev.slug : generateSlug(e.target.value),
                } : null)}
                placeholder="Nome da categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={editCategory?.slug || ""}
                onChange={(e) => setEditCategory(prev => prev ? {
                  ...prev,
                  slug: e.target.value,
                } : null)}
                placeholder="slug-da-categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editCategory?.description || ""}
                onChange={(e) => setEditCategory(prev => prev ? {
                  ...prev,
                  description: e.target.value,
                } : null)}
                placeholder="Descrição da categoria..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditCategory(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="btn-primary" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Os posts associados ficarão sem categoria.
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

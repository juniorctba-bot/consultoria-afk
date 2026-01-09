import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Tag,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function AdminTags() {
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
      <TagsManager />
    </DashboardLayout>
  );
}

function TagsManager() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<{ id: number; name: string; slug: string; color: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", color: "#FFCE00" });

  const { data: tags, isLoading, refetch } = trpc.tags.listWithCount.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.tags.create.useMutation({
    onSuccess: () => {
      toast.success("Tag criada com sucesso!");
      setDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar tag.");
    }
  });

  const updateMutation = trpc.tags.update.useMutation({
    onSuccess: () => {
      toast.success("Tag atualizada com sucesso!");
      setDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar tag.");
    }
  });

  const deleteMutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      toast.success("Tag excluída com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir tag.");
    }
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", color: "#FFCE00" });
    setEditingTag(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (tag: { id: number; name: string; slug: string; color: string | null }) => {
    setEditingTag({ id: tag.id, name: tag.name, slug: tag.slug, color: tag.color || "#FFCE00" });
    setFormData({ name: tag.name, slug: tag.slug, color: tag.color || "#FFCE00" });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("O nome da tag é obrigatório.");
      return;
    }

    if (editingTag) {
      updateMutation.mutate({
        id: editingTag.id,
        name: formData.name,
        slug: formData.slug || undefined,
        color: formData.color,
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        slug: formData.slug || undefined,
        color: formData.color,
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a tag "${name}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-afk-gray-dark">Tags</h1>
          <p className="text-afk-gray mt-1">Gerencie as tags do blog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Editar Tag" : "Nova Tag"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: !editingTag ? generateSlug(name) : prev.slug,
                    }));
                  }}
                  placeholder="Nome da tag"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="slug-da-tag"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#FFCE00"
                    className="flex-1"
                  />
                  <div 
                    className="w-10 h-10 rounded-lg border"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="btn-primary" disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTag ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
          </div>
        ) : tags && tags.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead className="text-center">Posts</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-afk-gray" />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-afk-gray">{tag.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: tag.color || "#FFCE00" }}
                      />
                      <span className="text-sm text-afk-gray">{tag.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {tag.postCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(tag)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tag.id, tag.name)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-afk-gray-dark mb-2">
              Nenhuma tag cadastrada
            </h3>
            <p className="text-afk-gray mb-4">
              Crie tags para organizar os posts do blog.
            </p>
            <Button className="btn-primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira tag
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

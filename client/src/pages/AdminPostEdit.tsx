import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  LayoutDashboard,
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Plus,
  Trash2,
  GripVertical,
  Images,
  Tag,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: FileText, label: "Posts" },
  { href: "/admin/categorias", icon: FolderOpen, label: "Categorias" },
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function AdminPostEdit() {
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
      <PostEditor />
    </DashboardLayout>
  );
}

function PostEditor() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const postId = params.id === "novo" ? null : Number(params.id);
  const isNew = !postId;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [newImageCaption, setNewImageCaption] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    categoryId: null as number | null,
    published: false,
  });
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const { data: post, isLoading: postLoading } = trpc.posts.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: allTags } = trpc.tags.list.useQuery();
  
  // Tags queries
  const { data: postTags, refetch: refetchTags } = trpc.tags.getPostTags.useQuery(
    { postId: postId! },
    { enabled: !!postId }
  );
  
  // Gallery queries
  const { data: galleryImages, refetch: refetchGallery } = trpc.gallery.getByPost.useQuery(
    { postId: postId! },
    { enabled: !!postId }
  );
  const utils = trpc.useUtils();

  const createMutation = trpc.posts.create.useMutation({
    onSuccess: async (data) => {
      // Save tags for the new post
      if (selectedTags.length > 0) {
        await setTagsMutation.mutateAsync({ postId: data.id, tagIds: selectedTags });
      }
      toast.success("Post criado com sucesso!");
      setLocation(`/admin/posts/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar post.");
    }
  });

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: async () => {
      // Save tags for the post
      if (postId) {
        await setTagsMutation.mutateAsync({ postId, tagIds: selectedTags });
      }
      toast.success("Post atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar post.");
    }
  });

  const uploadMutation = trpc.upload.image.useMutation({
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      toast.success("Imagem enviada com sucesso!");
      setUploading(false);
    },
    onError: () => {
      toast.error("Erro ao enviar imagem.");
      setUploading(false);
    }
  });

  // Gallery mutations
  const addGalleryMutation = trpc.gallery.add.useMutation({
    onSuccess: () => {
      toast.success("Imagem adicionada à galeria!");
      refetchGallery();
      setUploadingGallery(false);
      setNewImageCaption("");
    },
    onError: () => {
      toast.error("Erro ao adicionar imagem.");
      setUploadingGallery(false);
    }
  });

  const deleteGalleryMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success("Imagem removida da galeria!");
      refetchGallery();
    },
    onError: () => {
      toast.error("Erro ao remover imagem.");
    }
  });

  const updateGalleryMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      refetchGallery();
    }
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        imageUrl: post.imageUrl || "",
        categoryId: post.categoryId,
        published: post.published,
      });
    }
  }, [post]);

  useEffect(() => {
    if (postTags) {
      setSelectedTags(postTags.map(t => t.id));
    }
  }, [postTags]);

  const setTagsMutation = trpc.tags.setPostTags.useMutation({
    onSuccess: () => {
      refetchTags();
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        filename: file.name,
        contentType: file.type,
        base64Data: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} não é uma imagem válida.`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede 5MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        
        // First upload the image
        const uploadResult = await uploadMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data: base64,
        });

        // Then add to gallery
        if (postId && uploadResult.url) {
          await addGalleryMutation.mutateAsync({
            postId: postId,
            imageUrl: uploadResult.url,
            caption: newImageCaption || undefined,
            sortOrder: (galleryImages?.length || 0) + i,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGalleryImage = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta imagem da galeria?")) {
      deleteGalleryMutation.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("O conteúdo é obrigatório.");
      return;
    }

    const data = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      imageUrl: formData.imageUrl || undefined,
      categoryId: formData.categoryId || undefined,
      published: formData.published,
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: postId!, ...data });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (postLoading && postId) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-afk-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-heading text-afk-gray-dark">
            {isNew ? "Novo Post" : "Editar Post"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {!isNew && formData.slug && (
            <Link href={`/blog/${formData.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          )}
          <Button 
            onClick={handleSubmit} 
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Título do post"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="url-do-post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Breve descrição do post..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo * (Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Escreva o conteúdo do post em Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Gallery Section - Only show for existing posts */}
          {!isNew && postId && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-afk-gray-dark flex items-center gap-2">
                  <Images className="w-5 h-5" />
                  Galeria de Imagens
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploadingGallery}
                >
                  {uploadingGallery ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Adicionar Imagens
                </Button>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />

              {galleryImages && galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.caption || `Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteGalleryImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                          <p className="text-white text-xs truncate">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Images className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma imagem na galeria</p>
                  <p className="text-sm">Clique em "Adicionar Imagens" para começar</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-afk-gray-dark">Publicação</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="published">Publicar</Label>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-afk-gray-dark">Categoria</h3>
            
            <Select
              value={formData.categoryId?.toString() || "none"}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                categoryId: value === "none" ? null : Number(value) 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-afk-gray-dark flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tags
            </h3>
            
            {allTags && allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(prev => prev.filter(id => id !== tag.id));
                        } else {
                          setSelectedTags(prev => [...prev, tag.id]);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? "ring-2 ring-offset-1 ring-afk-gray-dark"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: tag.color || "#FFCE00", color: "#333" }}
                    >
                      <Hash className="w-3 h-3" />
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhuma tag cadastrada. <Link href="/admin/tags" className="text-afk-yellow-dark hover:underline">Criar tags</Link>
              </p>
            )}
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-afk-gray-dark">Imagem de Destaque</h3>
            
            {formData.imageUrl ? (
              <div className="relative">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full aspect-video object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-afk-yellow transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-afk-yellow mx-auto" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique para enviar</p>
                  </>
                )}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Ou cole a URL da imagem</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Gallery Info for new posts */}
          {isNew && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <Images className="w-5 h-5" />
                Galeria de Imagens
              </h3>
              <p className="text-sm text-amber-700">
                Salve o post primeiro para adicionar imagens à galeria.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

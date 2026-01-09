import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  LayoutDashboard,
  Trash2,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  Building2,
  Calendar,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
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
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function AdminContatos() {
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
      <ContatosList />
    </DashboardLayout>
  );
}

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

function ContatosList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  
  const { data: contacts, isLoading, refetch } = trpc.contact.list.useQuery();
  
  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Contato excluído com sucesso!");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir contato.");
    }
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewContact = (contact: Contact) => {
    setViewContact(contact);
    if (!contact.read) {
      markAsReadMutation.mutate({ id: contact.id });
    }
  };

  const unreadCount = contacts?.filter(c => !c.read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-heading text-afk-gray-dark">Contatos</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-afk-yellow text-afk-gray-dark">
              {unreadCount} não lido{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-afk-yellow mx-auto" />
          </div>
        ) : contacts && contacts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow 
                  key={contact.id} 
                  className={`cursor-pointer ${!contact.read ? "bg-afk-yellow/5" : ""}`}
                  onClick={() => handleViewContact(contact)}
                >
                  <TableCell>
                    {contact.read ? (
                      <MailOpen className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-afk-yellow-dark" />
                    )}
                  </TableCell>
                  <TableCell className={`font-medium ${!contact.read ? "text-afk-gray-dark" : ""}`}>
                    {contact.name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell className="text-gray-500">
                    {contact.company || "-"}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      title="Excluir"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(contact.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-afk-gray">
            Nenhum contato recebido ainda.
          </div>
        )}
      </div>

      {/* View Contact Dialog */}
      <Dialog open={viewContact !== null} onOpenChange={() => setViewContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
          </DialogHeader>
          {viewContact && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-afk-yellow/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-afk-yellow-dark" />
                </div>
                <div>
                  <p className="font-semibold text-afk-gray-dark">{viewContact.name}</p>
                  <p className="text-sm text-gray-500">{viewContact.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {viewContact.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {viewContact.phone}
                  </div>
                )}
                {viewContact.company && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    {viewContact.company}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(viewContact.createdAt)}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Mensagem:</p>
                <p className="text-afk-gray-dark whitespace-pre-wrap">{viewContact.message}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <a 
                  href={`mailto:${viewContact.email}`}
                  className="btn-primary flex-1 text-center"
                >
                  Responder por E-mail
                </a>
                {viewContact.phone && (
                  <a 
                    href={`https://wa.me/55${viewContact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex-1 text-center"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Contato</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
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

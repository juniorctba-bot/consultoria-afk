import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
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
  X,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
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
  { href: "/admin/tags", icon: Tag, label: "Tags" },
  { href: "/admin/contatos", icon: MessageSquare, label: "Contatos" },
];

export default function AdminContatos() {
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

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setLocation('/admin/login');
  };

  return (
    <AdminLayout navItems={navItems} title="Painel de Postagens" onLogout={handleLogout}>
      <ContatosList />
    </AdminLayout>
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
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data: contacts } = trpc.contact.list.useQuery();
  const markAsReadMutation = trpc.contact.markAsRead.useMutation({
    onSuccess: () => {
      trpc.useUtils().contact.list.invalidate();
    },
  });
  const deleteContactMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      trpc.useUtils().contact.list.invalidate();
      toast.success("Contato deletado com sucesso");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao deletar contato");
    },
  });

  const selectedContact = contacts?.find((c: Contact) => c.id === detailsId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading text-afk-gray-dark">Contatos</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.map((contact: Contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    {contact.read ? (
                      <MailOpen className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-afk-yellow-dark" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.company || "-"}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetailsId(contact.id);
                          if (!contact.read) {
                            markAsReadMutation.mutate({ id: contact.id });
                          }
                        }}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(contact.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {(!contacts || contacts.length === 0) && (
          <div className="p-8 text-center text-afk-gray">
            Nenhum contato recebido ainda.
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!detailsId} onOpenChange={() => setDetailsId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Contato</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{selectedContact.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium">{selectedContact.company || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Mensagem</p>
                <p className="p-4 bg-gray-50 rounded-lg">{selectedContact.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Contato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteContactMutation.mutate({ id: deleteId });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

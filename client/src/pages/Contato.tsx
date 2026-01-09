import { useState } from "react";
import { 
  Phone, 
  Mail, 
  Instagram, 
  Linkedin, 
  MapPin,
  Send,
  CheckCircle,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Phone,
    title: "WhatsApp",
    value: "(41) 99677-7004",
    href: "https://wa.me/5541996777004",
    external: true
  },
  {
    icon: Mail,
    title: "E-mail",
    value: "contato@consultoriaafk.com.br",
    href: "mailto:contato@consultoriaafk.com.br",
    external: false
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@consultoriaafk",
    href: "https://instagram.com/consultoriaafk",
    external: true
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    value: "consultoria-afk",
    href: "https://linkedin.com/company/consultoria-afk",
    external: true
  }
];

export default function Contato() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      toast.success("Mensagem enviada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-afk-gray-dark to-afk-gray">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-gray-300">
              Estamos prontos para ajudar sua empresa a crescer com estrutura 
              e controle financeiro.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-heading text-afk-gray-dark mb-6">
                Fale Conosco
              </h2>
              <p className="text-afk-gray mb-8 leading-relaxed">
                Entre em contato conosco para uma conversa sem compromisso. 
                Queremos entender sua situação e indicar a melhor solução 
                para sua empresa.
              </p>
              
              <div className="space-y-6 mb-12">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-afk-yellow/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-afk-yellow rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-afk-gray-dark" />
                    </div>
                    <div>
                      <p className="text-sm text-afk-gray">{item.title}</p>
                      <p className="text-afk-gray-dark font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-afk-yellow/20 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-afk-gray-dark mb-2">
                  Prefere uma resposta rápida?
                </h3>
                <p className="text-afk-gray mb-4">
                  Fale diretamente conosco pelo WhatsApp para um atendimento imediato.
                </p>
                <a 
                  href="https://wa.me/5541996777004" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-heading text-afk-gray-dark mb-4">
                    Mensagem Enviada!
                  </h3>
                  <p className="text-afk-gray mb-6">
                    Obrigado pelo contato. Retornaremos em breve.
                  </p>
                  <Button 
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-afk-gray text-afk-gray"
                  >
                    Enviar Nova Mensagem
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-heading text-afk-gray-dark mb-6">
                    Envie sua Mensagem
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Como podemos ajudar sua empresa?"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

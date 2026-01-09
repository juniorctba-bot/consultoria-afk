import { Link } from "wouter";
import { 
  ArrowRight, 
  TrendingUp, 
  Users, 
  FileText, 
  Building2, 
  Globe, 
  Lightbulb,
  CheckCircle,
  Phone,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const services = [
  {
    icon: TrendingUp,
    title: "Finance as a Service",
    description: "Gestão financeira terceirizada completa para sua empresa crescer com estrutura.",
    slug: "finance-as-a-service"
  },
  {
    icon: Users,
    title: "Executive as a Service",
    description: "Gestão interina durante transições com passagem de bastão segura.",
    slug: "executive-as-a-service"
  },
  {
    icon: FileText,
    title: "Políticas Financeiras",
    description: "Implementação de políticas e processos financeiros padronizados.",
    slug: "politicas-financeiras"
  },
  {
    icon: Building2,
    title: "Estruturação de FIDC",
    description: "Fundo de Investimento em Direitos Creditórios para otimização tributária.",
    slug: "fidc"
  },
  {
    icon: Globe,
    title: "Importação/Exportação",
    description: "Gestão financeira especializada em comércio exterior.",
    slug: "importacao-exportacao"
  },
  {
    icon: Lightbulb,
    title: "Consultoria Personalizada",
    description: "Diagnóstico financeiro e planos de ação customizados.",
    slug: "consultoria-personalizada"
  }
];

const benefits = [
  "Mais de 25 anos de experiência em gestão financeira",
  "Atendimento personalizado para cada empresa",
  "Metodologia comprovada de resultados",
  "Foco em PMEs em crescimento",
  "Equipe especializada e dedicada",
  "Suporte contínuo e acompanhamento"
];

export default function Home() {
  const { data: recentPosts } = trpc.posts.recent.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/ana-flavia.png" 
            alt="Ana Flávia Krisanovski"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-block bg-afk-yellow/20 text-afk-gray-dark px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              Consultoria Financeira Especializada
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-afk-gray-dark leading-tight mb-6 animate-fade-in-delay-1">
              Transformando a gestão financeira da sua empresa
            </h1>
            <p className="text-lg md:text-xl text-afk-gray mb-8 animate-fade-in-delay-2">
              Crescer com estrutura, controle e consistência. Soluções personalizadas 
              para PMEs que precisam organizar suas finanças e escalar com segurança.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
              <a 
                href="https://wa.me/5541996777004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Fale com um Especialista
              </a>
              <Link href="/servicos">
                <Button variant="outline" className="w-full sm:w-auto border-afk-gray text-afk-gray hover:bg-afk-gray hover:text-white">
                  Conheça Nossos Serviços
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">Nossos Serviços</h2>
            <p className="section-subtitle">
              Soluções completas para transformar a gestão financeira da sua empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link 
                key={service.slug} 
                href={`/servicos#${service.slug}`}
                className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-afk-yellow/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-afk-yellow transition-colors">
                  <service.icon className="w-7 h-7 text-afk-gray-dark" />
                </div>
                <h3 className="text-xl font-semibold text-afk-gray-dark mb-3">
                  {service.title}
                </h3>
                <p className="text-afk-gray mb-4">
                  {service.description}
                </p>
                <span className="text-afk-yellow-dark font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Saiba mais <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="/images/equipe.png" 
                alt="Equipe AFK Consultoria"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="section-title mb-6">
                Sobre a AFK Consultoria
              </h2>
              <p className="text-afk-gray text-lg mb-6 leading-relaxed">
                A AFK Consultoria nasceu da experiência de mais de 25 anos de 
                <strong> Ana Flávia Krisanovski</strong> em gestão financeira de empresas 
                de diversos portes e segmentos.
              </p>
              <p className="text-afk-gray mb-8 leading-relaxed">
                Nossa missão é transformar a gestão financeira de PMEs que cresceram 
                rápido ou estão em transição, oferecendo estrutura, controle e 
                consistência para que possam continuar crescendo de forma sustentável.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {benefits.slice(0, 6).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-afk-yellow flex-shrink-0 mt-0.5" />
                    <span className="text-afk-gray text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/sobre">
                <Button className="btn-primary">
                  Conheça Nossa História
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-afk-gray-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white mb-6">
              Pronto para transformar a gestão financeira da sua empresa?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Entre em contato conosco e descubra como podemos ajudar sua empresa 
              a crescer com estrutura e controle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5541996777004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Falar pelo WhatsApp
              </a>
              <Link href="/contato">
                <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-afk-gray-dark">
                  Enviar Mensagem
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h2 className="section-title mb-2">Blog</h2>
                <p className="section-subtitle">
                  Conteúdo sobre gestão financeira para sua empresa
                </p>
              </div>
              <Link href="/blog" className="mt-4 md:mt-0">
                <Button variant="outline" className="border-afk-gray text-afk-gray hover:bg-afk-gray hover:text-white">
                  Ver Todos os Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {post.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-medium text-afk-yellow-dark uppercase tracking-wide">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-afk-gray-dark mt-2 mb-3 group-hover:text-afk-yellow-dark transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-afk-gray text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

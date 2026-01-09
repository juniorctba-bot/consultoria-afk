import { Link } from "wouter";
import { 
  Award, 
  Target, 
  Heart, 
  Briefcase,
  GraduationCap,
  TrendingUp,
  Users,
  CheckCircle,
  Phone,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Foco em Resultados",
    description: "Trabalhamos orientados por metas claras e mensuráveis para garantir o sucesso dos nossos clientes."
  },
  {
    icon: Heart,
    title: "Compromisso",
    description: "Tratamos cada empresa como se fosse nossa, com dedicação e responsabilidade total."
  },
  {
    icon: Award,
    title: "Excelência",
    description: "Buscamos constantemente a melhoria dos nossos processos e entregas."
  },
  {
    icon: Users,
    title: "Parceria",
    description: "Construímos relacionamentos de longo prazo baseados em confiança e transparência."
  }
];

const timeline = [
  {
    year: "1998",
    title: "Início da Carreira",
    description: "Ana Flávia inicia sua trajetória profissional na área financeira."
  },
  {
    year: "2005",
    title: "Gestão de Grandes Empresas",
    description: "Assume posições de liderança financeira em empresas de médio e grande porte."
  },
  {
    year: "2015",
    title: "Especialização em PMEs",
    description: "Foco em ajudar pequenas e médias empresas a estruturar suas finanças."
  },
  {
    year: "2020",
    title: "Fundação da AFK",
    description: "Nasce a AFK Consultoria, consolidando anos de experiência em gestão financeira."
  }
];

export default function Sobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-afk-gray-dark to-afk-gray">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
              Sobre a AFK Consultoria
            </h1>
            <p className="text-xl text-gray-300">
              Mais de 25 anos de experiência transformando a gestão financeira 
              de empresas em todo o Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* About Ana Flávia */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="/images/ana-flavia.png" 
                alt="Ana Flávia Krisanovski"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <span className="text-afk-yellow-dark font-medium uppercase tracking-wide text-sm">
                Fundadora
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-afk-gray-dark mt-2 mb-6">
                Ana Flávia Krisanovski
              </h2>
              <p className="text-afk-gray text-lg mb-6 leading-relaxed">
                Economista com mais de <strong>25 anos de experiência</strong> em gestão 
                financeira, Ana Flávia construiu sua carreira ajudando empresas de 
                diversos portes e segmentos a estruturar e profissionalizar suas 
                áreas financeiras.
              </p>
              <p className="text-afk-gray mb-6 leading-relaxed">
                Ao longo de sua trajetória, atuou em posições de liderança como 
                CFO e Controller em empresas nacionais e multinacionais, 
                desenvolvendo expertise em planejamento financeiro, gestão de 
                fluxo de caixa, estruturação de FIDC e processos de importação 
                e exportação.
              </p>
              <p className="text-afk-gray mb-8 leading-relaxed">
                A AFK Consultoria nasceu da paixão por transformar a realidade 
                financeira de PMEs brasileiras, oferecendo o mesmo nível de 
                gestão que grandes corporações possuem, de forma acessível e 
                personalizada.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <GraduationCap className="w-5 h-5 text-afk-yellow-dark" />
                  <span className="text-sm text-afk-gray-dark">Economista</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Briefcase className="w-5 h-5 text-afk-yellow-dark" />
                  <span className="text-sm text-afk-gray-dark">+25 anos de experiência</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <TrendingUp className="w-5 h-5 text-afk-yellow-dark" />
                  <span className="text-sm text-afk-gray-dark">Especialista em PMEs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-afk-yellow rounded-lg flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-afk-gray-dark" />
              </div>
              <h3 className="text-2xl font-heading text-afk-gray-dark mb-4">
                Nossa Missão
              </h3>
              <p className="text-afk-gray leading-relaxed">
                Transformar a gestão financeira de PMEs que cresceram rápido ou 
                estão em transição, oferecendo estrutura, controle e consistência 
                para que possam continuar crescendo de forma sustentável.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-afk-yellow rounded-lg flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-afk-gray-dark" />
              </div>
              <h3 className="text-2xl font-heading text-afk-gray-dark mb-4">
                Nossa Visão
              </h3>
              <p className="text-afk-gray leading-relaxed">
                Ser reconhecida como a principal referência em consultoria 
                financeira para PMEs no Brasil, contribuindo para o crescimento 
                sustentável e a profissionalização das empresas brasileiras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-4">Nossos Valores</h2>
            <p className="section-subtitle">
              Os princípios que guiam nosso trabalho e relacionamento com clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-xl border border-gray-100 hover:border-afk-yellow transition-colors"
              >
                <div className="w-16 h-16 bg-afk-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-afk-yellow-dark" />
                </div>
                <h3 className="text-xl font-semibold text-afk-gray-dark mb-3">
                  {value.title}
                </h3>
                <p className="text-afk-gray text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-afk-gray-dark">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-gray-300">
              Uma história construída com dedicação e resultados
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-afk-yellow rounded-full flex items-center justify-center text-afk-gray-dark font-bold text-sm">
                      {item.year}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-afk-yellow/30 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-afk-yellow">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-afk-gray-dark mb-6">
              Vamos conversar sobre sua empresa?
            </h2>
            <p className="text-afk-gray text-lg mb-8">
              Entre em contato e descubra como podemos ajudar sua empresa 
              a crescer com estrutura e controle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5541996777004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Falar pelo WhatsApp
              </a>
              <Link href="/contato">
                <Button variant="outline" className="w-full sm:w-auto border-afk-gray-dark text-afk-gray-dark hover:bg-afk-gray-dark hover:text-white">
                  Enviar Mensagem
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

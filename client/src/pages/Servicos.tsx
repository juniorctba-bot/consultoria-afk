import { useEffect } from "react";
import { useLocation } from "wouter";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Building2, 
  Globe, 
  Lightbulb,
  CheckCircle,
  Phone,
  ArrowRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "finance-as-a-service",
    icon: TrendingUp,
    title: "Finance as a Service",
    subtitle: "Estruturação Financeira como Serviço",
    description: "Gestão financeira terceirizada completa para empresas que precisam de estrutura profissional sem o custo de uma equipe interna.",
    benefits: [
      "Gestão completa de contas a pagar e receber",
      "Controle de fluxo de caixa",
      "Relatórios gerenciais mensais",
      "Análise de indicadores financeiros",
      "Planejamento orçamentário",
      "Suporte à tomada de decisão"
    ],
    ideal: "Ideal para PMEs em crescimento que precisam profissionalizar a gestão financeira."
  },
  {
    id: "executive-as-a-service",
    icon: Users,
    title: "Executive as a Service",
    subtitle: "Transição de Gestão Financeira",
    description: "Gestão interina durante períodos de transição, garantindo continuidade operacional e passagem de bastão segura.",
    benefits: [
      "Gestão interina de CFO/Controller",
      "Transição segura entre gestores",
      "Manutenção da operação financeira",
      "Treinamento de novos colaboradores",
      "Documentação de processos",
      "Mentoria para equipe financeira"
    ],
    ideal: "Ideal para empresas em transição de gestão ou que precisam de liderança financeira temporária."
  },
  {
    id: "politicas-financeiras",
    icon: FileText,
    title: "Políticas Financeiras",
    subtitle: "Implementação de Políticas e Processos",
    description: "Criação e implementação de políticas e processos financeiros padronizados para garantir controle e governança.",
    benefits: [
      "Mapeamento de processos atuais",
      "Criação de políticas financeiras",
      "Definição de alçadas e aprovações",
      "Implementação de controles internos",
      "Treinamento de equipe",
      "Acompanhamento pós-implementação"
    ],
    ideal: "Ideal para empresas que precisam estruturar e padronizar seus processos financeiros."
  },
  {
    id: "fidc",
    icon: Building2,
    title: "Estruturação de FIDC",
    subtitle: "Fundo de Investimento em Direitos Creditórios",
    description: "Estruturação e operação de FIDC para otimização tributária e melhoria do fluxo de caixa da empresa.",
    benefits: [
      "Análise de viabilidade do FIDC",
      "Estruturação do fundo",
      "Seleção de prestadores de serviço",
      "Operação e gestão do FIDC",
      "Redução de carga tributária",
      "Melhoria do capital de giro"
    ],
    ideal: "Ideal para empresas com grande volume de recebíveis que buscam otimização tributária."
  },
  {
    id: "importacao-exportacao",
    icon: Globe,
    title: "Importação/Exportação",
    subtitle: "Gestão Financeira de Comércio Exterior",
    description: "Gestão financeira especializada em operações de comércio exterior, incluindo câmbio, financiamentos e controles.",
    benefits: [
      "Gestão de operações de câmbio",
      "Controle de contratos de importação",
      "Análise de financiamentos internacionais",
      "Hedge cambial",
      "Relatórios de operações",
      "Compliance de comércio exterior"
    ],
    ideal: "Ideal para empresas que operam com importação e/ou exportação."
  },
  {
    id: "consultoria-personalizada",
    icon: Lightbulb,
    title: "Consultoria Personalizada",
    subtitle: "Diagnóstico e Planos de Ação",
    description: "Diagnóstico financeiro completo e desenvolvimento de planos de ação customizados para as necessidades específicas da sua empresa.",
    benefits: [
      "Diagnóstico financeiro completo",
      "Identificação de oportunidades",
      "Plano de ação personalizado",
      "Acompanhamento de implementação",
      "Mentoria para gestores",
      "Suporte contínuo"
    ],
    ideal: "Ideal para empresas que precisam de orientação estratégica financeira."
  }
];

export default function Servicos() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to section if hash is present
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-afk-gray-dark to-afk-gray">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl text-gray-300">
              Soluções completas em gestão financeira para empresas que querem 
              crescer com estrutura, controle e consistência.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 bg-afk-yellow rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-8 h-8 text-afk-gray-dark" />
                  </div>
                  <span className="text-afk-yellow-dark font-medium uppercase tracking-wide text-sm">
                    {service.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading text-afk-gray-dark mt-2 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-afk-gray text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-afk-gray-dark font-medium mb-6 bg-afk-yellow/10 p-4 rounded-lg">
                    {service.ideal}
                  </p>
                  <a 
                    href="https://wa.me/5541996777004" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Solicitar Proposta
                  </a>
                </div>
                
                <div className={`bg-gray-50 rounded-2xl p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h3 className="text-xl font-semibold text-afk-gray-dark mb-6">
                    O que inclui:
                  </h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-afk-yellow flex-shrink-0 mt-0.5" />
                        <span className="text-afk-gray">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-afk-yellow">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading text-afk-gray-dark mb-6">
              Não sabe qual serviço é ideal para sua empresa?
            </h2>
            <p className="text-afk-gray text-lg mb-8">
              Entre em contato conosco para uma conversa sem compromisso. 
              Vamos entender sua situação e indicar a melhor solução.
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
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

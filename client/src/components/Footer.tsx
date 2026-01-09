import { Link } from "wouter";
import { Phone, Mail, Instagram, Linkedin, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-afk-gray-dark text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img
              src="/images/logo-afk.png"
              alt="AFK Consultoria"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Transformando a gestão financeira da sua empresa para crescer com
              estrutura, controle e consistência.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-afk-yellow">
              Links Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/servicos"
                  className="text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  Serviços
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-afk-yellow">
              Serviços
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">Finance as a Service</li>
              <li className="text-gray-300">Executive as a Service</li>
              <li className="text-gray-300">Políticas Financeiras</li>
              <li className="text-gray-300">Estruturação de FIDC</li>
              <li className="text-gray-300">Importação/Exportação</li>
              <li className="text-gray-300">Consultoria Personalizada</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-afk-yellow">
              Contato
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5541996777004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (41) 99677-7004
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@consultoriaafk.com.br"
                  className="flex items-center gap-2 text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contato@consultoriaafk.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/consultoriaafk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  @consultoriaafk
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/consultoria-afk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-afk-yellow transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  consultoria-afk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} AFK Consultoria. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/consultoriaafk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-afk-yellow transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/company/consultoria-afk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-afk-yellow transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Sistema Avançado de Gestão Financeira
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Assuma o controle das suas finanças com ferramentas e insights
            poderosos
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button variant="primary" size="lg">
                Começar Agora
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Entrar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Rastreie Transações</h3>
            <p className="text-gray-600">
              Registre receitas e despesas com categorização detalhada e tags
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Relatórios Avançados</h3>
            <p className="text-gray-600">
              Gere relatórios financeiros detalhados com gráficos e opções de
              exportação
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Seguro e Privado</h3>
            <p className="text-gray-600">
              Segurança de nível bancário com OAuth 2.0 e armazenamento de dados
              criptografados
            </p>
          </div>
        </div>

        <div className="card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Recursos Principais
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Gestão de Transações</h4>
                <p className="text-sm text-gray-600">
                  Operações completas de CRUD com filtragem avançada
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Organização por Categorias</h4>
                <p className="text-sm text-gray-600">
                  Categorias hierárquicas com subcategorias e tags
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Anexos de Arquivos</h4>
                <p className="text-sm text-gray-600">
                  Envie recibos para AWS S3 ou Google Drive
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Notificações por Email</h4>
                <p className="text-sm text-gray-600">
                  Alertas automatizados para transações e orçamentos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Integração de Pagamentos</h4>
                <p className="text-sm text-gray-600">
                  Integração com Stripe para pagamentos sem complicações
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <h4 className="font-semibold">Exportar Relatórios</h4>
                <p className="text-sm text-gray-600">
                  Baixe relatórios nos formatos CSV e PDF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

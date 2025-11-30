# 💰 Sistema de Gerenciamento Financeiro

> Sistema completo de gestão financeira pessoal desenvolvido com Next.js 14, TypeScript, Prisma e Tailwind CSS

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

---

## 📋 Sobre o Projeto

Sistema profissional de gestão financeira que permite controlar receitas, despesas, gerar relatórios detalhados e visualizar análises através de gráficos interativos. Desenvolvido com as melhores práticas de desenvolvimento web moderno.

### ✨ Principais Funcionalidades

- 💸 **Gestão Completa de Transações** - CRUD de receitas e despesas com categorização
- 📊 **Dashboard Interativo** - Visualização em tempo real com gráficos e métricas
- 🏷️ **Categorias Personalizadas** - Organização com cores e ícones customizáveis
- 📈 **Relatórios Detalhados** - Análise financeira com filtros e exportação (CSV/PDF)
- 📁 **Anexos de Comprovantes** - Upload de recibos e documentos
- 🔐 **Sistema de Autenticação** - Login/registro seguro com NextAuth.js
- 🌐 **100% em Português (BR)** - Interface totalmente traduzida

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com SSR e App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Estilização moderna e responsiva
- **Chart.js** - Gráficos interativos e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Node.js** - Runtime JavaScript
- **Prisma ORM** - Gerenciamento de banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **NextAuth.js** - Autenticação e gerenciamento de sessões
- **bcrypt** - Criptografia de senhas

### Ferramentas
- **Jest** - Testes unitários
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

---

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/GerenciamentoFinanceiro.git
cd GerenciamentoFinanceiro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Execute as migrations do banco de dados**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:3000
```

---

## 🎯 Como Usar

### 1️⃣ Criar Conta
- Acesse a página inicial
- Clique em "Começar Agora"
- Preencha seus dados e crie sua conta

### 2️⃣ Configurar Categorias
- Vá em "Categorias"
- Crie categorias como: Alimentação, Transporte, Salário, etc.
- Personalize com cores

### 3️⃣ Registrar Transações
- Acesse "Transações"
- Clique em "+ Nova Transação"
- Preencha os dados (tipo, valor, categoria, data)
- Salve

### 4️⃣ Visualizar Dashboard
- O painel principal mostra:
  - Receitas e Despesas Totais
  - Saldo atual
  - Gráfico de tendência mensal
  - Distribuição por categorias
  - Transações recentes

### 5️⃣ Gerar Relatórios
- Vá em "Relatórios"
- Selecione o período desejado
- Visualize o detalhamento
- Exporte em CSV ou PDF

---

## 📁 Estrutura do Projeto

```
GERENCIADOR-DE-FINANÇAS/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── dev.db                 # Banco SQLite (local)
├── src/
│   ├── app/                   # Páginas Next.js (App Router)
│   │   ├── api/              # API Routes
│   │   ├── auth/             # Páginas de autenticação
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── transactions/     # Gestão de transações
│   │   ├── categories/       # Gestão de categorias
│   │   └── reports/          # Relatórios financeiros
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes de interface
│   │   └── charts/          # Componentes de gráficos
│   ├── lib/                  # Utilitários e configurações
│   ├── services/             # Lógica de negócios
│   ├── middlewares/          # Middlewares (auth, etc)
│   └── styles/               # Estilos globais
├── public/                   # Arquivos estáticos
├── .env.example              # Exemplo de variáveis de ambiente
├── package.json              # Dependências do projeto
└── tailwind.config.js        # Configuração Tailwind
```

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm start                # Inicia servidor de produção

# Banco de Dados
npx prisma studio        # Interface visual do banco
npx prisma migrate dev   # Cria/aplica migrations
npx prisma generate      # Gera Prisma Client

# Testes
npm test                 # Executa testes
npm run test:watch       # Testes em modo watch

# Linting
npm run lint             # Verifica código
```

---

## 📊 Funcionalidades Detalhadas

### Dashboard
- ✅ Cards de resumo (Receitas, Despesas, Saldo)
- ✅ Gráfico de linha - Tendência mensal
- ✅ Gráfico de pizza - Distribuição por categorias
- ✅ Lista de transações recentes
- ✅ Ações rápidas (Nova transação, Ver relatórios)

### Transações
- ✅ Listagem com paginação
- ✅ Filtros (Todas/Receitas/Despesas)
- ✅ Criar, Editar e Deletar
- ✅ Categorização automática
- ✅ Anexo de comprovantes
- ✅ Busca e ordenação

### Categorias
- ✅ Criação ilimitada
- ✅ Seletor de cores
- ✅ Contador de transações
- ✅ Grid visual organizado
- ✅ Edição e exclusão

### Relatórios
- ✅ Filtros por período
- ✅ Breakdown detalhado por categoria
- ✅ Cálculo de percentuais
- ✅ Exportação CSV (Excel)
- ✅ Exportação PDF
- ✅ Visualização de tendências

---

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Senhas criptografadas (bcrypt)
- ✅ Proteção de rotas privadas
- ✅ Validação de dados (Zod)
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Rate limiting (produção)

---

## 🎨 Design System

### Cores Principais
- **Primary**: `#0284c7` - Azul principal
- **Success**: `#10b981` - Verde (receitas)
- **Danger**: `#ef4444` - Vermelho (despesas)
- **Warning**: `#f59e0b` - Amarelo (alertas)

### Componentes UI
- Button (Primary, Secondary, Success, Danger)
- Input (Text, Number, Date, Color)
- Card (Container com sombra)
- Charts (Line, Pie)

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte no Vercel
3. Configure variáveis de ambiente
4. Deploy automático

### Docker (Alternativa)

```bash
docker build -t gerenciamento-financeiro .
docker run -p 3000:3000 gerenciamento-financeiro
```

---

## 📝 Roadmap

### Futuras Melhorias
- [ ] App mobile (React Native)
- [ ] Multi-idiomas (i18n)
- [ ] Integração bancária (Open Banking)
- [ ] IA para análise de gastos
- [ ] Metas financeiras
- [ ] Notificações push
- [ ] Modo dark
- [ ] Suporte PostgreSQL/MySQL

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Autor

Desenvolvido com ❤️ para ajudar pessoas a ter controle total sobre suas finanças.

---

<div align="center">
  <strong>⭐ Se este projeto foi útil, deixe uma estrela! ⭐</strong>
</div>
POST /api/categories
Body: { name, description, color, icon, parentId }
```

#### Get Categories

```
GET /api/categories?all=true
```

### Reports

#### Generate Report

```
GET /api/reports?startDate=2024-01-01&endDate=2024-12-31&categoryId=xxx
```

#### Export to CSV

```
GET /api/reports/export/csv?format=transactions
```

#### Export to PDF/HTML

```
GET /api/reports/export/pdf
```

### File Upload

#### Upload Attachment

```
POST /api/upload
FormData: { file, transactionId, storageType }
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **Password Security**: Minimum 8 characters with bcrypt hashing
3. **API Security**: All endpoints require authentication
4. **SQL Injection**: Using Prisma ORM with parameterized queries
5. **XSS Protection**: Input validation with Zod
6. **HTTPS**: Always use SSL/TLS in production

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Deploy Backend to AWS Lambda

1. Configure AWS credentials
2. Use Serverless Framework or AWS SAM
3. Deploy API routes as Lambda functions

### Database Deployment

Use managed PostgreSQL services:

- Supabase
- AWS RDS
- Heroku Postgres
- Railway

## 📈 Performance Optimization

- **Caching**: Implement Redis for API caching
- **Database Indexing**: Indexes on userId, date, categoryId
- **Query Optimization**: Use Prisma's include and select wisely
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@financesystem.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications with WebSockets
- [ ] Multi-currency support
- [ ] Budget alerts and recommendations
- [ ] AI-powered expense categorization
- [ ] Bank account integration (Plaid)
- [ ] Investment tracking
- [ ] Tax calculation and reports

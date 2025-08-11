# 💰 FinanceApp - Aplicativo de Finanças Pessoais

Um aplicativo web moderno e intuitivo para gerenciamento de finanças pessoais, desenvolvido com React, Bootstrap e Supabase.

## ✨ Funcionalidades

-   **Dashboard Interativo**: Visão geral das finanças com cards de estatísticas e gráficos
-   **Gestão de Transações**: Adicionar, visualizar e filtrar receitas e despesas
-   **Categorização**: Organização automática por categorias predefinidas
-   **Relatórios Detalhados**: Gráficos de evolução mensal e análise por categorias
-   **Metas Financeiras**: Criar e acompanhar o progresso de objetivos financeiros
-   **Interface Moderna**: Design responsivo com gradientes e animações
-   **Autenticação Segura**: Sistema de login/registro com Supabase Auth
-   **Banco de Dados Real**: Dados persistidos no Supabase PostgreSQL

## 🚀 Tecnologias Utilizadas

-   **React 18** - Framework para construção da interface
-   **React Router DOM** - Navegação entre páginas
-   **Bootstrap 5** - Framework CSS para design responsivo
-   **Chart.js** - Biblioteca para gráficos interativos
-   **Font Awesome** - Ícones modernos
-   **Context API** - Gerenciamento de estado global
-   **Supabase** - Backend-as-a-Service (autenticação + banco de dados)

## 📋 Pré-requisitos

-   Node.js (versão 14 ou superior)
-   npm ou yarn
-   Conta no [Supabase](https://supabase.com)

## 🔧 Instalação e Configuração

### 1. Clone e instale dependências:

```bash
git clone <url-do-repositorio>
cd finance-app
npm install
```

### 2. Configure o Supabase:

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para **Settings** > **API** e copie:
    - **Project URL**
    - **Anon public key**

### 3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:

```env
REACT_APP_SUPABASE_URL=sua_url_do_projeto
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Execute as migrações do banco:

```bash
# Iniciar Supabase localmente (opcional para desenvolvimento)
npx supabase start

# Ou aplicar migrações diretamente no projeto remoto
npx supabase db push
```

### 5. Execute o projeto:

```bash
npm start
```

## 🗄️ Estrutura do Banco de Dados

O app usa as seguintes tabelas no Supabase:

### `transactions`

-   Armazena todas as receitas e despesas
-   Vinculadas ao usuário via `user_id`
-   RLS (Row Level Security) habilitado

### `goals`

-   Armazena metas financeiras dos usuários
-   Progresso atualizável em tempo real
-   RLS habilitado

### `categories`

-   Categorias predefinidas para transações
-   Compartilhadas entre todos os usuários
-   Tipos: income, expense, both

## 📱 Como Usar

### Primeiro Acesso

1. Acesse o app e clique em "Cadastrar"
2. Preencha email e senha
3. Confirme seu email (verifique a caixa de entrada)
4. Faça login com suas credenciais

### Dashboard

-   Visualize o saldo atual, receitas e despesas totais
-   Acompanhe as transações recentes
-   Analise gastos por categoria através do gráfico de pizza

### Transações

-   Clique em "Nova Transação" para adicionar receitas ou despesas
-   Use os filtros para encontrar transações específicas
-   Exclua transações desnecessárias

### Relatórios

-   Visualize a evolução mensal de receitas vs despesas
-   Acompanhe as estatísticas gerais das suas finanças
-   Identifique as categorias com maiores gastos

### Metas Financeiras

-   Crie metas com valor alvo e prazo
-   Atualize o progresso conforme economiza
-   Acompanhe visualmente o percentual alcançado

## 🎨 Características do Design

-   **Gradientes Modernos**: Interface com cores suaves e profissionais
-   **Cards Interativos**: Efeitos hover e animações suaves
-   **Responsivo**: Adaptável a diferentes tamanhos de tela
-   **Ícones Intuitivos**: Font Awesome para melhor UX
-   **Tipografia Clara**: Fontes legíveis e hierarquia visual

## 📊 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Auth.js          # Tela de login/registro
│   ├── Dashboard.js     # Página principal
│   ├── Transactions.js  # Gestão de transações
│   ├── Reports.js       # Relatórios e gráficos
│   ├── Goals.js         # Metas financeiras
│   ├── Navbar.js        # Barra de navegação
│   └── Sidebar.js       # Menu lateral
├── context/             # Context API
│   ├── AuthContext.js   # Contexto de autenticação
│   └── FinanceContext.js # Contexto de finanças
├── lib/                 # Configurações
│   └── supabase.js      # Cliente e serviços Supabase
├── App.js              # Componente principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
supabase/
├── migrations/         # Migrações do banco
└── config.toml        # Configuração do Supabase
```

## 🔒 Segurança

-   **Row Level Security (RLS)**: Cada usuário só acessa seus próprios dados
-   **Autenticação JWT**: Tokens seguros via Supabase Auth
-   **Validação de dados**: Tanto no frontend quanto no backend
-   **Políticas de acesso**: Definidas a nível de banco de dados

## 🌟 Próximas Funcionalidades

-   [ ] Exportação de relatórios em PDF
-   [ ] Backup e sincronização automática
-   [ ] Categorias personalizadas
-   [ ] Notificações por email
-   [ ] Integração com bancos (Open Banking)
-   [ ] Modo escuro
-   [ ] App mobile (React Native)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Troubleshooting

### Erro de conexão com Supabase

-   Verifique se as variáveis de ambiente estão corretas
-   Confirme se o projeto Supabase está ativo

### Tabelas não encontradas

-   Execute as migrações: `npx supabase db push`
-   Verifique se as políticas RLS estão habilitadas

### Problemas de autenticação

-   Confirme seu email após o registro
-   Verifique se o domínio está configurado no Supabase

## 👨‍💻 Desenvolvimento

Criado com foco em:

-   **Usabilidade**: Interface intuitiva e fácil de usar
-   **Performance**: Código otimizado e responsivo
-   **Segurança**: Autenticação robusta e dados protegidos
-   **Escalabilidade**: Arquitetura preparada para crescimento
-   **Manutenibilidade**: Estrutura organizada e componentes reutilizáveis

---

_Desenvolvido para ajudar você a ter controle total sobre suas finanças pessoais com segurança e praticidade! 💪_

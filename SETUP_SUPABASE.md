# 🚀 Configuração do Supabase - Passo a Passo

Este guia te ajudará a configurar o Supabase para o FinanceApp.

## 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email

## 2. Criar Novo Projeto

1. No dashboard, clique em "New Project"
2. Escolha uma organização (ou crie uma nova)
3. Preencha:
    - **Name**: `finance-app` (ou outro nome de sua escolha)
    - **Database Password**: Uma senha segura (anote-a!)
    - **Region**: Escolha a região mais próxima
4. Clique em "Create new project"
5. Aguarde a criação (pode levar alguns minutos)

## 3. Obter Credenciais

1. No dashboard do projeto, vá para **Settings** > **API**
2. Copie as seguintes informações:
    - **Project URL** (algo como: `https://xxxxxxxxx.supabase.co`)
    - **Anon public** key (uma string longa começando com `eyJ...`)

## 4. Configurar Variáveis de Ambiente

1. Na raiz do projeto React, crie o arquivo `.env.local`:

```env
REACT_APP_SUPABASE_URL=https://xxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...sua_chave_aqui
```

2. **Importante**: Substitua pelos valores reais do seu projeto!

## 5. Aplicar Migrações do Banco

### Opção A: Usando SQL Editor (Recomendado)

1. No dashboard Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `supabase/migrations/20250811231245_create_finance_tables.sql`
4. Clique em "Run" para executar

### Opção B: Usando CLI

```bash
# Fazer login no Supabase
npx supabase login

# Linkar ao projeto (substitua pelo ID do seu projeto)
npx supabase link --project-ref seu-project-id

# Aplicar migrações
npx supabase db push
```

## 6. Verificar Configuração

1. Vá para **Table Editor** no dashboard
2. Você deve ver 3 tabelas criadas:
    - `transactions`
    - `goals`
    - `categories`
3. Vá para **Authentication** > **Settings**
4. Certifique-se que "Enable email confirmations" está ativo

## 7. Configurar Autenticação (Opcional)

### Personalizar emails de confirmação:

1. Vá para **Authentication** > **Templates**
2. Personalize os templates de email conforme desejado

### Configurar domínios permitidos:

1. Em **Authentication** > **Settings** > **Site URL**
2. Adicione: `http://localhost:3000` (para desenvolvimento)
3. Para produção, adicione seu domínio real

## 8. Testar a Conexão

1. Execute o projeto: `npm start`
2. Acesse `http://localhost:3000`
3. Tente fazer um cadastro
4. Verifique se recebe o email de confirmação
5. Confirme o email e faça login

## 🎯 Verificação Final

Se tudo estiver funcionando, você deve conseguir:

-   ✅ Fazer cadastro e login
-   ✅ Adicionar transações
-   ✅ Criar metas financeiras
-   ✅ Ver os dados persistidos no banco
-   ✅ Logout e login novamente com os dados mantidos

## 🐛 Problemas Comuns

### "Invalid API key"

-   Verifique se copiou a chave correta
-   Certifique-se que não há espaços extras

### "Failed to fetch"

-   Verifique a URL do projeto
-   Confirme se o projeto está ativo no Supabase

### Tabelas não encontradas

-   Execute novamente o SQL no editor
-   Verifique se as migrações foram aplicadas

### Email não confirmado

-   Verifique a pasta de spam
-   Reenvie o email de confirmação

## 📞 Suporte

-   [Documentação Supabase](https://supabase.com/docs)
-   [Discord Supabase](https://discord.supabase.com)
-   [GitHub Issues](https://github.com/supabase/supabase/issues)

---

🎉 **Pronto!** Seu FinanceApp está configurado com banco de dados real e autenticação segura!

<div align="center">

![SmartAgenda Management](assets/images/icon.png)

# 📱 Barbearia Pro - Sistema de Gestão Completo

**Sistema Completo de Gestão para Barbearias**

[![React Native](https://img.shields.io/badge/React%20Native-0.79-61DAFB?style=flat&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Configuração do Supabase](#configuração-do-supabase)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Papéis e Permissões](#papéis-e-permissões)
- [Fluxos Principais](#fluxos-principais)
- [Deploy](#deploy)

---

## 🎯 Visão Geral

Sistema completo de gestão para barbearias desenvolvido com **React Native/Expo**, integrando:
- ✅ Autenticação e autorização com RLS
- ✅ Agenda digital de compromissos
- ✅ Sistema de vendas (PDV)
- ✅ Controle de estoque
- ✅ Dashboard com métricas em tempo real
- ✅ Multi-tenant com isolamento de dados
- ✅ Design moderno inspirado em iOS, Instagram e Airbnb

**Tecnologias:**
- React Native 0.79 + Expo 53
- Supabase (PostgreSQL + Auth + Storage + RLS)
- TypeScript
- React Query (TanStack Query)
- date-fns para manipulação de datas
- lucide-react-native para ícones

---

## 🏗️ Arquitetura

### Frontend (React Native)
```
app/
├── (tabs)/              # Navegação principal
│   ├── index.tsx        # Dashboard
│   ├── agenda.tsx       # Agenda de compromissos
│   ├── vendas.tsx       # Histórico de vendas
│   └── cadastros.tsx    # Menu de cadastros
├── login.tsx            # Tela de login
└── _layout.tsx          # Root layout com auth guard

contexts/
└── AuthContext.tsx      # Contexto de autenticação

lib/
└── supabase.ts          # Cliente Supabase configurado

types/
└── database.ts          # TypeScript types do banco
```

### Backend (Supabase)
- **Autenticação**: Supabase Auth com JWT
- **Banco de Dados**: PostgreSQL com Row Level Security (RLS)
- **Storage**: Armazenamento de recibos, relatórios, logos
- **Real-time**: Suporte a subscriptions (futuro)

### Banco de Dados
Veja `database/schema.sql` para o schema completo com:
- 12 tabelas principais
- Políticas RLS em todas as tabelas
- Triggers automáticos (estoque, totais)
- Views para relatórios
- Funções de negócio (conflito de agendamentos, métricas)

---

## ✨ Funcionalidades

### 1. Autenticação e Segurança
- Login por email/senha
- Recuperação de senha
- Sessão persistente com refresh token
- Row Level Security (RLS) por tenant
- 3 níveis de acesso: Admin, Barbeiro, Atendente

### 2. Dashboard
- **KPIs da semana atual:**
  - Faturamento total
  - Atendimentos concluídos/totais
  - Ticket médio
  - Total de clientes
- Cartões coloridos e intuitivos
- Pull-to-refresh

### 3. Agenda Digital
- Visualização diária com navegação
- Lista de compromissos com status coloridos
- Filtros por barbeiro (futuro)
- Indicador de "Hoje"
- FAB para novo agendamento
- **Status:**
  - Agendado (azul)
  - Confirmado (verde)
  - Em andamento (amarelo)
  - Concluído (verde)
  - Cancelado (vermelho)
  - Faltou (cinza)

### 4. Vendas
- Histórico mensal de vendas
- Cards de resumo (total do mês, nº de vendas)
- Detalhes de cada venda:
  - Itens vendidos (serviços/produtos)
  - Métodos de pagamento
  - Descontos aplicados
- Pull-to-refresh
- FAB para nova venda

### 5. Cadastros
- Menu com navegação para:
  - Clientes
  - Serviços
  - Produtos
- Design com cards e ícones coloridos

### 6. Multi-tenant
- Cada barbearia é um tenant
- Isolamento total de dados via RLS
- Configurações por tenant (horários, durações, etc.)

---

## 📦 Requisitos

- Node.js 18+
- Bun (gerenciador de pacotes)
- Expo Go app (para testar em dispositivo)
- Conta no Supabase (gratuita)

---

## 🚀 Instalação

### 1. Clone e instale dependências
```bash
# As dependências já estão instaladas, mas se precisar:
bun install
```

### 2. Configure variáveis de ambiente
O projeto já está configurado com as credenciais do Supabase fornecidas em `lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://icseawozzuwkkicsmqnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 🗄️ Configuração do Supabase

### 1. Execute o Schema SQL
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Navegue até: **SQL Editor**
3. Copie todo o conteúdo de `database/schema.sql`
4. Cole e execute

Isso criará:
- Todas as tabelas
- Índices otimizados
- Funções e triggers
- Políticas RLS
- Views para relatórios
- Dados de exemplo (tenant demo + serviços + produtos + clientes)

### 2. Crie os Storage Buckets
1. Vá em **Storage** > **Create bucket**
2. Crie os seguintes buckets:
   - `receipts` (recibos de venda)
   - `reports` (relatórios exportados)
   - `logos` (logos dos tenants)
   - `products` (fotos de produtos)

### 3. Configure Políticas de Storage
Para cada bucket, adicione políticas RLS:

```sql
-- Permitir leitura para usuários autenticados do mesmo tenant
CREATE POLICY "Allow authenticated users to read own tenant files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = (SELECT tenant_id::text FROM users WHERE id = auth.uid())
);

-- Permitir upload para usuários autenticados
CREATE POLICY "Allow authenticated users to upload to own tenant folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts' AND
  (storage.foldername(name))[1] = (SELECT tenant_id::text FROM users WHERE id = auth.uid())
);
```

Repita para todos os buckets (`reports`, `logos`, `products`).

### 4. Crie o primeiro usuário Admin

#### Passo 1: Criar usuário no Supabase Auth
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** > **Users** > **Add user**
3. **Método**: Email
4. Preencha:
   - **Email**: `admin@demo.com`
   - **Password**: `Admin123!`
   - ✅ Marque **Auto Confirm User** (importante!)
5. Clique em **Create user**
6. **IMPORTANTE**: Copie o **UUID** do usuário criado (aparece na lista de usuários)

#### Passo 2: Vincular ao tenant
1. Vá em **SQL Editor**
2. Cole o comando abaixo, **substituindo** `<UUID_DO_USER>` pelo UUID copiado:

```sql
-- Vincule o usuário ao tenant demo como Admin
INSERT INTO users (id, tenant_id, email, full_name, role)
VALUES (
  '<UUID_DO_USER>',  -- ⚠️ SUBSTITUA pelo UUID copiado do Authentication
  '00000000-0000-0000-0000-000000000001',  -- tenant demo
  'admin@demo.com',
  'Administrador',
  'admin'
);
```

3. Execute o comando
4. Se tudo der certo, você verá: "Success. No rows returned"

#### Credenciais para login no app:
```
Email: admin@demo.com
Senha: Admin123!
```

---

## 📱 Executar o App

```bash
# Inicie o servidor de desenvolvimento
bun start

# Ou para web
bun start-web
```

Escaneie o QR code com:
- **iOS**: Câmera nativa ou Expo Go
- **Android**: Expo Go app

---

## 📂 Estrutura do Projeto

```
barbearia-pro/
├── app/                    # Rotas Expo Router
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Dashboard
│   │   ├── agenda.tsx     # Agenda
│   │   ├── vendas.tsx     # Vendas
│   │   └── cadastros.tsx  # Cadastros
│   ├── login.tsx          # Login
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Auth state global
├── lib/                   # Bibliotecas e configs
│   └── supabase.ts        # Cliente Supabase
├── types/                 # TypeScript types
│   └── database.ts        # Types do banco
├── constants/             # Constantes
│   └── colors.ts          # Paleta de cores
├── database/              # SQL schemas
│   └── schema.sql         # Schema completo
├── SETUP.md               # Este arquivo
└── package.json
```

---

## 👥 Papéis e Permissões

### Admin
- Acesso total ao sistema
- Gerenciar usuários, configurações
- Ver todos os relatórios
- Acesso a todas as funcionalidades

### Barbeiro
- Consultar agenda própria
- Registrar atendimentos e vendas associadas
- Ver clientes
- **Não pode** alterar configurações ou ver dados de outros barbeiros

### Atendente
- Gerenciar agenda de todos os barbeiros
- Registrar vendas
- Ver e cadastrar clientes
- **Não pode** acessar relatórios financeiros completos

**Implementação:**
- RLS garante que cada usuário só vê dados do seu tenant
- Verificações adicionais por papel podem ser feitas no frontend
- Funções do Supabase: `get_user_role()`, `get_user_tenant_id()`

---

## 🔄 Fluxos Principais

### Fluxo de Login
1. Usuário insere email/senha
2. `signIn()` chama `supabase.auth.signInWithPassword()`
3. Supabase retorna JWT
4. `AuthContext` busca perfil do usuário na tabela `users`
5. Se autenticado, redireciona para `/(tabs)`
6. Se não autenticado, redireciona para `/login`

### Fluxo de Agendamento
1. Usuário clica no FAB da Agenda
2. Formulário de novo agendamento
3. Seleção de cliente, serviço, barbeiro, data/hora
4. Validação de conflitos via função `check_appointment_conflict()`
5. Inserção na tabela `appointments`
6. RLS garante que `tenant_id` está correto
7. Lista de agendamentos atualiza automaticamente (React Query)

### Fluxo de Venda
1. Atendente/Admin clica no FAB de Vendas
2. PDV: adiciona serviços/produtos ao carrinho
3. Seleciona cliente (opcional)
4. Aplica desconto (opcional)
5. Registra pagamentos (pode ser múltiplos)
6. Ao salvar:
   - Cria registro em `sales`
   - Cria registros em `sale_items`
   - Cria registros em `payments`
   - **Trigger automático** diminui estoque de produtos
   - **Trigger automático** recalcula totais da venda
7. Geração de recibo (futuro: PDF no Storage)

### Fluxo de Estoque
- **Entrada de produto**: Admin registra compra → trigger cria `stock_movement` tipo `purchase`
- **Venda de produto**: Trigger automático cria `stock_movement` tipo `sale` e diminui `stock_quantity`
- **Ajuste manual**: Admin pode ajustar estoque → cria movimento tipo `adjustment`
- **Alertas**: View `inventory_status` mostra produtos com estoque baixo

---

## 📊 Relatórios e Views

O banco possui views otimizadas para relatórios:

### daily_revenue
```sql
SELECT * FROM daily_revenue
WHERE tenant_id = '<tenant_id>'
  AND sale_date >= '2024-01-01';
```
Retorna: total_sales, total_revenue, avg_ticket, total_discounts por dia

### service_performance
```sql
SELECT * FROM service_performance
WHERE tenant_id = '<tenant_id>'
ORDER BY total_revenue DESC
LIMIT 10;
```
Retorna: serviços mais vendidos, receita por serviço

### barber_performance
```sql
SELECT * FROM barber_performance
WHERE tenant_id = '<tenant_id>'
ORDER BY total_revenue DESC;
```
Retorna: performance por barbeiro (vendas, itens, receita)

### inventory_status
```sql
SELECT * FROM inventory_status
WHERE tenant_id = '<tenant_id>' AND status = 'low_stock';
```
Retorna: produtos com estoque baixo ou zerado

---

## 🚢 Deploy

### Mobile (Expo)
```bash
# Build APK (Android)
eas build --platform android --profile production

# Build IPA (iOS)
eas build --platform ios --profile production
```

### Web (se aplicável)
```bash
bun expo export:web
```

---

## 🔐 Segurança

1. **Row Level Security (RLS)**: Todas as tabelas têm políticas que verificam `tenant_id`
2. **Auth Context**: Verifica autenticação antes de renderizar rotas protegidas
3. **Anon Key**: Só a chave anônima é exposta no cliente
4. **Senhas**: Hash com bcrypt no Supabase Auth
5. **Audit Logs**: Tabela `audit_logs` registra ações importantes

---

## 🧪 Dados de Teste

O schema inclui dados de exemplo:
- **Tenant**: Barbearia Demo (slug: `demo`)
- **Serviços**: Corte Masculino, Barba, Corte + Barba, Corte Infantil, Pézinho
- **Produtos**: Pomada, Shampoo, Óleo para Barba, Cera, Balm
- **Clientes**: João Silva, Pedro Santos, Carlos Oliveira, Rafael Costa, Lucas Ferreira

**Credenciais de acesso**:
```
Email: admin@demo.com
Senha: Admin123!
```

⚠️ **Importante**: Você precisa criar o usuário manualmente no Supabase seguindo as instruções na seção [Configuração do Supabase](#configuração-do-supabase).

---

## 📝 Próximos Passos

Features planejadas:
- [ ] CRUD completo de Clientes, Serviços, Produtos
- [ ] PDV completo com carrinho
- [ ] Relatórios exportáveis (CSV/PDF)
- [ ] Gráficos de faturamento (Linhas, Barras, Pizza)
- [ ] Envio de lembretes por email
- [ ] Notificações push
- [ ] Calendário semanal na Agenda
- [ ] Busca e filtros avançados
- [ ] Perfil de cliente com histórico
- [ ] Comissões de barbeiros
- [ ] App para clientes (agendamento online)

---

## 🐛 Troubleshooting

### Erro: "Row Level Security policy violation"
- Verifique se o usuário está vinculado ao tenant na tabela `users`
- Verifique se as políticas RLS foram criadas corretamente

### Erro: "Invalid JWT"
- Reconecte no app (logout/login)
- Verifique se as credenciais do Supabase estão corretas

### Dados não aparecem
- Verifique se o `tenant_id` do usuário está correto
- Use o SQL Editor para verificar dados diretamente
- Cheque os logs do console com `console.log()`

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o arquivo `database/schema.sql` para entender o modelo de dados
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Consulte a [documentação do Expo](https://docs.expo.dev/)

---

**Desenvolvido com ❤️ usando React Native, Expo e Supabase**

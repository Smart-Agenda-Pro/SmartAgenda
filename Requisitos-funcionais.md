# 📋 Requisitos Funcionais - BarberPro Management

## Documento de Requisitos e Funcionalidades

**Versão:** 1.0  
**Data:** Janeiro 2024  
**Status:** Em Desenvolvimento Ativo

---

## 📖 Índice

1. [Visão Geral](#-visão-geral)
2. [Requisitos Funcionais](#-requisitos-funcionais)
3. [Requisitos Não Funcionais](#-requisitos-não-funcionais)
4. [Casos de Uso](#-casos-de-uso)
5. [Fluxos de Navegação](#-fluxos-de-navegação)
6. [Regras de Negócio](#-regras-de-negócio)
7. [Validações e Restrições](#-validações-e-restrições)

---

## 🎯 Visão Geral

O **BarberPro Management** é um sistema completo de gestão para barbearias que permite o controle de agendamentos, vendas, estoque, clientes e relatórios através de um aplicativo mobile cross-platform.

### Objetivos do Sistema

- Automatizar o processo de agendamento de horários
- Gerenciar vendas de serviços e produtos
- Controlar estoque de produtos
- Manter base organizada de clientes
- Fornecer métricas e relatórios em tempo real
- Oferecer insights através de inteligência artificial

### Público-Alvo

- **Proprietários de barbearias**: Gestão completa do negócio
- **Barbeiros**: Controle da própria agenda e vendas
- **Atendentes**: Gerenciamento de agendas e vendas

---

## 🔧 Requisitos Funcionais

### RF01 - Autenticação e Autorização

#### RF01.1 - Login de Usuário
- **Descrição**: O sistema deve permitir que usuários façam login com email e senha
- **Prioridade**: Alta
- **Ator**: Todos os usuários
- **Pré-condições**: Usuário deve estar cadastrado no sistema
- **Fluxo Principal**:
  1. Usuário acessa a tela de login
  2. Insere email e senha
  3. Sistema valida as credenciais
  4. Sistema redireciona para o dashboard
- **Fluxo Alternativo**:
  - 3a. Credenciais inválidas: Exibe mensagem de erro
- **Pós-condições**: Usuário autenticado no sistema

#### RF01.2 - Recuperação de Senha
- **Descrição**: O sistema deve permitir recuperação de senha via email
- **Prioridade**: Média
- **Ator**: Todos os usuários
- **Fluxo Principal**:
  1. Usuário clica em "Esqueci minha senha"
  2. Insere o email cadastrado
  3. Sistema envia email com link de recuperação
  4. Usuário acessa link e define nova senha
- **Pós-condições**: Senha atualizada com sucesso

#### RF01.3 - Logout
- **Descrição**: O sistema deve permitir que o usuário saia da sua conta
- **Prioridade**: Alta
- **Ator**: Todos os usuários autenticados
- **Fluxo Principal**:
  1. Usuário clica no botão de logout
  2. Sistema encerra a sessão
  3. Usuário é redirecionado para tela de login
- **Pós-condições**: Sessão encerrada

#### RF01.4 - Controle de Acesso por Perfil
- **Descrição**: O sistema deve restringir acesso a funcionalidades baseado no perfil do usuário
- **Prioridade**: Alta
- **Perfis**:
  - **Admin**: Acesso total
  - **Barbeiro**: Acesso à própria agenda e vendas
  - **Atendente**: Acesso a agendas e vendas

---

### RF02 - Dashboard

#### RF02.1 - Visualização de Métricas
- **Descrição**: O sistema deve exibir métricas da semana atual
- **Prioridade**: Alta
- **Ator**: Todos os usuários autenticados
- **Métricas Exibidas**:
  - Faturamento total da semana
  - Número de atendimentos (concluídos/total)
  - Ticket médio
  - Total de clientes cadastrados
- **Regras**:
  - Dados atualizados em tempo real
  - Semana começa na segunda-feira
  - Valores em formato monetário brasileiro (R$)

#### RF02.2 - Pull-to-Refresh
- **Descrição**: O sistema deve permitir atualização manual dos dados
- **Prioridade**: Média
- **Ator**: Todos os usuários
- **Fluxo**:
  1. Usuário arrasta a tela para baixo
  2. Sistema busca dados atualizados
  3. Interface é atualizada

#### RF02.3 - Acesso Rápido
- **Descrição**: O sistema deve fornecer atalhos para funcionalidades principais
- **Prioridade**: Alta
- **Atalhos**:
  - Nova Agenda
  - Nova Venda
  - Gráficos
  - Agenda de Compromissos
  - IA Insights
  - Gerenciar Clientes

---

### RF03 - Agenda de Compromissos

#### RF03.1 - Visualização de Agendamentos
- **Descrição**: O sistema deve exibir lista de agendamentos por dia
- **Prioridade**: Alta
- **Ator**: Admin, Barbeiro, Atendente
- **Informações Exibidas**:
  - Nome do cliente
  - Serviço agendado
  - Barbeiro responsável
  - Horário (início e fim)
  - Status do agendamento
- **Filtros**:
  - Por data (com navegação diária)
  - Por barbeiro
  - Por status

#### RF03.2 - Criar Agendamento
- **Descrição**: O sistema deve permitir criação de novos agendamentos
- **Prioridade**: Alta
- **Ator**: Admin, Atendente
- **Campos Obrigatórios**:
  - Cliente
  - Serviço
  - Barbeiro
  - Data e hora
  - Duração
- **Campos Opcionais**:
  - Observações
- **Validações**:
  - Não permitir agendamentos em horários passados
  - Verificar conflito de horários do barbeiro
  - Verificar horário comercial da barbearia

#### RF03.3 - Editar Agendamento
- **Descrição**: O sistema deve permitir edição de agendamentos existentes
- **Prioridade**: Média
- **Ator**: Admin, Atendente
- **Restrições**:
  - Não permitir edição de agendamentos concluídos
  - Validar conflitos de horário ao alterar data/hora

#### RF03.4 - Cancelar Agendamento
- **Descrição**: O sistema deve permitir cancelamento de agendamentos
- **Prioridade**: Alta
- **Ator**: Admin, Atendente
- **Fluxo**:
  1. Usuário seleciona agendamento
  2. Clica em cancelar
  3. Confirma o cancelamento
  4. Sistema atualiza status para "cancelado"
- **Regras**:
  - Registrar motivo do cancelamento (opcional)
  - Não permitir cancelamento de agendamentos já concluídos

#### RF03.5 - Alterar Status do Agendamento
- **Descrição**: O sistema deve permitir mudança de status
- **Prioridade**: Alta
- **Ator**: Admin, Barbeiro, Atendente
- **Status Disponíveis**:
  - Agendado (inicial)
  - Confirmado
  - Em andamento
  - Concluído
  - Cancelado
  - Faltou (no-show)
- **Regras**:
  - Só pode concluir se status for "Em andamento"
  - Registrar data/hora de cada mudança de status

#### RF03.6 - Prevenção de Conflitos
- **Descrição**: O sistema deve impedir agendamentos simultâneos para o mesmo barbeiro
- **Prioridade**: Alta
- **Validação**:
  - Verificar se há sobreposição de horários
  - Considerar duração do serviço
  - Exibir mensagem de erro clara

---

### RF04 - Sistema de Vendas (PDV)

#### RF04.1 - Visualizar Histórico de Vendas
- **Descrição**: O sistema deve exibir lista de vendas realizadas
- **Prioridade**: Alta
- **Ator**: Admin, Atendente
- **Informações Exibidas**:
  - Número da venda
  - Data e hora
  - Cliente (se informado)
  - Total da venda
  - Forma de pagamento
  - Status
- **Filtros**:
  - Por período (dia, semana, mês)
  - Por cliente
  - Por barbeiro

#### RF04.2 - Registrar Nova Venda
- **Descrição**: O sistema deve permitir registro de vendas
- **Prioridade**: Alta
- **Ator**: Admin, Atendente, Barbeiro
- **Fluxo Principal**:
  1. Usuário inicia nova venda
  2. Adiciona serviços/produtos ao carrinho
  3. Informa quantidade de cada item
  4. Seleciona cliente (opcional)
  5. Aplica desconto (opcional)
  6. Registra forma(s) de pagamento
  7. Finaliza venda
- **Campos Obrigatórios**:
  - Pelo menos 1 item (serviço ou produto)
  - Forma de pagamento
- **Campos Opcionais**:
  - Cliente
  - Desconto
  - Observações
  - Vinculação com agendamento

#### RF04.3 - Carrinho de Vendas
- **Descrição**: O sistema deve permitir adicionar múltiplos itens antes de finalizar
- **Prioridade**: Alta
- **Funcionalidades**:
  - Adicionar serviços
  - Adicionar produtos
  - Alterar quantidade
  - Remover itens
  - Visualizar subtotal em tempo real
- **Cálculos**:
  - Subtotal = soma de todos os itens
  - Desconto aplicado sobre subtotal
  - Total = subtotal - desconto

#### RF04.4 - Múltiplas Formas de Pagamento
- **Descrição**: O sistema deve permitir pagamento em múltiplas formas
- **Prioridade**: Média
- **Formas Suportadas**:
  - Dinheiro
  - Cartão de crédito
  - Cartão de débito
  - PIX
  - Outros
- **Regras**:
  - Soma dos pagamentos deve ser igual ao total da venda
  - Permitir troco (se pagamento em dinheiro)

#### RF04.5 - Aplicar Descontos
- **Descrição**: O sistema deve permitir aplicação de descontos
- **Prioridade**: Média
- **Ator**: Admin, Atendente
- **Tipos de Desconto**:
  - Valor fixo (R$)
  - Percentual (%)
- **Validações**:
  - Desconto não pode ser maior que o subtotal
  - Desconto não pode ser negativo

#### RF04.6 - Detalhes da Venda
- **Descrição**: O sistema deve exibir detalhes completos de cada venda
- **Prioridade**: Alta
- **Informações**:
  - Lista de itens vendidos
  - Preço unitário e total de cada item
  - Subtotal
  - Desconto aplicado
  - Total
  - Formas de pagamento utilizadas
  - Data e hora
  - Vendedor
  - Cliente (se informado)

---

### RF05 - Gerenciamento de Clientes

#### RF05.1 - Listar Clientes
- **Descrição**: O sistema deve exibir lista de clientes cadastrados
- **Prioridade**: Alta
- **Ator**: Todos os usuários autenticados
- **Informações Exibidas**:
  - Nome
  - Telefone
  - Email
  - Status VIP
- **Funcionalidades**:
  - Busca por nome
  - Busca por telefone
  - Filtro por status VIP
  - Ordenação alfabética

#### RF05.2 - Cadastrar Cliente
- **Descrição**: O sistema deve permitir cadastro de novos clientes
- **Prioridade**: Alta
- **Ator**: Admin, Atendente
- **Campos Obrigatórios**:
  - Nome completo
- **Campos Opcionais**:
  - Telefone
  - Email
  - Data de nascimento
  - Observações
  - Status VIP
- **Validações**:
  - Nome deve ter no mínimo 3 caracteres
  - Telefone em formato válido (se informado)
  - Email em formato válido (se informado)

#### RF05.3 - Editar Cliente
- **Descrição**: O sistema deve permitir edição de dados dos clientes
- **Prioridade**: Média
- **Ator**: Admin, Atendente
- **Campos Editáveis**: Todos os campos do cadastro
- **Restrições**: Não permitir deixar nome em branco

#### RF05.4 - Excluir Cliente
- **Descrição**: O sistema deve permitir exclusão de clientes
- **Prioridade**: Baixa
- **Ator**: Admin
- **Fluxo**:
  1. Admin seleciona cliente
  2. Solicita exclusão
  3. Sistema exibe confirmação
  4. Admin confirma
  5. Sistema exclui cliente
- **Restrições**:
  - Não permitir exclusão se houver agendamentos futuros
  - Opcionalmente: manter registro histórico

#### RF05.5 - Visualizar Histórico do Cliente
- **Descrição**: O sistema deve exibir histórico de atendimentos
- **Prioridade**: Média
- **Informações**:
  - Data dos atendimentos
  - Serviços realizados
  - Barbeiro que atendeu
  - Valor pago
  - Produtos comprados
- **Estatísticas**:
  - Total gasto
  - Número de atendimentos
  - Serviço mais utilizado
  - Ticket médio

#### RF05.6 - Estatísticas de Clientes
- **Descrição**: O sistema deve fornecer análises da base de clientes
- **Prioridade**: Média
- **Métricas**:
  - Total de clientes cadastrados
  - Clientes novos no mês
  - Clientes VIP
  - Taxa de retenção
  - Cliente com mais atendimentos
  - Cliente com maior gasto

---

### RF06 - Controle de Estoque

#### RF06.1 - Listar Produtos
- **Descrição**: O sistema deve exibir lista de produtos
- **Prioridade**: Alta
- **Ator**: Todos os usuários autenticados
- **Informações Exibidas**:
  - Nome
  - SKU
  - Categoria
  - Preço de venda
  - Quantidade em estoque
  - Status (ativo/inativo)
- **Filtros**:
  - Por categoria
  - Por status
  - Estoque baixo
  - Esgotados

#### RF06.2 - Cadastrar Produto
- **Descrição**: O sistema deve permitir cadastro de produtos
- **Prioridade**: Alta
- **Ator**: Admin
- **Campos Obrigatórios**:
  - Nome
  - Preço de venda
  - Categoria
- **Campos Opcionais**:
  - SKU
  - Descrição
  - Preço de custo
  - Estoque inicial
  - Alerta de estoque baixo
  - Imagem
- **Validações**:
  - Preço de venda deve ser maior que zero
  - SKU único (se informado)

#### RF06.3 - Editar Produto
- **Descrição**: O sistema deve permitir edição de produtos
- **Prioridade**: Média
- **Ator**: Admin
- **Campos Editáveis**: Todos exceto movimentações de estoque
- **Restrições**: Não permitir preço zero ou negativo

#### RF06.4 - Controle Automático de Estoque
- **Descrição**: O sistema deve atualizar estoque automaticamente nas vendas
- **Prioridade**: Alta
- **Ator**: Sistema
- **Regra**:
  - Ao registrar venda com produto, diminuir estoque
  - Registrar movimentação com referência à venda
- **Validação**:
  - Avisar se estoque insuficiente
  - Permitir venda mesmo sem estoque (opcional)

#### RF06.5 - Ajuste Manual de Estoque
- **Descrição**: O sistema deve permitir ajustes manuais
- **Prioridade**: Média
- **Ator**: Admin
- **Tipos de Ajuste**:
  - Entrada (compra)
  - Saída (perda, doação)
  - Ajuste (correção)
- **Campos**:
  - Tipo de movimentação
  - Quantidade
  - Motivo/observação
- **Regras**:
  - Registrar usuário que fez o ajuste
  - Registrar data/hora

#### RF06.6 - Alertas de Estoque Baixo
- **Descrição**: O sistema deve alertar quando estoque estiver baixo
- **Prioridade**: Média
- **Ator**: Sistema
- **Regra**:
  - Verificar se estoque <= limite de alerta
  - Exibir badge ou notificação
  - Destacar produto na listagem
- **Configuração**: Admin define limite de alerta por produto

#### RF06.7 - Histórico de Movimentações
- **Descrição**: O sistema deve registrar todas as movimentações
- **Prioridade**: Média
- **Informações**:
  - Data/hora
  - Tipo de movimentação
  - Quantidade
  - Estoque anterior
  - Estoque novo
  - Usuário responsável
  - Referência (venda, ajuste, etc.)

---

### RF07 - Cadastros (Serviços e Produtos)

#### RF07.1 - Listar Serviços
- **Descrição**: O sistema deve exibir catálogo de serviços
- **Prioridade**: Alta
- **Informações**:
  - Nome do serviço
  - Descrição
  - Preço
  - Duração (em minutos)
  - Status (ativo/inativo)

#### RF07.2 - Cadastrar Serviço
- **Descrição**: O sistema deve permitir cadastro de serviços
- **Prioridade**: Alta
- **Ator**: Admin
- **Campos Obrigatórios**:
  - Nome
  - Preço
  - Duração
- **Campos Opcionais**:
  - Descrição
- **Validações**:
  - Preço maior que zero
  - Duração maior que zero

#### RF07.3 - Editar Serviço
- **Descrição**: O sistema deve permitir edição de serviços
- **Prioridade**: Média
- **Ator**: Admin
- **Restrições**: Não permitir valores zero ou negativos

#### RF07.4 - Ativar/Desativar Serviço
- **Descrição**: O sistema deve permitir ativar/desativar serviços
- **Prioridade**: Média
- **Ator**: Admin
- **Regra**: Serviços inativos não aparecem no agendamento/venda

---

### RF08 - Relatórios e Gráficos

#### RF08.1 - Dashboard de Gráficos
- **Descrição**: O sistema deve exibir gráficos analíticos
- **Prioridade**: Média
- **Ator**: Admin
- **Gráficos**:
  - Vendas por período (linha)
  - Taxa de conversão (pizza)
  - Crescimento de vendas (barra)
  - Performance por barbeiro
  - Serviços mais vendidos

#### RF08.2 - Relatório de Vendas
- **Descrição**: O sistema deve gerar relatório de vendas
- **Prioridade**: Média
- **Ator**: Admin
- **Filtros**:
  - Por período
  - Por barbeiro
  - Por forma de pagamento
- **Informações**:
  - Total de vendas
  - Valor total
  - Ticket médio
  - Lista detalhada de vendas

#### RF08.3 - Relatório de Performance
- **Descrição**: O sistema deve analisar performance individual
- **Prioridade**: Baixa
- **Ator**: Admin
- **Métricas por Barbeiro**:
  - Número de atendimentos
  - Valor total gerado
  - Ticket médio
  - Taxa de conclusão de agendamentos
  - Produtos vendidos

#### RF08.4 - Relatório de Estoque
- **Descrição**: O sistema deve gerar relatório de inventário
- **Prioridade**: Baixa
- **Informações**:
  - Valor total do estoque
  - Produtos com estoque baixo
  - Produtos esgotados
  - Produtos mais vendidos
  - Margem de lucro por produto

---

### RF09 - Inteligência Artificial (IA Insights)

#### RF09.1 - Chat com IA
- **Descrição**: O sistema deve fornecer assistente virtual
- **Prioridade**: Média
- **Ator**: Admin
- **Funcionalidades**:
  - Perguntas sobre métricas
  - Análise de dados
  - Sugestões de melhorias
  - Previsões

#### RF09.2 - Insights Automáticos
- **Descrição**: A IA deve fornecer insights proativos
- **Prioridade**: Baixa
- **Exemplos**:
  - "Suas vendas aumentaram 20% esta semana"
  - "Produto X está com estoque baixo"
  - "Taxa de no-show está alta, considere lembretes"
  - "Cliente Y não vem há 2 meses"

#### RF09.3 - Análise Preditiva
- **Descrição**: A IA deve fazer previsões baseadas em histórico
- **Prioridade**: Baixa
- **Previsões**:
  - Faturamento próximo mês
  - Demanda por serviços
  - Necessidade de reposição de estoque

---

### RF10 - Menu Hamburger e Navegação

#### RF10.1 - Menu Lateral
- **Descrição**: O sistema deve ter menu de navegação lateral
- **Prioridade**: Alta
- **Itens do Menu**:
  - Dashboard (Início)
  - Gráficos
  - Agenda de Compromissos
  - IA Insights
  - Gerenciar Clientes
  - Agenda
  - Vendas
  - Relatórios
  - Cadastros
  - Perfil (Gerenciar)
  - Sair
- **Funcionalidades**:
  - Abrir com botão no header
  - Fechar ao clicar fora
  - Animação suave
  - Exibir nome e foto do usuário

#### RF10.2 - Navegação por Tabs
- **Descrição**: O sistema deve ter tabs de navegação principal
- **Prioridade**: Alta
- **Tabs**:
  - Home (Dashboard)
  - Agenda
  - Vendas
  - Relatórios
  - Cadastros
- **Regras**:
  - Tab ativa destacada visualmente
  - Ícones representativos

---

### RF11 - Perfil do Usuário

#### RF11.1 - Visualizar Perfil
- **Descrição**: O sistema deve exibir dados do usuário
- **Prioridade**: Média
- **Informações**:
  - Nome completo
  - Email
  - Perfil (Admin/Barbeiro/Atendente)
  - Foto do perfil
  - Data de cadastro

#### RF11.2 - Editar Perfil
- **Descrição**: O sistema deve permitir edição do perfil
- **Prioridade**: Média
- **Campos Editáveis**:
  - Nome completo
  - Foto de perfil
- **Campos Não Editáveis**:
  - Email (requer verificação)
  - Perfil (apenas Admin pode alterar)

#### RF11.3 - Alterar Senha
- **Descrição**: O sistema deve permitir troca de senha
- **Prioridade**: Média
- **Fluxo**:
  1. Usuário vai até configurações
  2. Informa senha atual
  3. Informa nova senha
  4. Confirma nova senha
  5. Sistema valida e atualiza
- **Validações**:
  - Senha atual deve estar correta
  - Nova senha deve ter mínimo 6 caracteres
  - Confirmação deve ser igual à nova senha

#### RF11.4 - Upload de Foto
- **Descrição**: O sistema deve permitir upload de foto de perfil
- **Prioridade**: Baixa
- **Formatos Aceitos**: JPEG, PNG
- **Tamanho Máximo**: 5MB
- **Processamento**: Redimensionar para 300x300px

---

## 🚫 Requisitos Não Funcionais

### RNF01 - Performance

#### RNF01.1 - Tempo de Resposta
- **Descrição**: Todas as operações devem responder em até 2 segundos
- **Prioridade**: Alta
- **Métrica**: 95% das requisições em < 2s

#### RNF01.2 - Otimização de Imagens
- **Descrição**: Imagens devem ser otimizadas e cacheadas
- **Prioridade**: Média

#### RNF01.3 - Lazy Loading
- **Descrição**: Listas longas devem carregar sob demanda
- **Prioridade**: Média

---

### RNF02 - Segurança

#### RNF02.1 - Criptografia de Dados
- **Descrição**: Dados sensíveis devem ser criptografados
- **Prioridade**: Alta
- **Aplicação**: Senhas, tokens, dados de pagamento

#### RNF02.2 - Row Level Security
- **Descrição**: Banco deve ter isolamento de dados por tenant
- **Prioridade**: Alta
- **Implementação**: RLS em todas as tabelas

#### RNF02.3 - Autenticação JWT
- **Descrição**: Sistema deve usar tokens JWT
- **Prioridade**: Alta
- **Expiração**: 7 dias com refresh token

#### RNF02.4 - HTTPS
- **Descrição**: Todas as comunicações devem usar HTTPS
- **Prioridade**: Alta

#### RNF02.5 - Validação de Entrada
- **Descrição**: Todos os inputs devem ser validados
- **Prioridade**: Alta
- **Proteção**: SQL Injection, XSS

---

### RNF03 - Usabilidade

#### RNF03.1 - Design Responsivo
- **Descrição**: Interface deve se adaptar a diferentes telas
- **Prioridade**: Alta
- **Dispositivos**: Smartphones e tablets (iOS e Android)

#### RNF03.2 - Feedback Visual
- **Descrição**: Todas as ações devem ter feedback imediato
- **Prioridade**: Alta
- **Exemplos**: Loading, mensagens de sucesso/erro

#### RNF03.3 - Acessibilidade
- **Descrição**: App deve ser acessível
- **Prioridade**: Média
- **Conformidade**: WCAG 2.1 nível AA

#### RNF03.4 - Modo Offline
- **Descrição**: Funcionalidades básicas devem funcionar offline
- **Prioridade**: Baixa
- **Status**: Planejado

---

### RNF04 - Compatibilidade

#### RNF04.1 - Plataformas
- **iOS**: 13.0 ou superior
- **Android**: 8.0 (API 26) ou superior
- **Web**: Chrome, Firefox, Safari, Edge (últimas versões)

#### RNF04.2 - Resolução de Tela
- **Mínima**: 320x568 (iPhone SE)
- **Recomendada**: 375x667 ou superior

---

### RNF05 - Disponibilidade

#### RNF05.1 - Uptime
- **Descrição**: Sistema deve estar disponível 99.9% do tempo
- **Prioridade**: Alta
- **Downtime aceitável**: < 8h por ano

#### RNF05.2 - Backup
- **Descrição**: Backup automático diário do banco
- **Prioridade**: Alta
- **Retenção**: 30 dias

---

### RNF06 - Escalabilidade

#### RNF06.1 - Arquitetura Multi-tenant
- **Descrição**: Suportar múltiplas barbearias
- **Prioridade**: Alta
- **Capacidade**: Até 1000 tenants

#### RNF06.2 - Carga
- **Descrição**: Suportar até 10.000 usuários simultâneos
- **Prioridade**: Média

---

## 📱 Casos de Uso

### UC01 - Fazer Login
**Ator**: Usuário  
**Objetivo**: Acessar o sistema  
**Pré-condições**: Ter credenciais válidas  
**Fluxo Principal**:
1. Usuário abre o app
2. Insere email e senha
3. Clica em "Entrar"
4. Sistema valida e redireciona ao dashboard

**Fluxo Alternativo 1**: Credenciais inválidas
- 3a. Sistema exibe erro
- 3b. Usuário pode tentar novamente ou recuperar senha

---

### UC02 - Criar Agendamento
**Ator**: Atendente/Admin  
**Objetivo**: Agendar horário para cliente  
**Pré-condições**: Estar autenticado  
**Fluxo Principal**:
1. Usuário acessa Agenda
2. Clica no botão "+" (novo agendamento)
3. Seleciona cliente (ou cadastra novo)
4. Escolhe serviço
5. Seleciona barbeiro
6. Define data e horário
7. Confirma agendamento
8. Sistema valida conflitos
9. Salva agendamento

**Fluxo Alternativo 1**: Conflito de horário
- 8a. Sistema exibe mensagem de erro
- 8b. Usuário escolhe outro horário

---

### UC03 - Registrar Venda
**Ator**: Atendente/Admin/Barbeiro  
**Objetivo**: Registrar venda de serviços/produtos  
**Pré-condições**: Estar autenticado  
**Fluxo Principal**:
1. Usuário acessa Vendas
2. Clica em "Nova Venda"
3. Adiciona serviços ao carrinho
4. Adiciona produtos (opcional)
5. Seleciona cliente (opcional)
6. Aplica desconto (opcional)
7. Informa forma de pagamento
8. Finaliza venda
9. Sistema atualiza estoque
10. Exibe confirmação

---

### UC04 - Consultar Relatório
**Ator**: Admin  
**Objetivo**: Visualizar análises do negócio  
**Pré-condições**: Estar autenticado como Admin  
**Fluxo Principal**:
1. Admin acessa Relatórios
2. Escolhe tipo de relatório
3. Define período
4. Sistema processa dados
5. Exibe gráficos e métricas
6. Admin pode exportar (futuro)

---

### UC05 - Gerenciar Cliente
**Ator**: Atendente/Admin  
**Objetivo**: Manter cadastro de cliente atualizado  
**Pré-condições**: Estar autenticado  
**Fluxo Principal**:
1. Usuário acessa Gerenciar Clientes
2. Busca cliente desejado
3. Visualiza detalhes e histórico
4. Edita informações (se necessário)
5. Salva alterações

---

## 🔄 Fluxos de Navegação

### Fluxo de Agendamento Completo
```
Login → Dashboard → Agenda → Novo Agendamento → Formulário → Confirmação → Lista Atualizada
```

### Fluxo de Venda Completa
```
Login → Dashboard → Vendas → Nova Venda → Carrinho → Pagamento → Confirmação → Lista Atualizada
```

### Fluxo de Cadastro de Cliente
```
Login → Dashboard → Gerenciar Clientes → Novo Cliente → Formulário → Salvar → Lista Atualizada
```

### Fluxo de Visualização de Relatórios
```
Login → Dashboard → Gráficos → Seleção de Métricas → Visualização
```

---

## ⚖️ Regras de Negócio

### RN01 - Agendamentos
1. Um barbeiro não pode ter dois agendamentos simultâneos
2. Duração do agendamento é definida pelo serviço escolhido
3. Agendamentos só podem ser feitos dentro do horário comercial
4. Clientes podem ter múltiplos agendamentos futuros
5. Status "Em andamento" só pode ser definido no dia do agendamento
6. Agendamentos passados não podem ser editados

### RN02 - Vendas
1. Toda venda deve ter pelo menos um item (serviço ou produto)
2. Soma dos pagamentos deve ser igual ao total da venda
3. Desconto não pode ser maior que o subtotal
4. Venda de produto diminui estoque automaticamente
5. Valores sempre em formato monetário brasileiro (R$)
6. Vendas podem ser vinculadas a agendamentos

### RN03 - Estoque
1. Estoque não pode ser negativo
2. Todas as movimentações devem ser registradas
3. Alerta de estoque baixo é configurável por produto
4. Ajustes manuais requerem justificativa
5. Histórico de movimentações é imutável (auditoria)

### RN04 - Clientes
1. Nome é campo obrigatório
2. Telefone e email são opcionais mas devem ser válidos se informados
3. Clientes VIP têm prioridade visual na interface
4. Cliente só pode ser excluído se não houver histórico
5. Dados de cliente são protegidos por LGPD

### RN05 - Usuários e Acessos
1. Cada usuário pertence a um único tenant (barbearia)
2. Admin tem acesso total
3. Barbeiro só vê própria agenda e vendas
4. Atendente vê todas as agendas mas não altera configurações
5. Usuários só veem dados do próprio tenant (RLS)

### RN06 - Multi-tenant
1. Dados de tenants são completamente isolados
2. Cada tenant tem configurações próprias
3. Horário comercial é configurável por tenant
4. Logo e branding são personalizáveis por tenant

---

## ✅ Validações e Restrições

### Validações de Formulário

#### Login
- ✅ Email: formato válido
- ✅ Senha: não pode estar vazia

#### Agendamento
- ✅ Cliente: obrigatório
- ✅ Serviço: obrigatório
- ✅ Barbeiro: obrigatório
- ✅ Data: não pode ser passada
- ✅ Horário: dentro do horário comercial
- ✅ Conflito: verificar disponibilidade do barbeiro

#### Venda
- ✅ Itens: pelo menos 1 item
- ✅ Quantidade: maior que zero
- ✅ Pagamento: soma deve igualar total
- ✅ Desconto: não pode ser negativo ou maior que subtotal

#### Cliente
- ✅ Nome: mínimo 3 caracteres
- ✅ Telefone: formato (XX) XXXXX-XXXX (se informado)
- ✅ Email: formato válido (se informado)

#### Produto
- ✅ Nome: obrigatório
- ✅ Preço: maior que zero
- ✅ Estoque: não pode ser negativo
- ✅ SKU: único (se informado)

#### Serviço
- ✅ Nome: obrigatório
- ✅ Preço: maior que zero
- ✅ Duração: maior que zero (em minutos)

---

## 📊 Métricas e KPIs

### KPIs do Dashboard
- **Faturamento Semanal**: Soma de todas as vendas da semana
- **Atendimentos**: Concluídos / Total agendado
- **Ticket Médio**: Faturamento / Número de vendas
- **Total de Clientes**: Clientes cadastrados no sistema

### KPIs de Performance
- **Taxa de Conclusão**: Agendamentos concluídos / Total de agendamentos
- **Taxa de No-show**: Faltas / Total de agendamentos
- **Taxa de Conversão**: Vendas / Agendamentos
- **Crescimento Mensal**: (Vendas mês atual - Vendas mês anterior) / Vendas mês anterior

---

## 🎨 Padrões de Interface

### Cores de Status
- 🔵 **Agendado**: Azul (#3B82F6)
- 🟢 **Confirmado**: Verde (#10B981)
- 🟡 **Em andamento**: Amarelo (#F59E0B)
- ✅ **Concluído**: Verde (#10B981)
- 🔴 **Cancelado**: Vermelho (#EF4444)
- ⚫ **Faltou**: Cinza (#6B7280)

### Feedback Visual
- ✅ Sucesso: Toast verde
- ❌ Erro: Toast vermelho
- ⚠️ Aviso: Toast amarelo
- ℹ️ Info: Toast azul
- ⏳ Loading: Spinner centralizado

---

## 📝 Glossário

- **Tenant**: Barbearia (unidade independente no sistema multi-tenant)
- **RLS**: Row Level Security (segurança em nível de linha no banco)
- **JWT**: JSON Web Token (método de autenticação)
- **No-show**: Cliente que não compareceu ao agendamento
- **Ticket Médio**: Valor médio por venda
- **SKU**: Stock Keeping Unit (código único do produto)
- **PDV**: Ponto de Venda
- **Admin**: Administrador (perfil com acesso total)
- **VIP**: Cliente especial com prioridade

---

## 🔄 Versões e Histórico

### v1.0 - Janeiro 2024
- ✅ Sistema de autenticação
- ✅ Dashboard com métricas
- ✅ Agenda de compromissos
- ✅ Sistema de vendas (PDV)
- ✅ Gerenciamento de clientes
- ✅ Controle de estoque
- ✅ Cadastros (serviços e produtos)
- ✅ Relatórios e gráficos
- ✅ IA Insights
- ✅ Menu hamburger
- ✅ Perfil do usuário

### Planejado para v1.1
- [ ] Notificações push
- [ ] Lembretes via WhatsApp
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Sistema de comissões
- [ ] Modo offline

### Planejado para v2.0
- [ ] App para clientes
- [ ] Programa de fidelidade
- [ ] Agendamento online
- [ ] Integração com pagamentos
- [ ] Multi-idiomas

---

<div align="center">

**Documento de Requisitos - BarberPro Management**

*Versão 1.0 - Janeiro 2024*

---

© 2024 BarberPro Management. Todos os direitos reservados.

</div>

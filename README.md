# 🐄 AgroMilk - Sistema de Gestão de Ordenhas

Sistema completo de gestão de ordenhas para vacarias, desenvolvido para facilitar o controlo diário das ordenhas e o acompanhamento individual de cada vaca.

## 📋 Funcionalidades

### 1️⃣ Perfis das Vacas
- **Identificação única** por número
- **Estados disponíveis:**
  - 🟢 Em Ordenha (produtiva)
  - 🟡 Seca (não produtiva)
  - 🔴 Vendida (inativa)
- **Informações detalhadas:**
  - Média de leite por ordenha
  - Total de ordenhas realizadas
  - Histórico completo com datas e quantidades
  - Notas associadas a cada ordenha

### 2️⃣ Sistema de Ordenha
- **Grupos de 8 vacas** por ordenha
- **Seleção visual** das vacas disponíveis
- **Validação automática** de estados:
  - Apenas vacas "Em Ordenha" podem ser selecionadas
  - Aviso automático ao tentar selecionar vacas secas
- **Registo completo:**
  - Quantidade de leite por vaca
  - Notas sobre a ordenha (comportamento, problemas, observações)
  - Data e hora automáticas

### 3️⃣ Estatísticas e Controlo
- Contador total de vacas
- Vacas em ordenha vs secas
- Cálculo automático de médias
- Histórico ordenado por data

## 🚀 Como Usar

### Instalação
1. Faça download dos ficheiros
2. Abra o ficheiro `index.html` no seu navegador
3. Pronto! A aplicação está funcional

### Primeiro Uso
1. **Adicionar Vacas:**
   - Vá para "Perfis das Vacas"
   - Clique em "+ Adicionar Vaca"
   - Insira o número e o estado
   - Guarde

2. **Registar Ordenha:**
   - Vá para "Iniciar Ordenha"
   - Selecione até 8 vacas (apenas as que estão em ordenha)
   - Insira a quantidade de leite de cada vaca
   - Adicione notas se necessário
   - Clique em "Guardar Ordenha"

3. **Ver Perfil de uma Vaca:**
   - Na página "Perfis das Vacas"
   - Clique no cartão de qualquer vaca
   - Visualize média, total de ordenhas e histórico completo

## 💾 Armazenamento

A aplicação guarda todos os dados localmente no navegador (LocalStorage), portanto:
- ✅ Funciona offline
- ✅ Não necessita de servidor
- ✅ Dados privados e seguros
- ⚠️ Os dados ficam no dispositivo usado

## 🎨 Interface

- **Design moderno e responsivo**
- **Cores intuitivas** para estados das vacas
- **Navegação simples** entre páginas
- **Otimizada para tablets** (ideal para uso no campo)
- **Funciona em smartphones** também

## 🔒 Segurança dos Dados

- Dados armazenados localmente
- Nenhuma informação enviada para servidores externos
- Sistema de confirmação para eliminação de vacas
- Validações para prevenir erros de registo

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Tablets Android e iPad
- ✅ Smartphones (com interface adaptada)
- ✅ Funciona offline

## 🛠️ Tecnologias

- **HTML5** - Estrutura
- **CSS3** - Estilo e responsividade
- **JavaScript** (Vanilla) - Lógica da aplicação
- **LocalStorage** - Armazenamento de dados

## 📝 Notas Técnicas

- Sem dependências externas
- Código limpo e comentado
- Fácil de personalizar
- Leve e rápido

## 🎯 Objetivo

Fornecer uma ferramenta **simples, prática e eficiente** para agricultores gerirem as ordenhas diárias, evitarem erros e manterem um histórico organizado da produção de leite de cada vaca.

---

**Desenvolvido com foco na simplicidade e praticidade do dia-a-dia na vacaria.**

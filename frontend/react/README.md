# NutriOne - Frontend React

Frontend moderno para a calculadora de Taxa Metabólica Basal (TMB) construído com React 19, Vite, TypeScript e CSS.

## 📋 Descrição

Uma interface intuitiva e responsiva para calcular a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor, com cálculo automático de necessidade calórica por nível de atividade.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Cabeçalho da aplicação
│   ├── Header.css
│   ├── Footer.tsx      # Rodapé
│   ├── Footer.css
│   ├── TMBForm.tsx     # Formulário de entrada
│   ├── TMBForm.css
│   ├── TMBResult.tsx   # Exibição de resultado
│   ├── TMBResult.css
│   ├── ErrorAlert.tsx  # Alerta de erro
│   └── ErrorAlert.css
├── pages/              # Páginas da aplicação
│   ├── Calculator.tsx  # Página principal
│   └── Calculator.css
├── hooks/              # Custom hooks
│   └── useTMB.ts      # Hook para lógica de TMB
├── services/           # Serviços de API
│   └── api.ts         # Configuração da API
├── types/              # Tipos TypeScript
│   └── index.ts       # Definições de tipos
├── App.tsx            # Componente raiz
├── App.css
├── main.tsx           # Ponto de entrada
├── index.css          # Estilos globais
```

## ✨ Funcionalidades

- ✅ Cálculo de TMB usando fórmula de Mifflin-St Jeor
- ✅ Interface responsiva e moderna
- ✅ Suporte para masculino e feminino
- ✅ Cálculo automático de necessidade calórica por atividade
- ✅ Validação de dados em tempo real
- ✅ Tratamento de erros elegante
- ✅ Loading states
- ✅ Acessibilidade (WCAG)
- ✅ Design System consistente

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Navegue até o diretório do frontend:
```bash
cd frontend/react
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` baseado em `.env.example`:
```bash
cp .env.example .env
```

4. Configure a URL da API no `.env` se necessário

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará acessível em `http://localhost:3000`

O servidor Vite inclui suporte para:
- Hot Module Replacement (HMR) - atualização automática
- Proxy automático para `/api` → `http://localhost:8080`

### Build para Produção

```bash
npm run build
```

Visualize o build antes de fazer deploy:
```bash
npm run preview
```

### Lint

Verifique erros de linting:
```bash
npm run lint
```

## 🎨 Design

### Cores Principais
- **Primary**: #667eea (Azul Índigo)
- **Secondary**: #764ba2 (Roxo)
- **Text**: #333 (Cinza Escuro)
- **Background**: #f8f9fa (Cinza Claro)

### Tipografia
- **Font**: System UI, Segoe UI, Roboto
- **Base Size**: 16px
- **Line Height**: 1.5

### Responsividade
- Desktop (1024px+)
- Tablet (768px - 1023px)  
- Mobile (< 768px)

## 📦 Dependências Principais

- **React 19.2.6** - UI Framework
- **Vite 8.0.12** - Build tool
- **TypeScript 6.0** - Type safety
- **ESLint** - Code quality

## 🔌 API Integration

### Endpoint: POST /api/tmb/calculate

O serviço de API em `src/services/api.ts` integra com o backend Go.

**Request:**
```json
{
  "weight": 70,
  "height": 175,
  "age": 30,
  "gender": "male"
}
```

**Response:**
```json
{
  "tmb": 1688.75,
  "formula": "Mifflin-St Jeor",
  "message": "Sua taxa metabólica basal é de..."
}
```

### Hook customizado `useTMB`

Use o hook para gerenciar cálculos de TMB:

```typescript
const { loading, error, result, calculateTMB, clearResult } = useTMB();

const handleCalculate = async (data: TMBFormData) => {
  await calculateTMB(data);
};
```

## 📱 Acessibilidade

- ✅ Semântica HTML apropriada
- ✅ Labels associados aos inputs
- ✅ ARIA labels onde necessário
- ✅ Contraste de cores WCAG AA
- ✅ Navegação por teclado
- ✅ Respeita preferência `prefers-reduced-motion`

## 🔒 Segurança

- XSS Protection através de React
- CSRF tokens se necessário na API
- Validação de entrada
- Environment variables para configurações sensíveis

## 📝 Convenções

### Componentes
- Componentes funcionais com hooks
- Props bem tipadas com TypeScript
- Arquivos CSS colocalizados

### Naming
- Componentes: PascalCase
- Arquivos de componentes: PascalCase.tsx
- Estilos: ComponentName.css
- Variáveis/Funções: camelCase
- Constantes: UPPER_SNAKE_CASE

## 🐛 Troubleshooting

### Erro de conexão com API
- Verifique se o backend Go está rodando em `http://localhost:8080`
- Verifique a variável `VITE_API_URL` no arquivo `.env`
- Verifique CORS no backend se necessário

### Porta 3000 já está em uso
- Altere a porta em `vite.config.ts` → `server.port`
- Ou use: `npm run dev -- --port 3001`

## 📚 Recursos

- [Documentação React](https://react.dev)
- [Documentação Vite](https://vite.dev)
- [Fórmula Mifflin-St Jeor](https://pt.wikipedia.org/wiki/Taxa_metab%C3%B3lica_basal)

## 📄 Licença

Este projeto está licenciado sob a mesma licença que o projeto NutriOne principal.

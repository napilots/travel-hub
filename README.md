# ✈️ Travel Hub (Agenda de Viagens)

## O que é o projeto?

O Travel Hub é uma aplicação web desenvolvida para auxiliar no planejamento de viagens. O sistema permite cadastrar viagens, definir destino, datas, orçamento e adicionar imagens. Além disso, é possível criar checklists para organização da viagem e consultar informações do país e previsão do tempo por meio de APIs externas.

---

## 🛠️ Tecnologias utilizadas

### Front-end
- React (com Vite)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Axios

### Back-end
- Node.js
- Fastify
- TypeScript
- Prisma ORM
- MySQL
- Zod

### APIs
- [OpenWeather API](https://openweathermap.org/) (Previsão do tempo)
- [REST Countries API](https://restcountries.com/) (Ainda será implementado) 

---

## Como rodar o projeto localmente

### 1. Clone o repositório e instale as dependências

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```
---

### 2. Configure as Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz da pasta `backend` e adicione as seguintes configurações (substitua com as credenciais do seu banco MySQL local e sua chave da API):

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
OPENWEATHER_API_KEY="sua_chave_da_api_aqui"
```

---

### 3. Execute as migrações do banco de dados

No terminal da pasta do backend, execute as migrações do Prisma para estruturar as tabelas `Trip` e `Checklist` no seu banco de dados:

```bash
cd backend
npx prisma migrate dev
```

### 4. Inicie os servidores

Abra dois terminais separados para rodar os servidores simultaneamente:

Terminal 1 (Backend Fastify):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend React/Vite):
```bash
cd frontend
npm run dev
```

### 5. Acesse a aplicação

Após a ativação dos servidores, estes serão os endereços de visualização e teste.

Frontend: http://localhost:5173

Backend (API): http://localhost:3333

## 👥 Equipe Desenvolvedora

Este projeto foi construído pelos membros:

- Ana Clara Lima (https://github.com/napilots)
- Gustavo Leal (https://github.com/gustavobleal)
- Roger Portugal (https://github.com/Roger17Pg)
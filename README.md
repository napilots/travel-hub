# ✈️ Travel Hub (Agenda de Viagens)

## O que é o projeto?

O **Travel Hub** é uma aplicação web desenvolvida para auxiliar no planejamento e organização de viagens.

O sistema permite cadastrar viagens, definir destino, datas, orçamento, adicionar imagens e organizar tarefas através de checklists. Além disso, a aplicação integra APIs externas para consultar informações do país de destino, como bandeira, idioma e moeda, e também permite acompanhar a previsão do tempo em tempo real.

---

## 🛠️ Tecnologias utilizadas

### Front-end
- React (com Vite)
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Axios
- Lucide React

### Back-end
- Node.js
- Fastify
- TypeScript
- Prisma ORM
- MySQL
- Zod

### APIs Integradas
- [OpenWeather API](https://openweathermap.org/) (Previsão do tempo)
- [REST Countries API](https://restcountries.com/) (Informações sobre países)

---

# 🚀 Como rodar o projeto localmente

## 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto:

```bash
cd travel-hub
```

---

## 2. Instale as dependências

### Front-end

```bash
cd frontend
npm install
```

### Back-end

```bash
cd ../backend
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo chamado `.env` dentro da pasta `backend`.

Adicione as configurações abaixo substituindo pelos seus dados:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

OPENWEATHER_API_KEY="sua_chave_da_api"

REST_COUNTRIES_API_KEY="sua_chave_da_api"
```

---

## 4. Execute as migrações do banco de dados

Dentro da pasta do backend execute:

```bash
npx prisma migrate dev
```

O Prisma irá criar as tabelas necessárias no banco MySQL.

Principais modelos:

- Trip
- Checklist

---

## 5. Inicie os servidores

Abra dois terminais separados.

### Terminal 1 - Backend Fastify

```bash
cd backend
npm run dev
```

### Terminal 2 - Front-end React

```bash
cd frontend
npm run dev
```

---

# 🌐 Acesse a aplicação

Após iniciar os servidores:

### Front-end

```
http://localhost:5173
```

### Back-end (API)

```
http://localhost:3333
```

---

# 📦 Funcionalidades

- Cadastro de viagens
- Edição de viagens
- Exclusão de viagens
- Upload de imagens para viagens
- Criação de checklist por viagem
- Busca de viagens
- Organização de tarefas da viagem
- Consulta de previsão do tempo em tempo real
- Consulta de informações do país de destino
- Interface responsiva

---

# 🌎 APIs utilizadas

## OpenWeather API

Responsável por fornecer informações meteorológicas:

- Temperatura atual
- Sensação térmica
- Umidade
- Velocidade do vento
- Ícone do clima
- Descrição da previsão

---

## REST Countries API

Responsável por fornecer informações sobre o país selecionado:

- Bandeira
- Nome oficial
- Capital
- Região
- Sub-região
- População
- Idiomas
- Moedas oficiais

---

# 🗄️ Banco de Dados

O projeto utiliza:

- **MySQL** como banco de dados
- **Prisma ORM** para gerenciamento das entidades e consultas

Principais entidades:

- **Trip** → Armazena as informações das viagens
- **Checklist** → Armazena tarefas relacionadas a cada viagem

---

# 👥 Equipe Desenvolvedora

Este projeto foi desenvolvido pelos membros:

- Ana Clara Lima (https://github.com/napilots)
- Gustavo Leal (https://github.com/gustavobleal)
- Roger Portugal (https://github.com/Roger17Pg)

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos.
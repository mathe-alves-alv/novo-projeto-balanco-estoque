# Usa uma imagem oficial do Node.js como base (versão LTS)
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock) para o diretório de trabalho
# Isso permite que o npm install aproveite o cache do Docker
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia todo o restante do código da sua aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que o servidor SvelteKit vai rodar
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento SvelteKit
CMD ["npm", "run", "dev"]
# Etapa 1: build da aplicação
FROM node:18-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências (modo produção já remove devDeps depois)
RUN npm install

# Copia o restante da aplicação
COPY . .

# Faz o build da aplicação Next.js
RUN npm run build

# Etapa 2: imagem final
FROM node:18-alpine AS runner

WORKDIR /app

# Copia arquivos essenciais da build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN npm install pm2 -g

# Expõe a porta padrão do Next
EXPOSE 4000

# Comando para rodar a aplicação com PM2 em produção
CMD ["pm2-runtime", "start", "npm", "--name", "app", "--", "start"]

# ETAPA 1: Base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ETAPA 2: Desarrollo
FROM base AS development

# Copiamos el entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# No copiamos el código (lo monta docker)
# No instalamos deps acá

CMD ["docker-entrypoint.sh"]

# ETAPA 3: Build (Producción)
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ETAPA 4: Producción (nginx)
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
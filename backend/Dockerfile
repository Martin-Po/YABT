FROM node:20-slim

# Instalamos dependencias necesarias para Puppeteer en Linux (necesario para la Raspberry/VPS)
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libasound2 libpangocairo-1.0-0 libcups2 \
    fonts-liberation libappindicator3-1 libxshmfence1 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el cache de Docker
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Puerto por defecto de tu API
EXPOSE 3001

# Comando para desarrollo (necesitás tener nodemon en tu package.json)
CMD ["npm", "start"]
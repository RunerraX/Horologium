FROM node:23-bullseye

LABEL authors="Hakushi"
WORKDIR /application

# Install dependencies needed for Playwright Firefox + yt-dlp
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libatk1.0-0 \
    libasound2 \
    libdbus-1-3 \   
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g prisma

COPY . .

RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]
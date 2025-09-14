FROM node:23-bullseye

LABEL authors="Hakushi"
WORKDIR /application


COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g prisma

COPY . .

RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npm run build

CMD ["npm", "start"]
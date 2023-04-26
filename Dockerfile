FROM  --platform=linux/amd64 node:latest as base
WORKDIR /app

FROM base as dev
WORKDIR /app

COPY /package.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=8000

EXPOSE 8000

FROM base as prod
WORKDIR /app

COPY /package.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

ENV PORT=8000

EXPOSE 8000

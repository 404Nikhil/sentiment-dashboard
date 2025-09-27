
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
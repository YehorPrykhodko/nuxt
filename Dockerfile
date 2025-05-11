FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "3000"]

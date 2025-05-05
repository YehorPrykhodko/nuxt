# Используем официальный Node 18 образ
FROM node:18

# Рабочая директория в контейнере
WORKDIR /app

# Копируем только package.json + lock-файл, чтобы кешировать npm install
COPY package*.json ./

# Устанавливаем зависимости (bcryptjs вместо argon2, Vuetify, mysql2 и т.п.)
RUN npm install --production

# Копируем весь остальной код
COPY . .

# Собираем Nuxt-приложение
RUN npm run build

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение в режиме Preview (production)
CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "3000"]

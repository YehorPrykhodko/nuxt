# Dockerfile pour le forum interactif Nuxt 3
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json & lock pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Builder l'application Nuxt
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'application en mode production
CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "3000"]

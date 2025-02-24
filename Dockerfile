# Используем официальный Node.js образ как базовый
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код приложения
COPY . .

# Строим проект
RUN npm run build

# Открываем порт для приложения
EXPOSE 3000

# Запускаем приложение в продакшен режиме
CMD ["npm", "run", "start:prod"]
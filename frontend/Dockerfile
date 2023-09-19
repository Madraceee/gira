
FROM node:18-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN  npm install --production

COPY . .

RUN npm run build

CMD ["npm", "start"]
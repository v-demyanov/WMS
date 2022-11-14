# Stage 1: Build an Angular Docker Image
FROM node:14.16.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY /nginx.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/wms-frontend /usr/share/nginx/html

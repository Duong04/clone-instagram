FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx /var/cache/nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
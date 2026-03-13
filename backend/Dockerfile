# ✅ Sửa lại
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci                    # Install full deps để build được

COPY . .
RUN npm run build             # Build TypeScript → dist/

# Xóa devDependencies sau khi build xong
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/main.js"]
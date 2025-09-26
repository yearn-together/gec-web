# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json vite.config.ts postcss.config.cjs tailwind.config.cjs index.html ./
COPY src ./src
RUN npm install --no-audit --no-fund
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log

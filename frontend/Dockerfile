# FROM node:18-alpine AS client_build
# WORKDIR /app
# COPY ./frontend/.. /app/
# # RUN npm i

# RUN npm install -g @angular/cli@14.1.1 npm install -g npm@8.19.1 && npm install
# RUN ng build


# RUN npm install --production
# FROM alpine
# WORKDIR /app
# RUN apk add --no-cache nodejs
# COPY --from=server_build /app  ./
# EXPOSE 3006
# CMD ["node", "server"]

FROM node:18 as node
# WORKDIR /app
# WORKDIR /usr/src/app


# COPY . .

# # RUN unzip /app/node_modules.zip
# # RUN unzip /usr/src/app/node_modules.zip
# # RUN unzip /usr/src/app/dist.zip

# FROM nginx as runtime
# # COPY --from=build /app/dist/frontend /usr/share/nginx/html
# # COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

# RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
# COPY ./nginx.conf /etc/nginx/nginx.conf
# # COPY --from=node /app/dist /usr/share/nginx/html
# COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html



# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . .
# RUN npm install
# RUN npm run build --prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/frontend /usr/share/nginx/html
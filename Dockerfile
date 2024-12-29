# Dockerfile

# Stage 1: Build Angular application

FROM node:18.19.1 as build

ENV NODE_ENV=qa

WORKDIR /app

COPY ["package.json", "package-lock.json*", "angular.json", "karma.conf.js", "tsconfig.app.json", "tsconfig.json", "tsconfig.spec.json", "./"]

RUN npm install

RUN npm install -g @angular/cli@17.2.3

COPY . .

RUN ng build --configuration=qa

#CMD [ "node", "server.js" ]

# Stage 2: Serve Angular application using nginx

# FROM httpd:2.4 as runtime
FROM nginx:alpine

#copy angular dist folder to container

#COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

#copy httpd.conf to container

COPY --from=build /app/dist/ /usr/share/nginx/html

#change permissions

#RUN chmod -R 755 /usr/local/apache2/htdocs/

#expose port

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]

FROM node:alpine
EXPOSE 80

WORKDIR /var/web/
ENTRYPOINT node server.js

ADD . /var/web/

RUN npm ci

#name: tss
#run, then remove: docker run -p 80:80 --rm -it tss
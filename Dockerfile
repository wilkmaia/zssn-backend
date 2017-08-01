FROM node:latest

ADD . /zssn
WORKDIR /zssn

RUN npm rebuild .

EXPOSE 80

CMD ["node", "server.js"]

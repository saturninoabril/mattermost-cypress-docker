FROM node:10

WORKDIR /usr/src

RUN npm install axios express

COPY ./src/cypress/fixtures/users.json /usr/src/cypress/fixtures/users.json
COPY ./src/cypress/plugins/post_message_as.js /usr/src/cypress/plugins/post_message_as.js
COPY ./src/utils/webhook_utils.js /usr/src/utils/webhook_utils.js
COPY ./src/webhook_serve.js /usr/src


RUN pwd

RUN ls -rtl

EXPOSE 3000

CMD [ "node", "webhook_serve.js" ]
FROM node:14-alpine

ENV WEBHOOK_URL=http//localhost:3000
ENV SITE_URL=http//localhost:8065
ENV SITE_ADMIN_USERNAME=sysadmin
ENV SITE_ADMIN_PASSWORD=Sys@dmin-sample1

WORKDIR /usr/src

RUN npm install axios express

COPY ./e2e/cypress/plugins/post_message_as.js /usr/src/cypress/plugins/post_message_as.js
COPY ./e2e/utils/webhook_utils.js /usr/src/utils/webhook_utils.js
COPY ./e2e/webhook_serve.js /usr/src

RUN pwd

RUN ls -rtl

EXPOSE 3000

CMD [ "node", "webhook_serve.js" ]

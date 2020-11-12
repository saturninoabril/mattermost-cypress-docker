FROM node:14-alpine

ENV CYPRESS_webhookBaseUrl=WEBHOOK_URL
ENV CYPRESS_baseUrl=SITE_URL
ENV CYPRESS_adminUsername=SITE_ADMIN_USERNAME
ENV CYPRESS_adminPassword=SITE_ADMIN_PASSWORD

WORKDIR /usr/src

RUN npm install axios express

COPY ./e2e/cypress/plugins/post_message_as.js /usr/src/cypress/plugins/post_message_as.js
COPY ./e2e/utils/webhook_utils.js /usr/src/utils/webhook_utils.js
COPY ./e2e/webhook_serve.js /usr/src

RUN pwd

RUN ls -rtl

EXPOSE 3000

CMD [ "node", "webhook_serve.js" ]

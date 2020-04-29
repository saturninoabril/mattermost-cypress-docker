FROM cypress/browsers:node10.16.3-chrome80-ff73

ENV CYPRESS_baseUrl=$CYPRESS_baseUrl
ENV CYPRESS_webhookBaseUrl=$CYPRESS_webhookBaseUrl

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

WORKDIR /usr/src/e2e
COPY ./e2e/package.json /usr/src/e2e/package.json
COPY ./e2e/package-lock.json /usr/src/e2e/package-lock.json

RUN npm ci

COPY ./e2e /usr/src/e2e

RUN pwd
RUN ls -rtl

# give every user read access to the "/root" folder where the binary is cached
# we really only need to worry about the top folder, fortunately
RUN ls -la /root
RUN chmod 755 /root

RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "user:            $(whoami) \n" \
  "chrome:          $(google-chrome --version || true) \n" \
  "firefox:         $(firefox --version || true) \n" \
  "files:           $(ls -rtl) \n" \
  "CYPRESS_baseUrl: $(echo $CYPRESS_baseUrl) \n"

CMD ["node", "run_tests.js"]

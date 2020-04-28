FROM alpine:3.10

# Some ENV variables
ENV PATH="/mattermost/bin:${PATH}"

# Version
# https://releases.mattermost.com/5.20.0-rc5/mattermost-5.20.0-rc5-linux-amd64.tar.gz
ENV MM_VERSION=

# Branch
# https://releases.mattermost.com/mattermost-platform/master/mattermost-enterprise-linux-amd64.tar.gz
ENV MM_BRANCH=master

ARG PUID=2000
ARG PGID=2000

# Install some needed packages
RUN apk add --no-cache \
	ca-certificates \
	curl \
	jq \
	libc6-compat \
	libffi-dev \
    libcap \
	linux-headers \
	mailcap \
	netcat-openbsd \
	xmlsec-dev \
	tzdata \
	&& rm -rf /tmp/*

# Get Mattermost
RUN mkdir -p /mattermost/data /mattermost/plugins /mattermost/client/plugins \
    && if [ ! -z "$MM_VERSION" ]; then curl https://releases.mattermost.com/$MM_VERSION/mattermost-$MM_VERSION-linux-amd64.tar.gz | tar -xvz ; \
      else curl https://releases.mattermost.com/mattermost-platform/$MM_BRANCH/mattermost-enterprise-linux-amd64.tar.gz | tar -xvz ; fi \
    && cp /mattermost/config/config.json /config.json.save \
    && rm -rf /mattermost/config/config.json \
    && addgroup -g ${PGID} mattermost \
    && adduser -D -u ${PUID} -G mattermost -h /mattermost -D mattermost \
    && chown -R mattermost:mattermost /mattermost /config.json.save /mattermost/plugins /mattermost/client/plugins \
    && setcap cap_net_bind_service=+ep /mattermost/bin/mattermost

USER mattermost

#Healthcheck to make sure container is ready
HEALTHCHECK CMD curl --fail http://localhost:8000 || exit 1

COPY . .

# Configure entrypoint and command
COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
WORKDIR /mattermost
CMD ["mattermost"]

# Expose port 8000 of the container
EXPOSE 8000

# Declare volumes for mount point directories
VOLUME ["/mattermost/data", "/mattermost/logs", "/mattermost/config", "/mattermost/plugins", "/mattermost/client/plugins"]

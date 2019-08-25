FROM ubuntu:disco

ENV NODE_VERSION 10

RUN set -x && \
  apt-get update && \
  : apt-get install -y apt-utils && \
  apt-get install -y \
    ca-certificates \
    curl \
    git \
    python3-pip \
  && \
  : "to fix vulnerabilities, update following packages" && \
  : apt-get install -y --no-install-recommends \
    bzip2 \
  && \
  : "install node" && \
  curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
  apt-get install -y nodejs && \
  : "cleanup apt caches" && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  : "prepare app directory" && \
  mkdir -p /opt/app && \
  :

COPY package*.json /opt/app/

WORKDIR /opt/app

RUN set -x && \
  : "install node modules" && \
  npm clean-install && \
  :

CMD ["/bin/bash"]

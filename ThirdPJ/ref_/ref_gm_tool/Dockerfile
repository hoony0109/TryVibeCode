FROM node:14.17.4

RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list

RUN apt-get update && \
	apt-get -y upgrade && \
	ln -s -f /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
	apt-get install -y ntp && \
	apt-get install -y vim

RUN mkdir -p /app
WORKDIR /app
ADD ./log /app/log
ADD ./build /app/build
ADD ./public /app/public
ADD ./src /app/src
ADD ./utility /app/utility
ADD ./server /app/server

ADD .gitignore /app
ADD config.js /app
ADD Dockerfile /app
ADD package-lock.json /app
ADD package.json /app
ADD README.md /app


RUN npm install

CMD ["npm", "start"]

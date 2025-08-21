#!/bin/bash

# move to workDir
cd $1

# create Dockerfile for build image
# FROM node:14.17.4
# FROM node:16.13.0
cat << EOF > Dockerfile
FROM node:14.17.4

RUN apt-get update && \
	apt-get -y upgrade && \
	ln -s -f /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
	apt-get install -y ntp && \
	apt-get install -y vim

RUN mkdir -p /app
WORKDIR /app
ADD ./app /app

RUN npm install

CMD ["npm", "start"]
EOF

# create dockerignore 
cat << EOF > .dockerignore
node_modules
log
EOF

# create build script
cat << EOF > build_bs_crm.sh
docker build -t bs_crm:react-web-app .
EOF
chmod +x build_bs_crm.sh

# create run script
cat << EOF > run_container.sh
docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d bs_crm:react-web-app
EOF
chmod +x run_container.sh

# create remove script
cat << EOF > remove_container.sh
docker rm -f bs_crm
EOF
chmod +x remove_container.sh

# create connect script
cat << EOF > connect_container.sh
docker exec -it bs_crm bash
EOF
chmod +x connect_container.sh

# build:
#   docker build -t reskel-pg .
#
# If an npm install step times out, try running off the FDA vpn network, then
# reconnect before continuing.
#
# run:
#   docker run --name reskel -p 3000:3000 reskel-pg
#
# Stop (if running) and remove container:
#   docker rm -vf reskel
# This is necessary before running the container again.

FROM node:15-buster-slim

RUN apt-get update && apt-get -y upgrade && apt-get -y autoremove && apt-get -y clean

########################
RUN mkdir /app
WORKDIR /app

RUN mkdir src
ADD client src/client
ADD server src/server
RUN cd src/client && npm install
RUN cd src/server && npm install
RUN cd src/server && npm run build
RUN mv src/server/dist/* .
RUN mv src/server/node_modules .

ENV PORT=3000
EXPOSE $PORT
CMD node server.js public/

FROM node:12-alpine

WORKDIR /opt/humans.txt

COPY . /opt/humans.txt

RUN npm i --production

ENV FORCE_COLOR=3

ENTRYPOINT ["bash", "/opt/humans.txt/run.sh"]

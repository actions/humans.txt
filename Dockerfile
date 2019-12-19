FROM node:12

WORKDIR /opt/humans.txt

COPY . /opt/humans.txt

RUN npm i --production

ENTRYPOINT ["bash", "/opt/humans.txt/run.sh"]

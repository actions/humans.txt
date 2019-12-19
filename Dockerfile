FROM node:12

COPY . .

RUN npm i --production

ENTRYPOINT ["node" , "action.js"]

FROM node:13.6.0-alpine as build

WORKDIR /home/node

RUN npm i -g @zeit/ncc

COPY package*.json ./

RUN npm install

COPY tsconfig.json .

COPY src ./src

RUN ncc build -o build ./src/dogs/container.ts

FROM node:13.6.0-alpine

RUN npm install -g pm2

COPY --from=build /home/node/build ./

ENV PORT=8080

CMD ["pm2", "start", "--no-daemon", "index.js"]

# Use Node v8.9.0 LTS
FROM node:carbon

# always nice to have an editor when you need one
RUN ["apt-get", "update"]
RUN ["apt-get", "-y", "install", "vim"]

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
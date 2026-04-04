FROM node:24

WORKDIR /TELERINFRONTEND

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4210

CMD ["npm", "run", "dev"]
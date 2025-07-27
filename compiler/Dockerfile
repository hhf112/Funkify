FROM node:22

WORKDIR /app

RUN apt-get update && apt-get install g++

COPY . .

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "dev"]

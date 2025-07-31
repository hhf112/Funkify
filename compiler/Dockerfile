FROM node:22

WORKDIR /app

USER root
RUN apt-get update && apt-get install g++


RUN useradd -m sandbox

COPY --chown=sandbox:sandbox . .


USER sandbox
RUN npm ci --only=production

EXPOSE 4000

CMD ["npm", "run", "dev"]

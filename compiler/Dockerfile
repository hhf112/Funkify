FROM node:22

WORKDIR /app

USER root
RUN apt-get update && apt-get install -y g++

RUN npm install -g pnpm

RUN useradd -m sandbox

COPY --chown=sandbox:sandbox . .

RUN chown -R sandbox:sandbox /app

USER sandbox
RUN pnpm install --prod

EXPOSE 4000

CMD ["npm", "run", "dev"]

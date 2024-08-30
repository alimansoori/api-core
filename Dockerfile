FROM node:20.12.1 as development

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    gcc \
    python3 \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    librsvg2-dev \
    && ln -sf python3 /usr/bin/python
RUN python --version

RUN npm install -g pnpm
RUN npm install -g newman
RUN npm install -g newman-reporter-htmlextra

WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm i
COPY . ./
RUN pnpm db:gen
EXPOSE 3002
RUN pnpm build

######################################

FROM node:20.12.1 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json .
RUN pnpm install --prod
COPY --from=development /app/build ./build
CMD [ "pnpm", "start" ]
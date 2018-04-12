FROM node:carbon AS builder
WORKDIR /usr/src/page-view-counter-app
COPY . .
RUN npm install
RUN npm run build

FROM builder AS dependencies
WORKDIR /usr/src/page-view-counter-app
RUN npm install --production

FROM node:carbon AS release
WORKDIR /usr/src/page-view-counter-app
COPY --from=builder /usr/src/page-view-counter-app/dist/ ./
COPY --from=dependencies /usr/src/page-view-counter-app/node_modules ./node_modules
EXPOSE 8080
CMD node ./index.js
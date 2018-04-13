FROM mhart/alpine-node AS builder
WORKDIR /usr/src/page-view-counter-app
COPY . .
RUN npm install && npm run build

FROM builder AS dependencies
WORKDIR /usr/src/page-view-counter-app
RUN npm install --production

FROM alpine:3.6 AS release
WORKDIR /usr/src/page-view-counter-app
COPY --from=builder /usr/bin/node /usr/bin
COPY --from=builder /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=builder /usr/src/page-view-counter-app/dist/ ./
COPY --from=dependencies /usr/src/page-view-counter-app/node_modules ./node_modules
CMD CONTAINER_NAME=$(curl http://169.254.169.254/latest/meta-data/instance-id --max-time 3) && export CONTAINER_NAME
EXPOSE 8080
CMD node ./index.js
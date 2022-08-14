FROM node:16

WORKDIR /league-board/server

COPY package.json .

# this will install both prod and dev dependencies
RUN npm install --legacy-peer-deps

# this checks if on production, only install production dependencies
#RUN if [ "$NODE_ENV" = "development" ]; \
#        then npm install; \
#        else npm install --only=production;  \
#        fi

COPY . .

RUN npm run build

RUN npm i pm2 -g

ENV PORT 3210
EXPOSE 3210

CMD ["pm2-runtime", "start", "/league-board/server/dist/index.js"]


# docker build -t league-board-api .
# docker run -d -p 8080:8080 imageId
# docker login
# docker tag imageId randygong/league-board-api:v1
# docker push randygong/league-board-api:v1

# docker rm $(docker ps -a -f status=exited -q)
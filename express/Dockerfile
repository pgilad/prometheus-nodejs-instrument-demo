FROM node

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install --production

COPY ./express.js /app/express.js

EXPOSE 8000

CMD ["node", "/app/express.js"]

FROM node:19-alpine

# ENV NODE_ENV production
ENV NODE_ENV development

RUN mkdir /app && chown node:node /app
WORKDIR /app

# Run the application as a non-root user.
USER node
COPY --chown=node:node package*.json .

RUN npm i

COPY --chown=node:node . .

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD ["npm", "run", "start"]

FROM node:19-alpine

# ENV NODE_ENV production
ENV NODE_ENV development

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm i

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD ["npm", "run", "start"]

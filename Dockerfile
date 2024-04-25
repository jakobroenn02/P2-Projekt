# Use the official Node.js 21.6.2 image from Docker Hub.
FROM node:21.6.2

# Create and change to the app directory.
WORKDIR /usr/src/app

ENV DBURL="mongodb+srv://jakobhroenn:9Dn6ixRsD5ny8CxB@cluster0.zc1t2pm.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=Cluster0"
ENV JWTSECRET="hello"


# Copy application dependency manifests to the container image.
# This ensures both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change if the package.json files are not changed.
COPY package*.json ./

RUN npm rebuild bcrypt --build-from-source
# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

EXPOSE 8080
# Run the web service on container startup.
CMD [ "node", "app.js" ]

FROM node:8-alpine

# Create application directory.
WORKDIR /usr/src/app

# copying application dependencies 
COPY package.json ./

# installing dependencies
# for more serious production versions there should be seperate production and development dependencies
# in the package file and only the production ones should be installed to avoid bloat RUN npm install --only=production
RUN npm install


# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
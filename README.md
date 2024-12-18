# Angular Server Side Rendering in Kubernetes

This is a sample project with Angular 19 SSR connected to sample Python FastAPI backend

## Steps

To run the project
1. [Install minikube and kubectl](https://kubernetes.io/docs/tasks/tools/)
2. Run the following
``` bash
cd k8s
./apply.sh
./delete.sh
```

## Explanation

We have a sample FastAPI backend which simply returns {"message":"Hello World"} when we query it.
Now, we are attempting to connect a front end to it, which has a button that logs the message it received from back end.
This is the dockerfile for Angular 19 SSR

```
# Use Node.js for building the Angular SSR app
FROM node:18 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the Angular SSR app
COPY . .
RUN npm run build:ssr

# Use a minimal Node.js image to run the SSR server
FROM node:18-alpine as server

# Set the working directory
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/dist /app/dist
COPY package*.json ./
# # Install serve to serve the SSR app
# RUN npm install -g serve

# Expose the SSR server port
EXPOSE 4000

# Command to run the SSR server
CMD ["npm", "run", "serve:ssr"]
```

Angular uses express to enable the server side rendering. Typically we use NGINX to serve static websites but in this case, we are using node. Still, there is a build stage as the typescript needs to be compiled down, and it builds to the /dist folder.

To enable the front end to connect to back end, we need to define the routes in server.ts file. In our example, in the app.component.ts we have

``` typescript
fetchData() {
    this.http.get('/api').subscribe(
      response => {
        console.log('API Response:', response);
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
```

The API call happens in the browser, and the Express server is defined to redirect it to the backend service, by simply providing the service name and the port, in the /src/server.ts.

``` typescript
app.get('/api', (req, res) => {
  const targetUrl = 'http://backend-service:8000/'; // Backend service name and port number
  console.log(targetUrl)
  fetch(targetUrl)
    .then((apiRes) => apiRes.text())
    .then((body) => res.send(body))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
```

Express will be now reroute all requests from /api to the backend service.
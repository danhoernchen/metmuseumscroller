// packages import
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
// enable CORS
app.use(cors());
// set the port on which our app wil run
// important to read from environment variable if deploying
const port = process.env.PORT || 8088;

// basic string route to prevent Glitch error
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/search/:id", (req, res) => {
  // replace with a custom URL as required
  const backendUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${req.params.id}`;
  // return the data without modification
  axios
    .get(backendUrl)
    .then((response) => res.send(response.data))
    .catch((error) => res.send(error.data));
});

app.get("/objects/:id", (req, res) => {
  // replace with a custom URL as required
  const backendUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${req.params.id}`;
  // return the data without modification
  axios
    .get(backendUrl)
    .then((response) => res.send(response.data))
    .catch((error) => res.send({ failedWith: error }));
});

// console text when app is running
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

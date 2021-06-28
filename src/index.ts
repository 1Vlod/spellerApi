import http = require("http");
import { spellerTransform } from "./apiStream";

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/upload" && req?.method?.toLowerCase() === "post") {
    const transfromStream = new spellerTransform();

    console.log("Got request");
    try {
      req.pipe(transfromStream).pipe(res);
      return;
    } catch (error) {
      console.log(error);
      res.end("500");
    }
  }
});

server.listen(5000, () => {
  console.log("Server listening on http://localhost:5000 ...");
});

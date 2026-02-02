const { createServer } = require("http");
const next = require("next");

// Production mode for cPanel deployment
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal server error");
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Environment: ${dev ? "development" : "production"}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
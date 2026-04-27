import express from "express";
import dotenv from "dotenv";
import { serverTests } from "../serverTests.js";
import { initDB } from "./config/db.js";
import ratelimit from "./middleware/rateLimiter";
import sportRouters from "./routes/sportRoutes";
import userRouters from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(ratelimit);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("it's working");
});

app.use("/api/sports", sportRouters);
app.use("/api/users", userRouters);

async function startServer() {
  await initDB();

  const server = app.listen(PORT, () => {
    console.log(`✅ Server is UP, and running on PORT: ${PORT}`);
    console.log(`my port is: ${PORT}`);
  });

  serverTests(server);
}

startServer();


// 🔥 Short summary

// 👉 express = server
// 👉 middleware = filters for requests
// 👉 routes = endpoints
// 👉 initDB = prepare database
// 👉 startServer = run everything

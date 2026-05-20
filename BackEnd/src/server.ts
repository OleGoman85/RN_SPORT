import express from "express";
import dotenv from "dotenv";
import { serverTests } from "./serverTests";
import { initDB } from "./config/db";
import ratelimit from "./middleware/rateLimiter";
import contactRouters from "./routes/contactRoutes";
import sportRouters from "./routes/sportRoutes";
import uploadRouters from "./routes/uploadRoutes";
import userRouters from "./routes/userRoutes";

dotenv.config();

//express() creates a server.
const app = express();

app.use(ratelimit);
//"Server, learn how to read JSON that comes from the Frontend."
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
	res.send("it's working");
});

app.use("/api/sports", sportRouters); //-> search, events, sport requests
app.use("/api/upload", uploadRouters); //-> upload avatar
app.use("/api/users", userRouters); //-> All about the user profile
app.use("/api/contacts", contactRouters); //-> saved users / address book

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

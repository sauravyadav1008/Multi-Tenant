import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import env from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.use("/api", routes);

export default app;
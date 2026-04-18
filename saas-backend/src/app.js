import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import apiLimiter from "./middleware/rateLimit.middleware.js";

const app = express();

// Request logging using morgan and winston
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Global API Rate Limiting
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.use("/api", routes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

export default app;

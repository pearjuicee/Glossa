import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// middleware to parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:5173", // restricted to frontend URL
  })
);
app.use(express.json());

//routes
app.use("/api", routes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export { app };

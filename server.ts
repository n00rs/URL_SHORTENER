import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.router";
import analyticsRoutes from "./routes/analytics.router";
import shortenRoutes from "./routes/shorten.router";
const app: Express = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use("/api/auth",authRoutes);
app.use("/api/shorten",shortenRoutes);
app.use("/api/analytics",analyticsRoutes);
app.listen(process.env.PORT || 5005, () =>
  console.log(`server running at ${process.env.PORT || 5005}`)
);

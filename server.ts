import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.router";
import analyticsRoutes from "./routes/analytics.router";
import shortenRoutes from "./routes/shorten.router";
import path from "path";
import { verifyAccessToken } from "./libs/common/functions";
const app: Express = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/index.html"))
})
app.use("/api/auth",authRoutes);
app.use(verifyAccessToken);
app.use("/api/shorten",shortenRoutes);
app.use("/api/analytics",analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err, "-------------");
  const statusCode = err.statusCode ? err.statusCode : 400;
  res.status(statusCode).json(err.message || err);
});

app.listen(process.env.PORT || 5005, () =>
  console.log(`server running at ${process.env.PORT || 5005}`)
);

import express from "express";
import cors from "cors";
import router from "./routes/llm.route.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.get("/", (req, res) => {
  return res.send("Working");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Express error handler:", err);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  return res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

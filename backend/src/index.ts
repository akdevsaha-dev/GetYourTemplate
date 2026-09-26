import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.send("Working");
});

app.listen("3000", () => {
  console.log(`Server is listening on http://localhost:3000`);
});

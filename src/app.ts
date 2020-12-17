import env from "dotenv";
env.config();
import express from "express";

const app = express();
const port = process.env.APP_PORT || 3000;
app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});
// @ts-ignore
app.listen(port, (err) => {
  // @ts-ignore
  if (err) {
    // tslint:disable-next-line:no-console
    return console.error(err);
  }
  // tslint:disable-next-line:no-console
  return console.log(`server is listening on ${port}`);
});

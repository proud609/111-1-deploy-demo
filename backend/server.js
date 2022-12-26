import path from "path";
import db from './db';
import express from "express";
import cors from "cors";
import routes from './routes'
import bodyParser from 'body-parser';

db.connect();
const app = express();
// init middleware
if (process.env.NODE_ENV === "development") {
  app.use(cors());
}
// define routes
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

// define server
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});

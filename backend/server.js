import express from "express";

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// nodemon server.js

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

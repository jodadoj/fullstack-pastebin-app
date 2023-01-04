import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (req, res) => {
  res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/health-check", async (req, res) => {
  try {
    //For this to be successful, must connect to db
    await client.query("select now()");
    res.status(200).send("system ok");
  } catch (error) {
    //Recover from error rather than letting system halt
    console.error(error);
    res.status(500).send("An error occurred. Check server logs.");
  }
});

app.get("/pastes", async (req, res) => {
  const pasteList = await client.query("select * from paste_bin"); // await client.query('select "id", "name", "text" from paste_bin');
  res.status(200).json(pasteList);
  // app.get("/pastes", (req, res) => {
  //   const allSignatures = getAllDbItems();
  //   res.status(200).json(allSignatures);
  // });
});

app.post("/paste", async (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  const newPasteName = req.body.name;
  const newPasteText = req.body.text;
  const text = "INSERT INTO paste_bin(name, text) VALUES($1, $2) RETURNING *";
  const values = [newPasteName, newPasteText];

  const postData = await client.query(text, values);

  res.status(201).json(postData);
});


// DELETE /signatures/:id
// app.delete<{ id: string }>("/signatures/:id", (req, res) => {
//   const matchingSignature = deleteGuestbookSignatureById(
//     parseInt(req.params.id)
//   );
//   if (matchingSignature === "not found") {
//     res.status(404).json(matchingSignature);
//   } else {
//     res.status(200).json(matchingSignature);
//   }
// });

//--------------------------------------------------------------------------------Deletes all pastes from table leaving empty table
app.delete("/delete", async (req, res) => {
  await client.query("delete from paste_bin");
});


connectToDBAndStartListening();

async function connectToDBAndStartListening() {
  console.log("Attempting to connect to db");
  await client.connect();
  console.log("Connected to db!");

  const port = getEnvVarOrFail("PORT");
  app.listen(port, () => {
    console.log(
      `Server started listening for HTTP requests on port ${port}.  Let's go!`
    );
  });
}

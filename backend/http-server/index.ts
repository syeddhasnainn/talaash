const express = require('express')
import { Request, Response } from "express"
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()


const app = express()
app.use(express.json());
app.use(cors())
const port = 3003
import { copyS3Folder } from "./aws";

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})


app.post("/project", async (req:Request, res:Response) => {
    // Hit a database to ensure this slug isn't taken already
    const { replId, language } = req.body;
    console.log(replId, language)
    console.log(replId, language)
    console.log(replId, language)

    if (!replId) {
        res.status(400).send("Bad request");
        return;
    }

    await copyS3Folder(`base/${language}`, `code/${replId}`);

    res.send("Project created");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
import express from "express"
import { Request, Response } from "express"
import cors from "cors";
import dotenv from "dotenv"
import {createServer} from "http"
import { initWs } from "./ws";
dotenv.config()

const app = express()
const port = 3001

app.use(cors())
const httpServer = createServer(app)

initWs(httpServer)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
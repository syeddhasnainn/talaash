import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import cors from "cors";
import { KubeConfig, AppsV1Api, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";

const app = express()
app.use(express.json())
app.use(cors())

const kubeconfig = new KubeConfig()
kubeconfig.loadFromDefault()

const coreApi = kubeconfig.makeApiClient(CoreV1Api)
const appApi = kubeconfig.makeApiClient(AppsV1Api)
const networkingApi = kubeconfig.makeApiClient(NetworkingV1Api)

const readAndParseYaml = (filepath:string, chatId:string): Array<any>=>{
    const fileContent = fs.readFileSync(filepath, 'utf-8')
    const docs = yaml.parseAllDocuments(fileContent).map((doc)=>{
        let docString = doc.toString()
        const regex = new RegExp(`service_name`, 'g')
        docString = docString.replace(regex, chatId)
        console.log(docString)
        return yaml.parse(docString)
    })
    return docs
}

app.post('/start', async (req,res)=> {
    const {chatId} = req.body
    const namespace = "default"

    try {
        const kubeManifests = readAndParseYaml(path.join(__dirname, "./service.yaml"), chatId)
        for (const manifest of kubeManifests) {
            switch(manifest.kind) {
                case "Deployment":
                    await appApi.createNamespacedDeployment(namespace, manifest)
                    break
                case "Service":
                    await coreApi.createNamespacedService(namespace, manifest)
                    break
                case "Ingress":
                    await networkingApi.createNamespacedIngress(namespace, manifest)
                    break
                default:
                    console.log(`Unsupported kind: ${manifest.kind}`)
            }
        }
        res.status(200).send({message:"Resources created!"})
    }

    catch(error) {
        console.log("Failed to create Resources", error)
        res.status(500).send({message:"Failed to create resources"})
    }
})

const port = process.env.PORT || 3002;
app.listen(port, ()=>{
console.log(`Listening on port:${port}`)
})
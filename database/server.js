require('dotenv').config()
const express = require("express")
const cors = require('cors');
const app = express()
const port = 5000
const { db } = require('./firebase.js')
const { FieldValue } = require("firebase-admin/firestore")

const corsOption = {
    credentials: true,
    origin: '*'
}
app.use(cors(corsOption));
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//pegar todas as correspondências no banco de dados das ocorrencias
app.get('/ocorrencias',async (req, res) => {
    try {
        const ocorrenciaRef = db.collection('ocorrencias');
        const docs = await ocorrenciaRef.get();
        var resposta = "";
        var contador = 0;
        docs.forEach(doc => {
            if (contador > 0)
                resposta += ",";
            resposta += JSON.stringify(doc.id) + ":" + JSON.stringify(doc.data());
            contador++;
        })
        resposta = '{' + resposta + "}";
        res.status(200).send(JSON.parse(resposta))
    } catch (err) {
        res.status(500)
    }
})
//verificar se o id existe
app.get('/verficarExistencia', async (req, res) => {
    try {
        const { id } = req.body
        const ocorrenciaRef = db.collection('ocorrencias').doc(`${id}`)
        const doc = await ocorrenciaRef.get()
        if (!doc.exists) {
            return res.send(false)
        }
        return res.send(true)
    } catch (err) {
        res.status(500)
    }
})
//adicionar uma ocorrencia no banco de dados
app.post('/addOcorrencia', async (req, res) => {
    try {
        const { id, ocorrencia, longitude, latitude, Endereco } = req.body;
        const cidadeRef = db.collection('ocorrencias').doc(`${id}`)
        const res2 = await cidadeRef.set({
            "ocorrencia": ocorrencia,
            "latitude": latitude,
            "longitude": longitude,
            "Endereco": Endereco
        },
            { merge: true }
        )
        res.status(200).send("ocorrencia criada")
    } catch (err) {
        res.status(500)
    }
})

//alterar uma ocorrencia de dados
app.patch("/alterarOcorrencia", async (req, res) => {
    try {
        const { id, novaOcorrencia } = req.body
        const cidadeRef = db.collection('ocorrencias').doc(`${id}`)
        const res2 = await cidadeRef.set({
            "ocorrencia": novaOcorrencia
        }, { merge: true })
        res.status(200).send("ocorrencia alterada")
    } catch (err) {
        res.status(500)
    }
})

//deletar uma ocorrência no banco de dados
app.delete("/ocorrencia", async (req, res) => {
    try {
        const { id } = req.body
        const cidadeRef = db.collection('ocorrencias').doc(`${id}`)
        await cidadeRef.delete()
        res.status(200).send("ocorrencia deletada")
    } catch (err) {
        res.status(500)
    }
})

//inicializando o server na porta 5000
app.listen(port, () => console.log(`Server foi iniciado na porta: ${port}`))
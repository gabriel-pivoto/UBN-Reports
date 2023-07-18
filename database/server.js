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

//verificar se o login e senha batem com algum valor já existente no banco de dados, retorna true caso encontre algo e false caso não encontre
app.get('/login/:email/:senha', async (req, res) => {
    try {
        const { email ,senha} = req.params
        const contaRef = db.collection('contas')
        const snapshot = await contaRef.where('email', '==', email).where('senha','==',senha).get();
        if (snapshot.empty) {
            return res.send(false);
          } 
          return res.send(true);
        
    } catch (err) {
        res.status(500)
    }
})


//verificar se o id existe
app.get('/verficarExistencia/ocorrencia/:id', async (req, res) => {
    try {
        const { id } = req.params
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

//verificar se a conta existe retorna false se os dois parametros ainda não existirem e retorna true caso existirem em algum lugar
app.get('/verficarExistencia/conta/:cpf/:email', async (req, res) => {
    try {
        const { cpf ,email} = req.params
        const contaRef = db.collection('contas')
        const doc = await contaRef.doc(`${cpf}`).get()
        if (doc.exists) {
            return res.send(true)
        }
        const snapshot = await contaRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.send(true);
          } 
          return res.send(false);
        
    } catch (err) {
        res.status(500)
    }
})



//procurar uma requisição pelo id
app.get('/pegar/ocorrencia/:id', async (req, res) => {
    try {
        const { id } = req.params
        const ocorrenciaRef = db.collection('ocorrencias').doc(`${id}`)
        const doc = await ocorrenciaRef.get()
        if (!doc.exists) {
            return res.send(false)
        }
        return res.status(200).send(doc.data())
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

//adicionar uma conta no banco de dados
app.post('/addConta', async (req, res) => {
    try {
        const { email,senha, user,  cpf, adm} = req.body;
        const contaRef = db.collection('contas').doc(`${cpf}`)
        const res2 = await contaRef.set({
            "email": email,
            "senha": senha,
            "user":user,
            "cpf": cpf,
            "adm":adm
        },
            { merge: true }
        )
        res.status(200).send("conta criada")
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
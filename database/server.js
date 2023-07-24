require('dotenv').config()
const express = require("express")
const cors = require('cors');
const app = express()
const port = 5000
const { db,uploadImage } = require('./firebase.js')
const { FieldValue } = require("firebase-admin/firestore")
const Multer = require('multer');



const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: 1024 * 1024 *100
})



const corsOption = {
    credentials: true,
    origin: '*'
}
app.use(cors(corsOption));
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    
    next();
});




//pegar todas as correspondências no banco de dados das ocorrencias
app.get('/ocorrencias', async (req, res) => {
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
app.get('/login/:cpf/:senha', async (req, res) => {
    try {
        const { cpf, senha } = req.params
        const contaRef = db.collection('contas')
        const snapshot = await contaRef.where('cpf', '==', cpf).where('senha', '==', senha).get();
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
// app.get('/verficarExistencia/conta/:cpf/:email', async (req, res) => {
//     try {
//         const { cpf, email } = req.params
//         const contaRef = db.collection('contas')
//         const doc = await contaRef.doc(`${cpf}`).get()
//         if (doc.exists) {
//             return res.send(true)
//         }
//         const snapshot = await contaRef.where('email', '==', email).get();
//         if (!snapshot.empty) {
//             return res.send(true);
//         }
//         return res.send(false);

//     } catch (err) {
//         res.status(500)
//     }
// })


//verificar o histórico de requisições do usuário
app.get('/hitoricoReq/:cpf', async (req, res) => {
    try {
        let ocorrencias = "[";
        let contador = 0
        const { cpf } = req.params
        const contaRef = db.collection('ocorrencias')
        const snapshot = await contaRef.where('cpf', '==', cpf).get();
        if (snapshot.empty) {
            return res.send(false);
        }

        snapshot.forEach(doc => {
            if (contador > 0)
                ocorrencias += ","
            ocorrencias += JSON.stringify(doc.data())
            contador++;
        });
        ocorrencias += "]"

        return res.send(JSON.parse(ocorrencias));


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


//procurar uma conta pelo cpf
app.get('/pegar/conta/:cpf', async (req, res) => {
    try {
        const { cpf } = req.params
        const contaRef = db.collection('contas').doc(`${cpf}`)
        const doc = await contaRef.get()
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
        const { ocorrencia, longitude, latitude, Endereco, cpf } = req.body;
        let id;
        let idExistente = true;
        const ocorrenciaRef = db.collection('ocorrencias')
        while (idExistente) {
            id = Math.floor(Math.random() * 1000000000) + 1;
            const doc = await ocorrenciaRef.doc(`${id}`).get()
            if (!doc.exists) {
                idExistente = false;
            }
        }
        const ocorrenciaRef2 = ocorrenciaRef.doc(`${id}`)
        const res2 = await ocorrenciaRef2.set({
            "id": id,
            "ocorrencia": ocorrencia,
            "latitude": latitude,
            "longitude": longitude,
            "Endereco": Endereco,
            "cpf": cpf
        },
            { merge: true }
        )
        res.status(200).send("ocorrencia criada")
    } catch (err) {
        res.status(500)
    }
})

//adicionar uma conta no banco de dados
app.post('/addConta', multer.single('imagem'), uploadImage, async (req, res) => {
    try {
        let c1 = false;
        let c2 = false;
        const { email, senha, user, cpf, adm} = req.body;
        const imagem = req.file.firebaseUrl
        const contaRef2 = db.collection('contas')
        const doc = await contaRef2.doc(`${cpf}`).get()
        if (doc.exists) {
            c1 = true;
        }
        const snapshot = await contaRef2.where('email', '==', email).get();
        if (!snapshot.empty) {
            c2 = true;
        }
        if (!c1 && !c2) {
            const contaRef = db.collection('contas').doc(`${cpf}`)
            const res2 = await contaRef.set({
                "email": email,
                "senha": senha,
                "user": user,
                "cpf": cpf,
                "adm": adm,
                "imagem":imagem
            },
                { merge: true }
            )
            res.status(200).send(true)

        } res.status(201).send(false)

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
const express = require("express")
const app = express()
const port = 5000
const {db}= require('./firebase.js')
const { FieldValue } = require("firebase-admin/firestore")
app.use(express.json())

//pegar todas as correspondências no banco de dados na collection estados no doc cidades
app.get('/cidades',async (req,res)=>{
    const cidadeRef = db.collection('estados').doc('cidades')
    const doc = await cidadeRef.get()
    if(!doc.exists){
        return res.sendStatus(400)
    }
    res.status(200).send(doc.data())
})

//adicionar uma cidade e uma ocorrência no banco de dados na collection estados no doc cidades
app.post('/addcidade',async (req,res)=>{
const {nome,ocorrencia}=req.body
const cidadeRef = db.collection('estados').doc('cidades')
const res2 = await cidadeRef.set({
    [nome]:ocorrencia},
    {merge:true}
)
res.status(200).send("ocorrencia criada")
})

//alterar uma ocorrência de uma cidade no banco de dados na collection estados no doc cidades
app.patch("/alterarOcorrencia",async (req,res)=>{
const {nome,novaOcorrencia}=req.body
const cidadeRef = db.collection('estados').doc('cidades')
const res2 = await cidadeRef.set({
    [nome]:novaOcorrencia
},{merge:true})
res.status(200).send("ocorrencia alterada")
})

//deletar uma ocorrência de uma cidade no banco de dados na collection estados no doc cidades
app.delete("/cidade",async(req,res)=>{
const {nome}=req.body
const cidadeRef = db.collection('estados').doc('cidades')
const res2 = await cidadeRef.update({
    [nome]:FieldValue.delete()
})
res.status(200).send("ocorrencia deletada")
})

//inicializando o server na porta 5000
app.listen(port,()=>console.log(`Server foi iniciado na porta: ${port}`))
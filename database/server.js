require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
const { db, uploadImage } = require("./firebase.js");
const { FieldValue } = require("firebase-admin/firestore");
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: 1024 * 1024 * 100,
});

const corsOption = {
  credentials: true,
  origin: "*",
};
app.use(cors(corsOption));
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

//pegar todas as correspondências no banco de dados das ocorrencias
app.get("/ocorrencias", async (req, res) => {
  try {
    const ocorrenciaRef = db.collection("ocorrencias");
    const docs = await ocorrenciaRef.get();
    var resposta = "";
    var contador = 0;
    docs.forEach((doc) => {
      if (contador > 0) resposta += ",";
      resposta += JSON.stringify(doc.id) + ":" + JSON.stringify(doc.data());
      contador++;
    });
    resposta = "{" + resposta + "}";
    res.status(200).send(JSON.parse(resposta));
  } catch (err) {
    res.status(500);
  }
});

//pegar as correspondências no banco de dados das ocorrencias de acordo com a cidade
app.get("/pegar/ocorrencias/:cidade", async (req, res) => {
  try {
    const { cidade } = req.params;
    const ocorrenciaRef = db.collection("ocorrencias");
    const docs = await ocorrenciaRef.get();
    var resposta = "";
    var contador = 0;
    var possuiOcorrencia = false;

    docs.forEach((doc) => {
      if (contador > 0) { resposta += ","; }

      parametro = JSON.stringify(doc.data()['Endereco']);

      reclamacao = JSON.stringify(doc.data()['status']);

      parametroReduzido = parametro.split(',')
      parametro = parametroReduzido[2].slice(1)
      if (cidade == parametro) {
        resposta += JSON.stringify(doc.id) + ":" + reclamacao;
        possuiOcorrencia = true;
      }
      contador++;
    });
    resposta = "{" + resposta + "}";
    if (possuiOcorrencia) {
      res.status(200).send(JSON.parse(resposta));
    } else {
      res.status(201).send();
    }
  } catch (err) {
    res.status(500);
  }
});


//verificar se o login e senha batem com algum valor já existente no banco de dados, retorna true caso encontre algo e false caso não encontre
app.get("/login/:cpf/:senha", async (req, res) => {
  try {
    const { cpf, senha } = req.params;
    const contaRef = db.collection("contas");
    const snapshot = await contaRef
      .where("cpf", "==", cpf)
      .where("senha", "==", senha)
      .get();
    if (snapshot.empty) {
      return res.send(false);
    }
    return res.send(true);
  } catch (err) {
    res.status(500);
  }
});

//verificar se o id existe
app.get("/verficarExistencia/ocorrencia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ocorrenciaRef = db.collection("ocorrencias").doc(`${id}`);
    const doc = await ocorrenciaRef.get();
    if (!doc.exists) {
      return res.send(false);
    }
    return res.send(true);
  } catch (err) {
    res.status(500);
  }
});

//verificar o histórico de requisições do usuário
app.get("/hitoricoReq/:cpf", async (req, res) => {
  try {
    let ocorrencias = "[";
    let contador = 0;
    const { cpf } = req.params;
    const contaRef = db.collection("ocorrencias");
    const snapshot = await contaRef.where("cpf", "==", cpf).get();
    if (snapshot.empty) {
      return res.send(false);
    }

    snapshot.forEach((doc) => {
      if (contador > 0) ocorrencias += ",";
      ocorrencias += JSON.stringify(doc.data());
      contador++;
    });
    ocorrencias += "]";

    return res.send(JSON.parse(ocorrencias));
  } catch (err) {
    res.status(500);
  }
});

//procurar uma requisição pelo id
app.get("/pegar/ocorrencia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ocorrenciaRef = db.collection("ocorrencias").doc(`${id}`);
    const doc = await ocorrenciaRef.get();
    if (!doc.exists) {
      return res.send(false);
    }
    return res.status(200).send(doc.data());
  } catch (err) {
    res.status(500);
  }
});

//procurar uma conta pelo cpf
app.get("/pegar/conta/:cpf", async (req, res) => {
  try {
    const { cpf } = req.params;
    const contaRef = db.collection("contas").doc(`${cpf}`);
    const doc = await contaRef.get();
    if (!doc.exists) {
      return res.send(false);
    }
    return res.status(200).send(doc.data());
  } catch (err) {
    res.status(500);
  }
});

//procura numa ocorrencia de id, um cpf no upvote e no downvote, se n tiver nada, retorna nada, se tiver no upvote retorna upvote, se tiver no downvote retorna downvote
app.get('/pegar/vote/:id/:cpf', async (req, res) => {
  try {
    const { id, cpf } = req.params;
    const ocorrenciaRef = db.collection("ocorrencias").doc(`${id}`);
    const doc = await ocorrenciaRef.get();
    let TemUpvote = false;
    let TemDownvote = false;
    const ocorrencia = doc.data();
    let upvote = ocorrencia.upvote;
    let downvote = ocorrencia.downvote;
    for (i = 0; i < upvote.length; i++) {
      if (upvote[i] == cpf) {
        TemUpvote = true;
        break;
      }
    } for (i = 0; i < downvote.length; i++) {
      if (downvote[i] == cpf) {
        TemDownvote = true;
        break;
      }
    }
    if (!TemDownvote && !TemUpvote) {
      res.status(200).send("nada")
    } else if (TemDownvote) {
      res.status(200).send('downvote')
    } else if (TemUpvote) {
      res.status(200).send('upvote')
    }
  } catch (error) {
    res.status(500);
  }
})


//adicionar uma ocorrencia no banco de dados
app.post(
  "/addOcorrencia",
  multer.single("imagem"),
  uploadImage,
  async (req, res) => {
    try {
      const { ocorrencia, longitude, latitude, Endereco, descricao, cpf } =
        req.body;
      let id;
      let idExistente = true;
      const imagem = req.file.firebaseUrl;
      const ocorrenciaRef = db.collection("ocorrencias");
      while (idExistente) {
        id = Math.floor(Math.random() * 1000000000) + 1;
        const doc = await ocorrenciaRef.doc(`${id}`).get();
        if (!doc.exists) {
          idExistente = false;
        }
      }
      const ocorrenciaRef2 = ocorrenciaRef.doc(`${id}`);
      const res2 = await ocorrenciaRef2.set(
        {
          id: id,
          ocorrencia: ocorrencia,
          latitude: latitude,
          longitude: longitude,
          Endereco: Endereco,
          cpf: cpf,
          descricao: descricao,
          status: "Solicitada",
          imagem: imagem,
          upvote: [],
          downvote: []
        },
        { merge: true }
      );
      res.status(200).send("ocorrencia criada");
    } catch (err) {
      res.status(500);
    }
  }
);

//adicionar uma conta no banco de dados
app.post(
  "/addConta",
  multer.single("imagem"),
  uploadImage,
  async (req, res) => {
    try {
      let c1 = false;
      let c2 = false;
      const { email, senha, user, cpf } = req.body;
      const imagem = req.file.firebaseUrl;
      const contaRef2 = db.collection("contas");
      const doc = await contaRef2.doc(`${cpf}`).get();
      if (doc.exists) {
        c1 = true;
      }
      const snapshot = await contaRef2.where("email", "==", email).get();
      if (!snapshot.empty) {
        c2 = true;
      }
      if (!c1 && !c2) {
        const contaRef = db.collection("contas").doc(`${cpf}`);
        const res2 = await contaRef.set(
          {
            email: email,
            senha: senha,
            user: user,
            cpf: cpf,
            adm: false,
            imagem: imagem,
          },
          { merge: true }
        );
        res.status(200).send(true);
      }
      res.status(201).send(false);
    } catch (err) {
      res.status(500);
    }
  }
);

//alterar o status de uma ocorrência
app.put("/alterar/status", async (req, res) => {
  try {
    const { cpf, id, status } = req.body;
    let adm = false;
    const doc = await db.collection("contas").doc(`${cpf}`).get();
    if (doc.exists) {
      adm = doc.data().adm;
    } else {
      adm = false;
    }
    if (adm != false) {
      const ocorrenciaRef = db.collection("ocorrencias").doc(`${id}`);
      const res2 = await ocorrenciaRef.set(
        {
          status: status,
        },
        { merge: true }
      );
      res.status(200).send("ocorrencia alterada");
    } else {
      res.status(200).send("status não alterado");
    }
  } catch (err) {
    res.status(500);
  }
});


//alterar o upvote ou downvote de acordo com a operação
app.put('/vote/requisicao', async (req, res) => {
  try {
    const { operacao, cpf, id, votou } = req.body
    const ocorrenciaRef = db.collection("ocorrencias").doc(`${id}`);
    if (operacao == "upvote" && votou == false) {
      const res1 = await ocorrenciaRef.update(
        {
          upvote: FieldValue.arrayUnion(cpf),
        },
        { merge: true }
      );
      const res2 = await ocorrenciaRef.update(
        {
          downvote: FieldValue.arrayRemove(cpf),
        },
        { merge: true }
      );
      res.status(200).send("upvote adicionado");
    } else if (operacao == "downvote" && votou == false) {
      const res1 = await ocorrenciaRef.update(
        {
          downvote: FieldValue.arrayUnion(cpf),
        },
        { merge: true }
      );
      const res2 = await ocorrenciaRef.update(
        {
          upvote: FieldValue.arrayRemove(cpf),
        },
        { merge: true }
      );
      res.status(200).send("downvote adicionado");
    } else if (operacao == "upvote" && votou == true) {
      const res2 = await ocorrenciaRef.update(
        {
          upvote: FieldValue.arrayRemove(cpf),
        },
        { merge: true }
      );
      res.status(200).send("upvote deletado");
    } else if (operacao == "downvote" && votou == true) {
      const res2 = await ocorrenciaRef.update(
        {
          downvote: FieldValue.arrayRemove(cpf),
        },
        { merge: true }
      );
      res.status(200).send("downvote deletado");
    }

  } catch (e) {
    res.status(500)
  }
})




//deletar uma ocorrência no banco de dados
app.delete("/ocorrencia", async (req, res) => {
  try {
    const { id } = req.body;
    const cidadeRef = db.collection("ocorrencias").doc(`${id}`);
    await cidadeRef.delete();
    res.status(200).send("ocorrencia deletada");
  } catch (err) {
    res.status(500);
  }
});

//inicializando o server na porta 5000
app.listen(port, () => console.log(`Server foi iniciado na porta: ${port}`));

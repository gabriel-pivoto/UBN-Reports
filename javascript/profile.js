const req = new XMLHttpRequest();
const isLoggedIn = localStorage.getItem("isLoggedIn");
const userCPF = localStorage.getItem("userCPF");
const senha = localStorage.getItem("userCPF");
const statusRequisições = [
  "Solicitada",
  "Em Analise",
  "Em Progresso",
  "Finalizada",
];
let numeroStatusRequisições = [0, 0, 0, 0];
let contador1 = 0;

function historicodereq() {
  if (!isLoggedIn || !userCPF) {
    alert("Favor entrar antes de buscar ocorrências!");
    return;
  }

  req.open("GET", "http://localhost:5000/hitoricoReq/" + userCPF);
  req.setRequestHeader("Content-type", "application/json");

  // Manipulação do retorno da requisição
  req.onload = function () {
    if (req.status === 200) {
      const responseObj = JSON.parse(req.response);

      console.log(responseObj);
      if (JSON.parse(req.response)) {
        criarBotoes(responseObj);
      }
      perfil();
    } else {
      console.log("Erro na requisição. Código de status:", req.status);
      alert("Preencha todos os campos corretamente!");
    }
  };
  req.send();
}

function criarBotoes(responseObj) {
  // Obtém a div onde os botões serão criados
  const botaoContainer = document.getElementById("botaoContainer");

  // Limpa o conteúdo da div, caso já existam botões criados anteriormente
  botaoContainer.innerHTML = "";

  // Itera sobre o array de elementos
  responseObj.forEach((elemento, index) => {
    contador1 += 1;
    const contadorreq = document.getElementById("contador");
    contadorreq.textContent = contador1;

    if (elemento.status == "Solicitada") {
      numeroStatusRequisições[0] += 1;
    } else if (elemento.status == "Em Analise") {
      numeroStatusRequisições[1] += 1;
    } else if (elemento.status == "Em Progresso") {
      numeroStatusRequisições[2] += 1;
    } else if (elemento.status == "Finalizada") {
      numeroStatusRequisições[3] += 1;
    }

    // Cria um elemento de botão
    const botao = document.createElement("button");

    // Define um ID único para o botão (opcional, mas pode ser útil para manipulação futura)
    botao.id = `botao-${index}`;

    // Define o texto do botão como o elemento atual do array
    botao.innerText = elemento.ocorrencia;
    botao.style.display = 'flex';
    botao.style.justifyContent = 'center';
    botao.style.alignItems = 'center';

const statusElement = document.createElement('span');
statusElement.innerText = elemento.status;
statusElement.style.marginLeft = 'auto';

botao.appendChild(statusElement);

    // Adiciona um evento de clique ao botão (opcional, você pode adicionar outras ações aqui)
    botao.addEventListener("click", () => {
      let ocorrenciareq = document.getElementById("ocorrencia-dialog");
      ocorrenciareq.textContent = elemento.ocorrencia;

      let enderecoreq = document.getElementById("endereco-dialog");
      enderecoreq.textContent = elemento.Endereco;

      console.log(elemento);

      let lngreq = document.getElementById("descricao-dialog");
      lngreq.textContent = elemento.descricao;
      if(lngreq.textContent == ""){
        document.getElementById("descricao-dialog").style.display = "none";
        document.getElementById("descricao").style.display = "none";
        
      }
     

      let status = document.getElementById("status-dialog");
      status.textContent = elemento.status;

      let imagem = document.getElementById("imagem");
      imagem.setAttribute("src", elemento.imagem);
      const dialog = document.getElementById("problema");
      dialog.showModal();
    });

    // Adiciona o botão à div de botões
    botaoContainer.appendChild(botao);
  });
}

// Chama a função perfil() quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", historicodereq);

function Fechar() {
  const dialog = document.getElementById("problema");
  dialog.close();
}

function perfil() {
  const requisicao = new XMLHttpRequest();
  requisicao.open("GET", "http://localhost:5000/pegar/conta/" + userCPF);
  requisicao.setRequestHeader("Content-type", "application/json");

  // Manipulação do retorno da requisição
  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);
      console.log(responseObj.imagem);

      const nome = document.getElementById("nome");
      nome.textContent = responseObj.user;

      const email = document.getElementById("email");
      email.textContent = responseObj.email;

      const cpf = document.getElementById("cpf");
      cpf.textContent = responseObj.cpf;

      // const Adm = document.getElementById("adm");
      // Adm.textContent = responseObj.adm;

      var img = document.getElementById("imagemPerfil");
      img.setAttribute("src", responseObj.imagem);
      var img2 = document.getElementById("imagemPerfil2");
      img2.setAttribute("src", responseObj.imagem);
      var barColors = ["#b91d47", "#00aba9", "#2b5797", "#2C4728"];

      new Chart("myChart", {
        type: "pie",
        data: {
          labels: statusRequisições,
          datasets: [
            {
              backgroundColor: barColors,
              data: numeroStatusRequisições,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: "Suas Requisições",
            fontColor: "Black",
          },
          legend: {
            display: true,
            position: "left", // Places the legend to the left of the chart
            labels: {
              
              fontColor: "Black", // Sets the color of the legend text to blue
            },
          },
          scales: {
            x: {
              display: false, // Hides the x-axis
            },
            y: {
              display: false, // Hides the y-axis
            },
          },
          
        },
      });
    } else {
      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };
  requisicao.send();
}

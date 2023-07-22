const req = new XMLHttpRequest();
const isLoggedIn = localStorage.getItem("isLoggedIn");
const userCPF = localStorage.getItem("userCPF");

function perfil() {
    console.log("CPF: " + userCPF);
    console.log("Está logado: " + isLoggedIn);
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
            console.log(responseObj[1].Endereco);
            criarBotoes(responseObj);
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
        // Cria um elemento de botão
        const botao = document.createElement("button");

        // Define um ID único para o botão (opcional, mas pode ser útil para manipulação futura)
        botao.id = `botao-${index}`;

        // Define o texto do botão como o elemento atual do array
        botao.innerText = elemento.ocorrencia;

        // Adiciona um evento de clique ao botão (opcional, você pode adicionar outras ações aqui)
        botao.addEventListener("click", () => {
            let ocorrenciareq = document.getElementById("ocorrencia-dialog");
            ocorrenciareq.textContent = elemento.ocorrencia;

            let enderecoreq = document.getElementById("endereco-dialog");
            enderecoreq.textContent = elemento.Endereco;

            let latreq = document.getElementById("lat-dialog");
            latreq.textContent = elemento.latitude;

            let lngreq= document.getElementById("lng-dialog");
            lngreq.textContent = elemento.longitude;

            let statusreq = document.getElementById("status-dialog");
            statusreq.textContent = "Em breve!";
            statusreq.style.color = "rgb(0,0,255)";



            const dialog = document.querySelector("dialog");
            dialog.showModal();
        });

        // Adiciona o botão à div de botões
        botaoContainer.appendChild(botao);
    });
}

// Chama a função perfil() quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", perfil);

function Fechar(){
    const dialog = document.querySelector("dialog");
            dialog.close();
}
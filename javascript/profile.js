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
            console.log(responseObj + "a");
        } else {
            console.log("Erro na requisição. Código de status:", req.status);
            alert("Preencha todos os campos corretamente!");
        }
    };
    req.send();
}
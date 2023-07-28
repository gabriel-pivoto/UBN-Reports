const req = new XMLHttpRequest();
const isLoggedIn = localStorage.getItem("isLoggedIn");
const userCPF = localStorage.getItem("userCPF");
const senha = localStorage.getItem("userCPF");
pegarFotodePerfilAboutUs();

console.log(userCPF);
function pegarFotodePerfilAboutUs() {
    const requisicao = new XMLHttpRequest();
    const userCPF = localStorage.getItem("userCPF");
    console.log("a"+userCPF);
    requisicao.open("GET", "http://localhost:5000/pegar/conta/" + userCPF);
  
    requisicao.setRequestHeader("Content-type", "application/json");
  
    // Manipulação do retorno da requisição
    requisicao.onload = function () {
      if (requisicao.status === 200) {
        const responseObj = JSON.parse(requisicao.response);
        console.log(responseObj.imagem);
        var img = document.getElementById("imagemPerfil");
        if (responseObj.imagem != undefined) {

          img.setAttribute("src", responseObj.imagem);
        }
      } else {
        console.log("Erro na requisição. Código de status:", requisicao.status);
      }
    };
    requisicao.send();
  }


  function logInAboutUs() {
    Entrou = false;
    cpf = "";
    const requisicao = new XMLHttpRequest();
    requisicao.open(
      "GET",
      "http://localhost:5000/login/" +
        document.getElementById("cpfLogin").value +
        "/" +
        document.getElementById("senhalogin").value
    );
    requisicao.setRequestHeader("Content-type", "application/json");
  
    // Manipulação do retorno da requisição
    requisicao.onload = function () {
        console.log("pinto");
      if (requisicao.status === 200) {
        const responseObj = JSON.parse(requisicao.response);
        Entrou = responseObj;
        if (Entrou) {
          cpf = document.getElementById("cpfLogin").value;
          
          const dialogLogin = document.getElementById("LogIn");
          dialogLogin.close();
          pegarFotodePerfilAboutUs();
  
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userCPF", cpf);
          localStorage.setItem(
            "senhaPerfil",
            document.getElementById("senhalogin").value
          );

            location.reload();
        } else {
          alert("CPF ou senha incorretos");
        }
      } else {
        console.log("Erro na requisição. Código de status:", requisicao.status);
        alert("Preencha todos os campos corretamente!");
      }
    };
    requisicao.send();
  }
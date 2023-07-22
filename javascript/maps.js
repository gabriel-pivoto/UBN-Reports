// Criação de uma instância XMLHttpRequest para realizar requisições HTTP
const requisicao = new XMLHttpRequest();

// Declaração de variáveis globais
let map;
let markers;
let geocoder;
let responseDiv;
let response;
var novarequisicao = false;
let cpf = "";
let Entrou = false;

// Função de inicialização do mapa
function initMap() {
  // Criação do objeto de mapa do Google Maps
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: -22.26, lng: -45.71 },
    mapTypeControl: false,
    fullscreenControl: false,
  });

  // Inicialização do geocoder do Google Maps para conversão entre coordenadas e endereços
  geocoder = new google.maps.Geocoder();

  // Criação dos elementos HTML para interação com o mapa
  const modal = document.querySelector("dialog");
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter a location";

  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("button", "button-primary");

  const createRequest = document.createElement("input");
  createRequest.type = "button";
  createRequest.value = "New Request";
  createRequest.classList.add("button", "button-third");

  const botaopegar = document.createElement("input");
  botaopegar.type = "button";
  botaopegar.value = "Pegar";
  botaopegar.classList.add("button", "button-third");

  const cancelar = document.getElementById("cancelar");

  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";
  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  const instructionsElement = document.createElement("p");
  instructionsElement.id = "instructions";
  instructionsElement.innerHTML =
    "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";

  // Adiciona os elementos ao mapa
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(createRequest);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(botaopegar);

  // Evento de clique no mapa para realizar uma requisição de geocodificação reversa
  map.addListener("click", (e) => {
    if (novarequisicao == true) {
      geocode({ location: e.latLng });
      novarequisicao = false;

      modal.showModal();
    }
  });

  // Evento de clique no botão de "Geocode" para realizar uma requisição de geocodificação
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );


  // Evento de clique no botão "New Request" para criar uma nova requisição de geocodificação
  createRequest.addEventListener("click", () => {
    newrequest();
  });

  // Evento de clique no botão "Cancelar" para fechar o modal de confirmação
  cancelar.addEventListener("click", () => {
    cancel();
  });


  confirmarCadastro.addEventListener("click", () => {
    ConfirmarCadastroFunc();
  })

  // Evento de clique no botão "Pegar" para buscar as ocorrências do servidor
  botaopegar.addEventListener("click", () => {
    pegar();
  });

  // Limpa o marcador do mapa inicialmente
  pegar();

}

// Função para enviar a ocorrência para o servidor
function Confirm() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userCPF = localStorage.getItem("userCPF");
  if (!isLoggedIn || !userCPF) {
    alert("Favor entrar antes de buscar ocorrências!");
    return;
  }
  cpf = userCPF;
<<<<<<< HEAD
  console.log(cpf);
  if (cpf != "") {
    // Criação da requisição POST para adicionar a ocorrência
    requisicao.open("POST", "http://localhost:5000/addOcorrencia", true);
    requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");

    // Envio dos dados da ocorrência como um objeto JSON no corpo da requisição
    requisicao.send(JSON.stringify({
      "id": Math.floor(Math.random() * 1000000) + 1,
      "ocorrencia": document.getElementById("problem").value,
      "latitude": document.getElementById("lat").value,
      "longitude": document.getElementById("lng").value,
      "Endereco": document.getElementById("addres").value,
      "cpf": cpf
    }));
=======
  if(cpf != ""){
// Criação da requisição POST para adicionar a ocorrência
requisicao.open("POST", "http://localhost:5000/addOcorrencia", true);
requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");

// Envio dos dados da ocorrência como um objeto JSON no corpo da requisição
requisicao.send(JSON.stringify({
  "ocorrencia": document.getElementById("problem").value,
  "latitude": document.getElementById("lat").value,
  "longitude": document.getElementById("lng").value,
  "Endereco": document.getElementById("addres").value,
  "cpf": cpf
}));
>>>>>>> 00fa36e57ca27cefa291d7f042db7b818c68d9f8

    // Fechar o modal de confirmação
    const modal = document.querySelector("dialog");
    modal.close();
  } else {
    alert("Favor entrar antes de cadastar um novo problema!");

  }
<<<<<<< HEAD
  pegar();

=======

  requisicao.onload=(()=>{
    pegar()
  })
>>>>>>> 00fa36e57ca27cefa291d7f042db7b818c68d9f8

}

// Função para pegar uma ocorrência do servidor
function PegarUmaOcorrencia(id) {
  // Criação da requisição GET para buscar uma ocorrência específica
  requisicao.open("GET", "http://localhost:5000/pegar/ocorrencia/" + id);
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");

  // Manipulação do retorno da requisição
  requisicao.onload = function teste() {
    let ocorrencia = JSON.parse(requisicao.response);

    let position = new google.maps.LatLng(ocorrencia.latitude, ocorrencia.longitude);
    contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">' + ocorrencia.ocorrencia + '</h1>' +
      '<div id="bodyContent">' +
      "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
      "sandstone rock formation in the southern part of the " +
      "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
      "south west of the nearest large town, Alice Springs; 450&#160;km " +
      "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
      "features of the Uluru - Kata Tjuta National Park. Uluru is " +
      "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
      "Aboriginal people of the area. It has many springs, waterholes, " +
      "rock caves and ancient paintings. Uluru is listed as a World " +
      "Heritage Site.</p>" +
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
      "(last visited June 22, 2009).</p>" +
      "</div>" +
      "</div>";

    // Criação de uma infowindow do Google Maps para exibir informações da ocorrência
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      position: position,
      ariaLabel: ocorrencia.ocorrencia,
    });

    // Abre a infowindow no mapa
    infowindow.open({
      map
    });
  }

  // Envio da requisição
  requisicao.send();
}

// Função para cancelar a adição da ocorrência
function cancel() {
  const modal = document.querySelector("dialog");
  const dialogLogin = document.getElementById("LogIn");
  const dialogregister = document.getElementById("register");
  dialogregister.close();
  dialogLogin.close();
  modal.close();
}




// Função para criar uma nova requisição de geocodificação
function newrequest() {


  novarequisicao = true;
}

// Função para buscar as ocorrências do servidor
function pegar() {



  // Criação da requisição GET para buscar as ocorrências
  const requisicao = new XMLHttpRequest();
  requisicao.open("GET", "http://localhost:5000/ocorrencias");
  requisicao.setRequestHeader("Content-type", "application/json");

  // Manipulação do retorno da requisição
  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);

      for (let key in responseObj) {
        const value = responseObj[key];
        const endereco = value.Endereco;
        const latitude = value.latitude;
        const longitude = value.longitude;
        const ocorrencia = value.ocorrencia;

        let posicao = new google.maps.LatLng(latitude, longitude);

        // Chamada da função marcador para criar um marcador no mapa para cada ocorrência
        marcador(endereco, posicao, ocorrencia, key);
      }
    } else {
      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };

  // Envio da requisição
  requisicao.send();
}

// Função para criar um marcador no mapa
function marcador(endereco, posicao, ocorrencia, id) {
  markers = new google.maps.Marker({
    position: posicao,
    map: map,
    title: ocorrencia,
    id: id
  });

  // Evento de clique no marcador para exibir detalhes da ocorrência
  markers.addListener("click", () => {
    PegarUmaOcorrencia(id);
  });
}

// Função para realizar a geocodificação de um endereço ou coordenadas
function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      response.innerText = JSON.stringify(result, null, 2);

      const data = {
        address: results[0].formatted_address,
        location: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        },
      };

      // Preenchimento dos campos de formulário com os dados da geocodificação
      document.getElementById("addres").value = data.address;
      document.getElementById("problem").value = "Insira seu problema aqui";
      document.getElementById("lat").value = data.location.lat;
      document.getElementById("lng").value = data.location.lng;
    });
}

// Evento de carregamento do DOM para adicionar a funcionalidade de abrir/fechar o menu da navbar
document.addEventListener('DOMContentLoaded', function () {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.links');

  navbarToggle.addEventListener('click', function () {
    links.classList.toggle('active');
  });
});



// função para abrir o dialog do login

function login() {
  const dialogLogin = document.getElementById("LogIn");
  dialogLogin.showModal();
}
function register() {
  const dialogLogin = document.getElementById("register");
  dialogLogin.showModal();
}





<<<<<<< HEAD
function ConfirmarCadastroFunc() {
=======
 function ConfirmarCadastroFunc() {
>>>>>>> 00fa36e57ca27cefa291d7f042db7b818c68d9f8

  console.log("sdds dela");

  requisicao.open("POST", "http://localhost:5000/addConta", true);
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");

  // Envio dos dados da ocorrência como um objeto JSON no corpo da requisição
  requisicao.send(JSON.stringify({
    "email": document.getElementById("email").value,
    "senha": document.getElementById("senha").value,
    "user": document.getElementById("name").value,
    "cpf": document.getElementById("cdu").value,
    "adm": false
  }))

  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = requisicao.response;

      Contaexistente = responseObj;
      return Contaexistente;
    } else {
      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  }

  if (Contaexistente) {
    const dialogLogin = document.getElementById("register");
    dialogLogin.close();
    alert("Conta criada!");
  }
  else {
    alert("Conta já existente!");
  }


}


function logIn() {
  Entrou = false;
  cpf = "";
  const requisicao = new XMLHttpRequest();
  requisicao.open("GET", "http://localhost:5000/login/" + document.getElementById("cpfLogin").value + "/" + document.getElementById("senhalogin").value);
  requisicao.setRequestHeader("Content-type", "application/json");

  // Manipulação do retorno da requisição
  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);
      Entrou = responseObj;
      if (Entrou) {
        cpf = document.getElementById("cpfLogin").value;
        const dialogLogin = document.getElementById("LogIn");
        dialogLogin.close();


<<<<<<< HEAD
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userCPF", cpf);
        const userCPF = localStorage.getItem("userCPF");
        console.log(userCPF);

      } else {
        alert("CPF ou senha incorretos");
=======
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userCPF", cpf);
          const userCPF = localStorage.getItem("userCPF");
     
      }else{
          alert("CPF ou senha incorretos");
>>>>>>> 00fa36e57ca27cefa291d7f042db7b818c68d9f8
      }

    } else {
      console.log("Erro na requisição. Código de status:", requisicao.status);
      alert("Preencha todos os campos corretamente!");
    }
  }
  requisicao.send();
}



// Envio da requisição

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userCPF");
  // Resto do código para redirecionar para a página de login ou atualizar a página
}
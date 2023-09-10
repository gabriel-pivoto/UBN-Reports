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
let Contaexistente;
let latInitial = -42.26;
let lngInitial = -35.71;
let upvoteSwap = false;
let downvoteSwap = false;
let contador = 0;
let latTemporaria=0;
let lngTemporaria=0;

// Função de inicialização do mapa
const styles = {
  default: [],
  hide: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }

  // Criação do objeto de mapa do Google Maps
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: latInitial, lng: lngInitial },
    mapTypeControl: false,
    fullscreenControl: false,
    styles: styles["hide"]
  });

  
  // Inicialização do geocoder do Google Maps para conversão entre coordenadas e endereços
  geocoder = new google.maps.Geocoder();
  
  // Criação dos elementos HTML para interação com o mapa
  const modal = document.querySelector("dialog");
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Entre com uma localização";

  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Pesquisar";
  submitButton.classList.add("button", "button-primary");

  const createRequest = document.createElement("input");
  createRequest.type = "button";
  createRequest.value = "Nova Requisição";
  createRequest.classList.add("button", "button-third");


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

  // Evento de clique no mapa para realizar uma requisição de geocodificação reversa
  map.addListener("click", (e) => {
    if (novarequisicao == true) {
      geocode({ location: e.latLng });
      novarequisicao = false;

      modal.showModal();
      form=document.getElementById("formularioOcorrencia")
      function submitForm(event){
        //Preventing page refresh
        event.preventDefault();
        Confirm()
     }
     form.addEventListener('submit', submitForm);
    }
  });

  // Evento de clique no botão de "Geocode" para realizar uma requisição de geocodificação
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );

  ocorrencia.addEventListener("click", () =>{

    
    console.log(document.getElementById("ocorrencia").value == "outros");
    document.getElementById("descricao").setAttribute("required","required");
    document.getElementById("pdescricao").removeAttribute("hidden");
    document.getElementById("descricao").removeAttribute("hidden");
   
    if(document.getElementById("ocorrencia").value != "outros"){
     document.getElementById("pdescricao").setAttribute("hidden", "hidden");
     document.getElementById("descricao").setAttribute("hidden", "hidden");
     document.getElementById("pdescricao").removeAttribute("required");
     document.getElementById("descricao").removeAttribute("required");
    }

  });

  // Evento de clique no botão "New Request" para criar uma nova requisição de geocodificação
  createRequest.addEventListener("click", () => {
    newrequest();
  });


  // Limpa o marcador do mapa inicialmente
  pegar();
  pegarFotodePerfil();
}

// Função para enviar a ocorrência para o servidor
function Confirm() {
  let formulario = new FormData(
    document.getElementById("formularioOcorrencia")
  );
  let imagem = document.getElementById("imagemOcorrencia").files[0];

  formulario.set(
    "imagem",
    new File([imagem], "nome.jpeg", { type: "image/jpeg" })
  );

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userCPF = localStorage.getItem("userCPF");
  if (!isLoggedIn || !userCPF) {
    alert("Favor entrar antes de buscar ocorrências!");
    return;
  }
  cpf = userCPF;
  formulario.set("cpf", cpf);
  if (cpf != "") {
    // Criação da requisição POST para adicionar a ocorrência
    requisicao.open("POST", "http://localhost:5000/addOcorrencia", true);

    // Envio dos dados da ocorrência como um objeto JSON no corpo da requisição
    requisicao.send(formulario);

    // Fechar o modal de confirmação
    const modal = document.querySelector("dialog");
    modal.close();
  } else {
    alert("Favor entrar antes de cadastar um novo problema!");
  }

  requisicao.onload = () => {
    pegar();
  };
}

// Função para pegar uma ocorrência do servidor
async function PegarUmaOcorrencia(id) {
  // Criação da requisição GET para buscar uma ocorrência específica
  requisicao.open("GET", "http://localhost:5000/pegar/ocorrencia/" + id);
  requisicao.setRequestHeader(
    "Content-type",
    "application/json",
    "Access-Control-Allow-Origin"
  );
  const userCPF = localStorage.getItem("userCPF");
  // Manipulação do retorno da requisição
  requisicao.onload = function teste() {
    let ocorrencia = JSON.parse(requisicao.response);
    let x = ocorrencia.imagem;

    let position = new google.maps.LatLng(
      ocorrencia.latitude,
      ocorrencia.longitude
    );
    let TemUpvote = false;
    let TemDownvote = false;
    let upvote = ocorrencia.upvote;
    let downvote = ocorrencia.downvote;
    for (i = 0; i < upvote.length; i++) {
      if (upvote[i] == userCPF) {
        TemUpvote = true;
        break;
      }
    } for (i = 0; i < downvote.length; i++) {
      if (downvote[i] == userCPF) {
        TemDownvote = true;
        break;
      }
    }
    downvoteSwap = TemDownvote;
    upvoteSwap = TemUpvote;
    contadorUpvote = 0;
    contadorDownvote = 0;
    contentString =
      '<div id="content">' +
      '<div id="siteNotice"></div>'+
      '<h1 id="firstHeading" class="firstHeading">' + ocorrencia.ocorrencia + "</h1>" +
      '<div id="bodyContent">' +
      "<p style='max-width: 300px; word-wrap: break-word;'> " + ocorrencia.descricao + "</p>" +
      "<p style='max-width: 300px; word-wrap: break-word;'> " + ocorrencia.Endereco + "</p>" +
      '<img width="200" height="200" src=' + ocorrencia.imagem + ' alt="">' +
      "<p> Status: " + ocorrencia.status + " </p>" +
      '<pre style="word-wrap: break-word;">'+  
      '<img width="25" height="25" src="' + Upvote(TemUpvote) + '" id="'+ocorrencia.id+'upvote"  onclick="TrocarUpvote(' + `'${userCPF}'` + "," + ocorrencia.id + "," + `'${Upvote(TemUpvote)}'` + ') "alt="upvote">' +
       '  ' + 
      '<img width="25" height="25" src="' + Downvote(TemDownvote) + '"  id="'+ocorrencia.id+'downvote"  onclick="TrocarDownvote(' + `'${userCPF}'` + "," + ocorrencia.id + "," + `'${Downvote(TemDownvote)}'` + ')" alt="downvote">' +
      '                     '+
      '<a href="mailto:? &subject=' + ocorrencia.ocorrencia + "&body=Descrição: " + ocorrencia.descricao + "%0AStatus: " + ocorrencia.status + " %0ALink para a imagem: " + ocorrencia.imagem + '">' +
      '<img width="25" height="25" src="../images/mail-outline.svg" alt="">' +
      "</a>" +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + ocorrencia.imagem + ' "target="_blank">' +
      '<img width="25" height="25" src="../images/logo-facebook.svg" alt="">' +
      "</a>" +
      '<a href="https://api.whatsapp.com/send?text= Ocorrência: ' + ocorrencia.ocorrencia + "%0ADescrição: " + ocorrencia.descricao + "%0AEndereço: " + ocorrencia.Endereco + "%0AStatus: " + ocorrencia.status + "%0AImagem: " + ocorrencia.imagem + '" >' +
      '<img width="25" height="25" src="../images/logo-whatsapp.svg" alt="">' +
      "</a>" +
      '</pre>'+
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
      map,
    });

  };

  // Envio da requisição
  requisicao.send();
}

// Função para cancelar a adição da ocorrência
function cancel() {
 
  const dialogLogin = document.getElementById("LogIn");
  const dialogregister = document.getElementById("register");
  
  if (dialogLogin != null) {
    dialogLogin.close();
  }
  if (dialogregister != null) {
    dialogregister.close();
    const fileInput = document.getElementById('imagemPreview2');
  fileInput.src = "../images/cloud-upload.svg";
  fileInput.width = 30;
  fileInput.height = 30;
  }
  const modal = document.getElementById("nrequisicao");

  if (modal != null) {
    const fileInput = document.getElementById('imagemPreview');
  fileInput.src = "../images/cloud-upload.svg";
  fileInput.width = 30;
  fileInput.height = 30;
    modal.close();
  }
}

// Função para criar uma nova requisição de geocodificação
function newrequest() {
  const userCPF = localStorage.getItem("userCPF");
  if (userCPF != null) {
    novarequisicao = true;
  } else {
    alert("Favor entrar com sua conta!");
    const dialogLogin = document.getElementById("LogIn");
    dialogLogin.showModal();
  }
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
async function marcador(endereco, posicao, ocorrencia, id) {
  const imagem = await selecionaImagem(ocorrencia);

  const markerIcon = {
    url: imagem,
    scaledSize: new google.maps.Size(30, 30), // Defina o tamanho do ícone aqui
  };

  const marker = new google.maps.Marker({
    position: posicao,
    map: map,
    title: ocorrencia,
    id: id,
    icon: markerIcon,
  });

  // Evento de clique no marcador para exibir detalhes da ocorrência
  marker.addListener("click", () => {
    PegarUmaOcorrencia(id);
  });
}

async function selecionaImagem(ocorrencia) {
  let imagem;
  switch (ocorrencia) {
    

      case "buraco":
      imagem = '../images/buraco.png';
      break;

      case "lixo":
      imagem = '../images/lixo.png';
      break;

      case "energia":
      imagem = '../images/energia.png';
      break;

      case "poste":
      imagem = '../images/poste.png';
      break;

    default:
      imagem = '../images/padrao.png';
      break;
  }
  return imagem;
}
// Função para realizar a geocodificação de um endereço ou coordenadas
function geocode(request) {
  latTemporaria=request.location.lat();
  lngTemporaria=request.location.lng();
  geocoder.geocode(request).then((result) => {
    const { results } = result;

    map.setCenter(results[0].geometry.location);
    response.innerText = JSON.stringify(result, null, 2);
    const data = {
      address: results[0].formatted_address,
      location: {
        lat: latTemporaria,
        lng: lngTemporaria,
      },
    };

    // Preenchimento dos campos de formulário com os dados da geocodificação
    document.getElementById("Endereco").value = data.address;
    document.getElementById("latitude").value = data.location.lat;
    document.getElementById("longitude").value = data.location.lng;
  });
}

// Evento de carregamento do DOM para adicionar a funcionalidade de abrir/fechar o menu da navbar
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggle = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".links");

  navbarToggle.addEventListener("click", function () {
    links.classList.toggle("active");
  });
});

// função para abrir o dialog do login

function login() {
  const dialogLogin = document.getElementById("LogIn");
  dialogLogin.showModal();
  form=document.getElementById("loginConta");
  function submitForm(event){
     //Preventing page refresh
     event.preventDefault();
     logIn()
  }
  form.addEventListener('submit', submitForm);
}
function register() {
  const dialogLogin = document.getElementById("register");
  dialogLogin.showModal();
  var form=document.getElementById("formulario");
function submitForm(event){
   //Preventing page refresh
   event.preventDefault();
   ConfirmarCadastroFunc()
}
form.addEventListener('submit', submitForm);
}

function ConfirmarCadastroFunc() {
  Contaexistente = false;
  var formulario = new FormData(document.getElementById("formulario"));
  requisicao.open("POST", "http://localhost:5000/addConta");

  let imagem = document.getElementById("imagem").files[0];

  formulario.set("imagem", new File([imagem], "nome", { type: "image/jpeg" }));

  requisicao.onload = function () {
    if (requisicao.status === 200) {
      ContaCriada();
    } else {
      ContaExistente();
      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };
  requisicao.send(formulario);

  function ContaCriada() {
    const dialogregister = document.getElementById("register");
    dialogregister.close();
    alert("Conta criada!");
  }
  function ContaExistente() {
    alert("Conta já existente!");
    const dialogregister = document.getElementById("register");
    dialogregister.close();
    const dialogLogin = document.getElementById("LogIn");
    dialogLogin.showModal();
  }
}

function logIn() {
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
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);
      Entrou = responseObj;
      if (Entrou) {
        cpf = document.getElementById("cpfLogin").value;
        pegarFotodePerfil();
        const dialogLogin = document.getElementById("LogIn");
        dialogLogin.close();

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

// Envio da requisição

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userCPF");
  localStorage.removeItem("senhaPerfil");
  location.reload();
  // Resto do código para redirecionar para a página de login ou atualizar a página
}

function pegarFotodePerfil() {
  const requisicao = new XMLHttpRequest();
  const userCPF = localStorage.getItem("userCPF");
  requisicao.open("GET", "http://localhost:5000/pegar/conta/" + userCPF);

  requisicao.setRequestHeader("Content-type", "application/json");

  // Manipulação do retorno da requisição
  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);

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

function PegarLocal() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
}
function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // Fazer uma chamada à API de Geocodificação Reversa
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(latitude, longitude);

  geocoder.geocode({location: latlng }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var address = results[0].formatted_address;
        document.getElementById("Endereco").value = address;
        document.getElementById("latitude").value = latitude;
        document.getElementById("longitude").value = longitude;

        // markers = new google.maps.Marker({
        //   position: latlng,
        //   map: map,
        // });
        map.setCenter(latlng);
      } else {
        alert("Endereço não encontrado para estas coordenadas.");
      }
    } else {
      alert("Erro na geocodificação reversa: " + status);
    }
  });
}

function handleError(error) {
  alert("Erro ao obter a localização: " + error.message);
}
// coloca a imagem do upvote de acordo com o parametro enviado
function Upvote(TemUpvote) {
  if (TemUpvote) {
    return "../images/like_green.svg";
  } else {
    return "../images/like.svg";
  }
}
// coloca a imagem do downvote de acordo com o parametro enviado
function Downvote(TemDownvote) {
  if (TemDownvote) {
    return "../images/dislike_red.svg";
  } else {
    return "../images/dislike.svg";
  }
}
//muda o downvote especifico de acordo com a opção anterior marcada
function TrocarUpvote(userCPF, id, votou) {
  if (contador == 0) {
    if (votou == "../images/like_green.svg") {
      votou = true;
    } else {
      votou = false;
    }
  } else {
    votou = upvoteSwap;
    upvoteSwap = !upvoteSwap
  }
  requisicao.open("PUT", "http://localhost:5000/vote/requisicao");
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");

  requisicao.onload = function () {
    if (requisicao.status === 200) {
      var x = document.getElementById(id+"upvote");
      x.setAttribute('src', `${Upvote(!votou)}`);
      document.getElementById(id+"downvote").setAttribute('src', '../images/dislike.svg');
      downvoteSwap = false;
    } else {

      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };
  requisicao.send(JSON.stringify({
    "operacao": "upvote",
    "cpf": `${userCPF}`,
    "id": id,
    "votou": votou
  }));
  contador++;
}
//muda o downvote especifico de acordo com a opção anterior marcada
function TrocarDownvote(userCPF, id, votou) {
  if (contador == 0) {
    if (votou == "../images/dislike_red.svg") {
      votou = true;
    } else {
      votou = false;
    }
  } else {
    votou = downvoteSwap;
    downvoteSwap = !downvoteSwap
  }
  requisicao.open("PUT", "http://localhost:5000/vote/requisicao");
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin");
  requisicao.onload = function () {
    if (requisicao.status === 200) {
      var x = document.getElementById(id+"downvote");
      x.setAttribute('src', `${Downvote(!votou)}`);
      document.getElementById(id+"upvote").setAttribute('src', '../images/like.svg');
      upvoteSwap = false;
    } else {

      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };
  requisicao.send(JSON.stringify({
    "operacao": "downvote",
    "cpf": `${userCPF}`,
    "id": id,
    "votou": votou
  }));
  contador++;
}
function previewImage() {
  const fileInput = document.getElementById('imagemOcorrencia');
  const previewImage = document.getElementById('imagemPreview');
  
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewImage.width = 100;
      previewImage.height = 100;
    }
    
    reader.readAsDataURL(file);
  }
}

function previewImage2() {
  const fileInput = document.getElementById('imagem');
  const previewImage = document.getElementById('imagemPreview2');
  
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewImage.width = 100;
      previewImage.height = 100;
    }
    
    reader.readAsDataURL(file);
  }
}



const requisicao = new XMLHttpRequest();

let map;
let marker;
let markers;
let geocoder;
let responseDiv;
let response;
var novarequisicao = false;


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: -22.26, lng: -45.71 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();


  const modal = document.querySelector("dialog");

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter a location";

  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("button", "button-primary");

  const clearButton = document.createElement("input");
  clearButton.type = "button";
  clearButton.value = "Clear";
  clearButton.classList.add("button", "button-secondary");

  const createRequest = document.createElement("input");
  createRequest.type = "button";
  createRequest.value = "New Request";
  createRequest.classList.add("button", "button-third");


  const botaopegar = document.createElement("input");
  botaopegar.type = "button";
  botaopegar.value = "Pegar";
  botaopegar.classList.add("button", "button-third");



  const cancelar = document.getElementById("cancelar");
  const confirmar = document.getElementById("confirmar");




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

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  // map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(createRequest);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(botaopegar);

  marker = new google.maps.Marker({
    map,
  });

  map.addListener("click", (e) => {
    if (novarequisicao == true) {
      geocode({ location: e.latLng });
      novarequisicao = false;

      modal.showModal();
    }
  });

  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );

  clearButton.addEventListener("click", () => {
    clear();
  });


  createRequest.addEventListener("click", () => {
    newrequest();
  });

  cancelar.addEventListener("click", () => {
    cancel();
  });

  confirmar.addEventListener("click", () => {
    Confirm();


  })

  botaopegar.addEventListener("click", () => {
    pegar();
  })



  clear();
}

function Confirm() {

  requisicao.open("POST", "http://localhost:5000/addOcorrencia", true)
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin")
  requisicao.send(JSON.stringify({
    "id": Math.floor(Math.random() * 1000000) + 1,
    "ocorrencia": document.getElementById("problem").value,
    "latitude": document.getElementById("lat").value,
    "longitude": document.getElementById("lng").value,
    "Endereco": document.getElementById("addres").value
  }))

  const modal = document.querySelector("dialog");
  modal.close();
}




function PegarUmaOcorrencia(id){
  requisicao.open("GET", "http://localhost:5000/pegar/ocorrencia/"+id)
  requisicao.setRequestHeader("Content-type", "application/json", "Access-Control-Allow-Origin")
  requisicao.onload = function teste() {
      console.log(requisicao.response)
  }
  requisicao.send();
}


function cancel() {
  const modal = document.querySelector("dialog");

  modal.close();
}

function clear() {
  marker.setMap(null);
}


function newrequest() {
  novarequisicao = true;
}

function pegar() {
  const requisicao = new XMLHttpRequest();

  requisicao.open("GET", "http://localhost:5000/ocorrencias");
  requisicao.setRequestHeader("Content-type", "application/json");

  requisicao.onload = function () {
    if (requisicao.status === 200) {
      const responseObj = JSON.parse(requisicao.response);

      for (let key in responseObj) {
        const value = responseObj[key];
        // Acessar os valores específicos dentro de cada objeto
        const endereco = value.Endereco;
        const latitude = value.latitude;
        const longitude = value.longitude;
        const ocorrencia = value.ocorrencia;

        let posicao = new google.maps.LatLng(latitude, longitude);

        


        marcador(endereco, posicao, ocorrencia, key);

      }
    } else {
      console.log("Erro na requisição. Código de status:", requisicao.status);
    }
  };

  requisicao.send();
}
function marcador(endereco, posicao, ocorrencia, id) {

  
  

  markers = new google.maps.Marker({
    position: posicao,
    map: map,
    title: ocorrencia,
    id: id

  })
  markers.addListener("click", () => {
    PegarUmaOcorrencia(id);
    });

}


function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      response.innerText = JSON.stringify(result, null, 2);

      const data = {
        address: results[0].formatted_address,
        location: {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        },
      };



      document.getElementById("addres").value = data.address;
      document.getElementById("problem").value = "Insira seu problema aqui";
      document.getElementById("lat").value = data.location.lat;
      document.getElementById("lng").value = data.location.lng;

    }
    )
}






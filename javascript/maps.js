const firebaseConfig2 = {
         apiKey: "AIzaSyAubbk47k7Zd9KDMJWCxe3X8MaNfblrS4o",
         authDomain: "fetin-teste.firebaseapp.com",
         databaseURL: "https://fetin-teste-default-rtdb.firebaseio.com",
         projectId: "fetin-teste",
         storageBucket: "fetin-teste.appspot.com",
         messagingSenderId: "88230584865",
         appId: "1:88230584865:web:46ee3be503d24f603bb960"
};

firebase.initializeApp(firebaseConfig2);
database = firebase.database();
const db = firebase.firestore();

      let map;
      let marker;
      let geocoder;
      let responseDiv;
      let response;

      function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 8,
          center: { lat: -34.397, lng: 150.644 },
          mapTypeControl: false,
        });
        geocoder = new google.maps.Geocoder();

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
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);

        marker = new google.maps.Marker({
          map,
        });

        map.addListener("click", (e) => {
          geocode({ location: e.latLng });
        });

        submitButton.addEventListener("click", () =>
          geocode({ address: inputText.value })
        );

        clearButton.addEventListener("click", () => {
          clear();
        });

        clear();
      }

      function clear() {
        marker.setMap(null);
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
      
            // Armazena os dados no Firebase Realtime Database
            const data = {
                address: results[0].formatted_address,
                location: {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                },
              };
            
              db.collection("ocorrencias").add(data)
                .then(() => {
                  console.log("Dados salvos no Cloud Firestore");
                })
                .catch((error) => {
                  console.error("Erro ao salvar os dados no Cloud Firestore:", error);
                });
            return results;
          });
          
          const occurrencesRef = db.collection("ocorrencias");

  occurrencesRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.location) {
          const { lat, lng } = data.location;
          console.log("Latitude:", lat);
          console.log("Longitude:", lng);
        }
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar os dados do Cloud Firestore:", error);
    });
      }

      // Obtém referência ao botão "Logout"
      document.addEventListener("DOMContentLoaded", function() {
        const logoutButton = document.getElementById("logout-button");

        logoutButton.addEventListener("click", function() {
          // Redireciona para a página desejada
          window.location.href = "../html/authentication.html";
        });
      });


      
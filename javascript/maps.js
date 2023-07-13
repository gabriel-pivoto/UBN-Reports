const requisicao = new XMLHttpRequest();

      let map;
      let marker;
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

        marker = new google.maps.Marker({
          map,
        });

        map.addListener("click", (e) => {
          if(novarequisicao == true){
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

        confirmar.addEventListener("click", () =>{
            Confirm();

            
        })

        

        clear();
      }

       function Confirm(){

        requisicao.open("POST","http://localhost:5000/addOcorrencia",true)
        requisicao.setRequestHeader("Content-type","application/json","Access-Control-Allow-Origin")
        requisicao.send(JSON.stringify({
              "id": Math.floor(Math.random() * 1000000) + 1,
            "ocorrencia":document.getElementById("problem").value,
            "latitude":document.getElementById("lat").value,
            "longitude":document.getElementById("lng").value,
            "Endereco": document.getElementById("addres").value
}))
        console.log();
      
        const modal = document.querySelector("dialog");
        modal.close();
      }

    
      function cancel(){
        const modal = document.querySelector("dialog");

        modal.close();
      }

      function clear() {
        marker.setMap(null);
      }

      
      function newrequest(){
        novarequisicao = true;
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
        )}


        
        

       
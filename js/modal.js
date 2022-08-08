let modalBtn = document.querySelector(".point-btn");
let closeModalBtn = document.querySelector(".close-modal");
let modal = document.getElementById("modal");
let dateInput = document.querySelector(".data-input");
let pointData = [];
let pointId = 0;

async function changeModalVisible(id) {                              // Function to change the visibility of the modal
    if (modal.style.display !== "flex") {
        pointId = id;
        await getModalInfo(id);                                      // Getting modal info before make it visible  
        setDataFromDate();                                           // Setting data from date
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}

async function getModalInfo(id) {
    let res = await fetch(`${baseAPI}/api/teste-leaflet/ponto/${id}`);      // Getting point data from API
    let data = await res.json();
    pointData = data;
}

function setDataFromDate() {
    let date = dateInput.value;
    let dataDoom = document.querySelector(".point-data-content");
    let dataHeaderDoom = document.querySelector(".data-point-span");
    let data = pointData.find(item => item.data === date);
    let content = "";
    if (data) {                                                             // If data exists, then set the data into the DOM
        content = `
            <span class="point-span"> <img class="point-icons" src="./assets/temperatura.png" alt=""/> Temperatura: ${data.temperatura} </span>
            <span class="point-span"> <img class="point-icons" src="./assets/umidade.png" alt=""/>  Umidade: ${data.umidade} </span>
            <span class="point-span"> <img class="point-icons" src="./assets/vento.png" alt=""/>  Vento: ${data.vento} </span>
            <span class="point-span"> <img class="point-icons" src="./assets/visibilidade.png" alt=""/>  Visibilidade: ${data.visibilidade} </span>
            <span class="point-span"> <img class="point-icons" src="./assets/precipitacao.png" alt=""/>  Precipitação: ${data.precipitacao} </span>
        `;
    } else {
        content = `
            <div class="empty-data">
                <img src="./assets/clima.png" class="clima-image" alt="clima">
                <h3> Não há dados disponíveis para esta data. </h3>
            </div>
        `;
    }
    dataHeaderDoom.innerHTML = `Estatísticas Ponto ${pointId}`;
    dataDoom.innerHTML = content;
}

dateInput.addEventListener("change", setDataFromDate);               // Setting date change event
closeModalBtn.addEventListener("click", changeModalVisible);         // Setting close modal event


document.addEventListener('DOMContentLoaded', bindButtons);


function makingPlanetRequest (req, table) {
    if (req.status >= 200 && req.status < 400) {
        let response = JSON.parse(req.responseText);

        addingHeaderRow(table);

        sessionStorage.removeItem("previous");
        sessionStorage.removeItem("next");
        sessionStorage.setItem("previous", response.previous);
        sessionStorage.setItem("next", response.next);

        if (sessionStorage.getItem("previous") === "null") {
            document.getElementById('previous').setAttribute("style", "background-color: #63bbf2");
        }
        if (sessionStorage.getItem("next") === "null") {
            document.getElementById('next').setAttribute("style", "background-color: #63bbf2");
        }

        for (let planet of response.results) {
            addPlanetToTable(planet, table);
        }
    }
}


function makingCharacterRequest(req, modalTable){
    if (req.status >= 200 && req.status < 400) {
        let resident = JSON.parse(req.responseText);

        addCharacterToModal(resident, modalTable);
    }
}


function planetAPICall(currentPageNumber, table) {
    const req = new XMLHttpRequest();
    let URLhost = 'https://swapi.co/api/planets/?page=' + currentPageNumber;
    req.open('GET', URLhost, true);
    req.addEventListener('load', function () {
            makingPlanetRequest(req, table)
        });

    req.send(null);
    event.preventDefault();
}


function characterAPICall(resident, modalTable) {
    const req = new XMLHttpRequest();
    let URLhost = resident;
    req.open('GET', URLhost, true);
    req.addEventListener('load', function () {
            makingCharacterRequest(req, modalTable)
        });

    req.send(null);
    event.preventDefault();
}


function addingHeaderRow (table) {
    table.innerHTML = `<tr class="headline">
        <td>Name</td>
        <td>Diameter</td>
        <td>Climate</td>
        <td>Terrain</td>
        <td>Surface water percentage</td>
        <td>Population</td>
        <td>Residents</td>
        </tr>`;
}


function formatSurfaceWater(input){
    if (input !== "unknown") {
        return input + ' %';
    } else {
        return 'unknown'
    }
}


function formatPopulation(input){
    if (input !== "unknown") {
        return input + ' people';
    } else {
        return 'unknown'
    }
}


function formatHeight(input){
    if (input !== "unknown") {
        return input + ' cm';
    }
}


function formatMass(input) {
    if (input !== "unknown") {
        return input + ' kg';
    } else {
        return 'unknown'
    }
}


function formatDiameter(input) {
    if (input !== "unknown") {
        return input + ' km';
    }
}


function onCloseBtnClicked(modalCont, modal, closeBtn) {
    modalCont.innerHTML = "";
    modalCont.appendChild(closeBtn);
    modal.setAttribute("style", "display: none")
}


function addCharacterToModal(resident, modalTable) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${resident.name}</td>
        <td>${formatHeight(resident.height)}</td>
        <td>${formatMass(resident.mass)}</td>
        <td>${resident.hair_color}</td>
        <td>${resident.skin_color}</td>
        <td>${resident.eye_color}</td>
        <td>${resident.birth_year}</td>
        <td>${resident.gender}</td>
    `;

    modalTable.appendChild(tr);
}


function onResidentBtnClicked(residents) {
    const modal = document.getElementsByClassName("modal")[0];
    modal.setAttribute("style", "display: block");

    const modalCont = document.getElementsByClassName("modal-content")[0];

    const closeBtn = document.getElementsByClassName("closeBtn")[0];

    let modalTable = document.createElement("table");

    modalTable.innerHTML = `<tr class="headline">
        <td>Name</td>
        <td>Height</td>
        <td>Mass</td>
        <td>Hair color</td>
        <td>Skin color</td>
        <td>Eye color</td>
        <td>Birth year</td>
        <td>Gender</td>
        </tr>`;

    modalCont.appendChild(closeBtn);
    modalCont.appendChild(modalTable);

    modal.appendChild(modalCont);

    for (let resident of residents){
       characterAPICall(resident, modalTable)
    }

    closeBtn.addEventListener('click', function () {
        onCloseBtnClicked(modalCont, modal, closeBtn)
    })
}


function addPlanetToTable(planet, table) {

    const tr = document.createElement('tr');

    let residentButton = 'No known residents';

    if (planet.residents.length > 0) {
        residentButton = `<button class="residentBtn">${planet.residents.length} resident(s)</button>`
    }

    tr.innerHTML = `
        <td>${planet.name}</td>
        <td>${formatDiameter(planet.diameter)}</td>
        <td>${planet.climate}</td>
        <td>${planet.terrain}</td>
        <td>${formatSurfaceWater(planet.surface_water)}</td>
        <td>${formatPopulation(planet.population)}</td>
        <td class="planet-residents">${residentButton}</td>
    `;

    if (residentButton !== "No known residents") {
        tr.querySelector('.residentBtn').addEventListener('click', function () {
            onResidentBtnClicked(planet.residents)
        });
    }

    table.appendChild(tr);

}

function nextBtnClicked(currentPageNumber, table) {
    if (sessionStorage.getItem("next") === "null") {
        return currentPageNumber;
    } else if (sessionStorage.getItem("next") !== "null") {
        if (sessionStorage.getItem("previous") === "null") {
            document.getElementById('previous').setAttribute("style", "background-color: #1183ca");
        }
        currentPageNumber++;
        table.innerHTML = "";
        planetAPICall(currentPageNumber, table);
        return currentPageNumber;
    } else {}
}

function previousBtnClicked(currentPageNumber, table) {
    if (sessionStorage.getItem("previous") === "null") {
        return currentPageNumber;
    } else if (sessionStorage.getItem("previous") !== "null") {
        if (sessionStorage.getItem("next") === "null") {
           document.getElementById('next').setAttribute("style", "background-color: #1183ca");
        }
        currentPageNumber--;
        table.innerHTML = "";
        planetAPICall(currentPageNumber, table);
        return currentPageNumber;
    } else {}
}


function bindButtons() {

    let table = document.querySelector('table');

    let currentPageNumber = 1;

    planetAPICall(currentPageNumber, table);


    document.getElementById('next').addEventListener('click', function () {
        currentPageNumber = nextBtnClicked(currentPageNumber, table);

    });

    document.getElementById('previous').addEventListener('click', function () {
        currentPageNumber = previousBtnClicked(currentPageNumber, table);

    });
}

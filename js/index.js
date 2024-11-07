

// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");
let allColumn = document.getElementById("allDay-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach((column, index) => {

    column.addEventListener("mousedown", function(down) {
        console.log("Clic simple");
        let posDepartX = down.offsetX;
        let posDepartY = down.offsetY;
        let idJourDebut = column.id;
        console.log(idJourDebut + " / depart / "+posDepartX);
        // Fonction pour gérer le mouvement de la souris uniquement dans la colonne
        function onMouseMove(pos) {
            let relativeY = pos.offsetY;  // Position Y relative à la colonne
            let relativeX = pos.offsetX;  // Position X relative à la colonne
            
            //console.log("Position relative dans la colonne - Gauche-droite X:", relativeX, "Bas Y:", relativeY);
        }
        function onMouseLeave(pos){

            let posFinX = pos.offsetX;
            let posFinY = pos.offsetY;
            let idJourFin = column.id;
            console.log(idJourFin + "/ Fin / "+posFinX);

            column.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseLeave);
        }


        column.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseLeave);
    });
});

/*

function creationDiv(column, X, Y){

    let div = document.createElement("div");
    div.innerHTML = "Je suis là";
    div.classList.add("event-slot");

    let sousDiv = document.createElement("div");
    sousDiv.innerHtml = "En dessous";
    sousDiv.classList.add("sousDiv");
    
    const rect = column.getBoundingClientRect();
    console.log(rect.left+" /"+rect.top);

    // Positionne le div en utilisant les coordonnées de la souris
    div.style.width = "100%";
    div.style.position = "absolute"; // Positionne le div en mode absolu
    div.style.top = `${Y - rect.top}px`; // Ajuste par rapport à la colonne
    div.style.marginRight = `${X - rect.right}px`;


    // Ajoute le nouvel élément div au parent de la colonne
    column.appendChild(div);
    div.appendChild(sousDiv);

}

*/


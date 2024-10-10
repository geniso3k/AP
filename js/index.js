// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event){
        if (event.defaultPrevented) return;

        let mouseX = event.clientX;
        let mouseY = event.clientY;
        creationDiv(column, mouseX,mouseY);
    });
});
let allEvents = document.getElementsByClassName("event-slot");


function creationDiv(column, X, Y){

    let div = document.createElement("div");
    div.innerHTML = "Je suis là";
    div.classList.add("event-slot");

    let sousDiv = document.createElement("div");
    sousDiv.innerHTML = "Dans la div";
    sousDiv.classList.add("sousDiv");
    
    const rect = column.getBoundingClientRect();

    // Positionne le div en utilisant les coordonnées de la souris
    div.style.width = "100%";
    div.style.position = "absolute"; // Positionne le div en mode absolu
    div.style.top = `${Y - rect.top}px`; // Ajuste par rapport à la colonne
    div.style.left = `${X - rect.left}px`;


    // Ajoute le nouvel élément div au parent de la colonne
    column.appendChild(div);
    div.appendChild(sousDiv);


    let isResizing = false; //

    div.addEventListener("mousedown", function(down){

        let initialY = down.clientY;
        let initialHeight = div.offsetHeight;

        function onMouseMove(position){

            isResizing = true;

            let newHeight = initialHeight + (position.clientY - initialY);
            div.style.height = newHeight + "px";

            console.log("En place"); // Le log devrait maintenant fonctionner correctement
        }
        // On stoppe le redimensionnement quand la souris est relâchée
        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        // Ajoute les écouteurs d'événements
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

    });

    div.addEventListener("click", function(event) {
        if (isResizing) {
            event.preventDefault(); // Annule l'événement click si redimensionnement
            isResizing = false; // Réinitialise la variable après relâchement de la souris
        }
    });

}


//Gerer les dates de l'entete du planning
let lundiCourant = new Date();
lundiCourant.setDate( lundiCourant.getDate() - lundiCourant.getDay() ) ;
let retourneJour = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
let retourneMois = ["janvier","fevrier","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","decembre"];
function afficheCalendrier( date ) //Pour ajouter la date à coté de jeudi vendredi etc
{   
    let d = new Date( date ) ;
    let lesDates = document.getElementsByClassName("day-header");
    let cWeek = document.getElementById("current-week");
    let premier; let dernier;
    for(let uneDate of lesDates){
        day = retourneJour[d.getDay()];
        if(d.getDay() == 0){
            premier = d.getDate() ;
        }
        if(d.getDay() == 6){
            dernier = d.getDate();
        }
        uneDate.innerHTML = "<b>" + day + " "+ d.getDate() + "</b>" ;
        d.setDate( d.getDate() + 1 ) ;
    }
    cWeek.innerHTML = "Semaine du "+ premier +" au "+ dernier +" " + retourneMois[d.getMonth()] + " " + d.getFullYear();

}

function reculeSemaine()
{
    lundiCourant.setDate( lundiCourant.getDate() - 7 ) ;
    afficheCalendrier( lundiCourant ) ;

}
function avanceSemaine()
{
    lundiCourant.setDate( lundiCourant.getDate() + 7 ) ;
    afficheCalendrier( lundiCourant ) ;

}

window.onload = function(){

    afficheCalendrier( lundiCourant ) ;

}

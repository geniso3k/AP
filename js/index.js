// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event){
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        creationDiv(column, mouseX,mouseY);
    });
});
let allEvents = document.getElementsByClassName("event-slot");

Array.from(allEvents).forEach(slots =>{
    column.addEventListener("onmousedown", function(down){

        down.addEventListener("onmousemove", function(pos){

            let div = down.closest("event-slot");
            div.style.width = pos.clientY;
            console.log("En place");


        });

    });
});

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

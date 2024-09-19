// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event){
        column.innerHTML = "<div class='event-slot'>esffs</div>";
    });
});


//Gerer les dates de l'entete du planning
let dateSave = new Date();
let retourneJour = ["Jeudi","Vendredi","Samedi","Dimanche","Lundi","Mardi","Mercredi"];
function afficheCalendrier() //Pour ajouter la date à coté de jeudi vendredi etc
{   
    let lesDates = document.getElementsByClassName("day-header");
    let d = dateSave;
    for(let uneDate of lesDates){
        day = retourneJour[d.getDay()];
            uneDate.innerHTML = "<b>" + day + " "+ d.getDate() + "</b>" ;
            d.setDate( d.getDate() + 1 ) ;
            
    }

}

window.onload = function(){

    afficheCalendrier();

}

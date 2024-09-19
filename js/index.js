// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", (e) => {
        column.innerHTML = "<div class='event-slot'>esffs</div>";
    });
});

let retourneJour = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];

function AfficheCalendrier( idPlanning, jour) //Pour ajouter la date à coté de jeudi vendredi etc
{
    let planning = document.getElementById( idPlanning );
    let entetesJour = document.getElementsByClassName("PlEntetesJour");

    for (let i=0; entetesJour.length; i++){
        let d = jour.getDay();
    }
    return(new Date("y/m/"+d));
}



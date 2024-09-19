// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event){
        column.innerHTML = "<div class='event-slot'>esffs</div>";
    });
});


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
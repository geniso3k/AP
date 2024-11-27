
//Gerer les dates de l'entete du planning
let lundiCourant = new Date();
lundiCourant.setDate( lundiCourant.getDate() - lundiCourant.getDay() ) ;
let retourneJour = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
let retourneMois = ["janvier","fevrier","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","decembre"];

function viserLundi() {
   return document.getElementById("lundi").innerText;
}


function supprimerEvents(  ){
    // Utiliser querySelectorAll pour obtenir une NodeList statique
    let eventSlots = document.querySelectorAll(".event-slot");

    // Itérer et supprimer chaque élément
    eventSlots.forEach(element => {
        element.remove(); // Supprimer l'élément
    });
}
function afficheEvents() {
    // Supprimer les événements existants avant d'afficher les nouveaux
    supprimerEvents();
    // Récupérer les événements de la semaine suivante depuis localStorage
    let storedEvents = localStorage.getItem(viserLundi()); // Utiliser la date formatée pour récupérer les événements

    // Vérifier si des événements existent pour cette semaine
    if (storedEvents) {
        let eventsArray = JSON.parse(storedEvents);  // Convertir la chaîne JSON en tableau d'événements
        
        // Pour chaque événement, créer un élément div et l'ajouter à l'interface
        eventsArray.forEach(event => {
            let div = new Evenement(event.startY, event.startX, event.parentId);
            div.div.style.height = event.height + "px";
        });
    }
}


    

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
    afficheEvents();

}
function avanceSemaine()
{
    lundiCourant.setDate( lundiCourant.getDate() + 7 ) ;
    afficheCalendrier( lundiCourant ) ;
    afficheEvents();

}

 

window.onload = function(){

    afficheCalendrier( lundiCourant ) ;
    afficheEvents(lundiCourant);

}

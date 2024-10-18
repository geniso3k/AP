// date.js

function afficheCalendrier(date, planningElement) {
    let d = new Date(date);
    let lesDates = planningElement.shadowRoot.querySelectorAll(".day-header");
    let colonnesJours = planningElement.shadowRoot.querySelectorAll(".day-column");
    let cWeek = planningElement.shadowRoot.querySelector("#current-week");
    let premierJour;
    let dernierJour;

    for (let i = 0; i < lesDates.length; i++) {
        let uneDate = lesDates[i];
        let colonneJour = colonnesJours[i];
        let nomJour = planningElement.listeJours[d.getDay()];
        if (i === 0) {
            premierJour = d.getDate();
        }
        if (i === lesDates.length - 1) {
            dernierJour = d.getDate();
        }
        uneDate.innerHTML = "<b>" + nomJour + " " + d.getDate() + "</b>";

        const dateString = d.toISOString().split('T')[0];
        colonneJour.dataset.date = dateString;

        d.setDate(d.getDate() + 1);
    }
    cWeek.innerHTML = "Semaine du " + premierJour + " au " + dernierJour + " " + planningElement.listeMois[planningElement.lundiCourant.getMonth()] + " " + planningElement.lundiCourant.getFullYear();

    planningElement.chargerEvenementsDepuisStockage();
}

function reculeSemaine(planningElement) {
    planningElement.lundiCourant.setDate(planningElement.lundiCourant.getDate() - 7);
    afficheCalendrier(planningElement.lundiCourant, planningElement);
}

function avanceSemaine(planningElement) {
    planningElement.lundiCourant.setDate(planningElement.lundiCourant.getDate() + 7);
    afficheCalendrier(planningElement.lundiCourant, planningElement);
}

window.onload = function() {
    customElements.whenDefined('planning-calendrier').then(() => {
        const planningElement = document.querySelector('planning-calendrier');
        if (planningElement) {
            planningElement.listeJours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            planningElement.listeMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

            afficheCalendrier(planningElement.lundiCourant, planningElement);

            planningElement.shadowRoot.getElementById('prev-week').addEventListener('click', () => {
                reculeSemaine(planningElement);
            });
            planningElement.shadowRoot.getElementById('next-week').addEventListener('click', () => {
                avanceSemaine(planningElement);
            });
        } else {
            console.error("Le planning-calendrier n'est pas disponible !");
        }
    }).catch(error => {
        console.error("Erreur lors de la définition du composant : ", error);
    });
};

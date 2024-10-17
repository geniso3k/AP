// dateManagement.js

let lundiCourant = new Date();
lundiCourant.setHours(0, 0, 0, 0); // Réinitialiser l'heure
const day = lundiCourant.getDay();
const diff = (day <= 0 ? -6 : 1) - day; // Calculer la différence pour obtenir le lundi
lundiCourant.setDate(lundiCourant.getDate() + diff);

let retourneJour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
let retourneMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function afficheCalendrier(date, shadowRoot) {
    let d = new Date(date);
    let lesDates = shadowRoot.querySelectorAll(".day-header");
    let dayColumns = shadowRoot.querySelectorAll(".day-column");
    let cWeek = shadowRoot.querySelector("#current-week");
    let premier;
    let dernier;

    for (let i = 0; i < lesDates.length; i++) {
        let uneDate = lesDates[i];
        let dayColumn = dayColumns[i];
        let dayName = retourneJour[d.getDay()];
        if (i === 0) {
            premier = d.getDate();
        }
        if (i === lesDates.length - 1) {
            dernier = d.getDate();
        }
        uneDate.innerHTML = "<b>" + dayName + " " + d.getDate() + "</b>";

        // Mettre à jour l'attribut data-date de la colonne du jour
        const dateString = d.toISOString().split('T')[0];
        dayColumn.dataset.date = dateString;

        d.setDate(d.getDate() + 1);
    }
    cWeek.innerHTML = "Semaine du " + premier + " au " + dernier + " " + retourneMois[d.getMonth()] + " " + d.getFullYear();

    // Recharger les événements pour la nouvelle semaine
    const planningElement = document.querySelector('planning-calendrier');
    if (planningElement) {
        planningElement.lundiCourant = new Date(date);
        planningElement.loadEventsFromStorage();
    }
}

function reculeSemaine(planningElement) {
    planningElement.lundiCourant.setDate(planningElement.lundiCourant.getDate() - 7);
    afficheCalendrier(planningElement.lundiCourant, planningElement.shadowRoot);
}

function avanceSemaine(planningElement) {
    planningElement.lundiCourant.setDate(planningElement.lundiCourant.getDate() + 7);
    afficheCalendrier(planningElement.lundiCourant, planningElement.shadowRoot);
}

// Initialisation du planning au chargement de la page
window.onload = function() {
    customElements.whenDefined('planning-calendrier').then(() => {
        const planningElement = document.querySelector('planning-calendrier');
        if (planningElement) {
            afficheCalendrier(planningElement.lundiCourant, planningElement.shadowRoot);
        } else {
            console.error("Le planning-calendrier n'est pas disponible !");
        }
    }).catch(error => {
        console.error("Erreur lors de la définition du composant : ", error);
    });
};

let lundiCourant = new Date();
lundiCourant.setDate(lundiCourant.getDate() - lundiCourant.getDay());
let retourneJour = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
let retourneMois = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "decembre"];

function afficheCalendrier(date, shadowRoot) {
    let d = new Date(date);
    let lesDates = shadowRoot.querySelectorAll(".day-header"); // Utilisation de shadowRoot
    let cWeek = shadowRoot.querySelector("#current-week"); // Utilisation de shadowRoot
    let premier;
    let dernier;
    for (let uneDate of lesDates) {
        let day = retourneJour[d.getDay()];
        if (d.getDay() == 0) {
            premier = d.getDate();
        }
        if (d.getDay() == 6) {
            dernier = d.getDate();
        }
        uneDate.innerHTML = "<b>" + day + " " + d.getDate() + "</b>";
        d.setDate(d.getDate() + 1);
    }
    cWeek.innerHTML = "Semaine du " + premier + " au " + dernier + " " + retourneMois[d.getMonth()] + " " + d.getFullYear();
}

function reculeSemaine(shadowRoot) {
    lundiCourant.setDate(lundiCourant.getDate() - 7);
    afficheCalendrier(lundiCourant, shadowRoot);
}

function avanceSemaine(shadowRoot) {
    lundiCourant.setDate(lundiCourant.getDate() + 7);
    afficheCalendrier(lundiCourant, shadowRoot);
}

window.onload = function() {
    customElements.whenDefined('planning-calendrier').then(() => {
        const planningElement = document.querySelector('planning-calendrier');
        const shadowRoot = planningElement ? planningElement.shadowRoot : null;

        if (shadowRoot) {
            // Initialiser le calendrier une fois le composant prêt
            afficheCalendrier(lundiCourant, shadowRoot);

            // Ajouter les événements pour les boutons
            shadowRoot.getElementById('prev-week').addEventListener('click', function() {
                reculeSemaine(shadowRoot);
            });
            shadowRoot.getElementById('next-week').addEventListener('click', function() {
                avanceSemaine(shadowRoot);
            });
        } else {
            console.error("Le shadowRoot n'est pas disponible !");
        }
    }).catch(error => {
        console.error("Erreur lors de la définition du composant : ", error);
    });
}


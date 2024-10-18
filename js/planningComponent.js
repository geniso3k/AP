// Planning.js

class Planning extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.hauteurColonneTemps = 0;

        // Initialiser lundiCourant au lundi de la semaine actuelle
        this.lundiCourant = new Date();
        this.lundiCourant.setHours(0, 0, 0, 0); // Réinitialiser l'heure
        const jour = this.lundiCourant.getDay();
        const diff = (jour <= 0 ? -6 : 1) - jour; // Calculer la différence pour obtenir le lundi
        this.lundiCourant.setDate(this.lundiCourant.getDate() + diff);

        // Tableaux pour les noms de jours et de mois
        this.listeJours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        this.listeMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    }

    connectedCallback() {
        this.render();
        this.initialiserCalendrier();

        setTimeout(() => {
            this.initialiserClicDiv();

            // Obtenir la hauteur totale de la colonne horaire
            const timeSlot = this.shadowRoot.querySelector('.time-slot');
            const hauteurTimeSlot = timeSlot.offsetHeight;
            const nombreTimeSlots = 24;
            this.hauteurColonneTemps = hauteurTimeSlot * nombreTimeSlots;

            // Synchroniser le défilement horizontal
            this.synchroniserDefilement();

            // Afficher le calendrier initial
            this.afficheCalendrier(this.lundiCourant);
        }, 0);
    }

    chargerEvenementsDepuisStockage() {
        let evenements = JSON.parse(localStorage.getItem('evenements')) || [];

        // Obtenir les dates de début et de fin de la semaine courante
        const dateDebutSemaine = new Date(this.lundiCourant);
        const dateFinSemaine = new Date(this.lundiCourant);
        dateFinSemaine.setDate(dateFinSemaine.getDate() + 6); // Dimanche

        // Filtrer les événements pour la semaine courante
        evenements = evenements.filter(evenement => {
            const dateEvenement = new Date(evenement.date);
            return dateEvenement >= dateDebutSemaine && dateEvenement <= dateFinSemaine;
        });

        // Supprimer les événements actuels du planning
        this.effacerEvenements();

        // Charger les événements filtrés
        evenements.forEach(donneesEvenement => {
            const colonne = this.shadowRoot.querySelector(`.day-column[data-date="${donneesEvenement.date}"]`);
            if (colonne) {
                new Evenement(
                    colonne,
                    0, // X (non utilisé avec donneesEvenement)
                    0, // Y (non utilisé avec donneesEvenement)
                    this.shadowRoot,
                    this.hauteurColonneTemps,
                    false,     // Ne pas sauvegarder à nouveau
                    donneesEvenement  // Passer donneesEvenement pour éviter l'appel à changerMotif()
                );
            }
        });
    }

    effacerEvenements() {
        const eventSlots = this.shadowRoot.querySelectorAll('.event-slot');
        eventSlots.forEach(eventSlot => eventSlot.remove());
    }

    synchroniserDefilement() {
        const planningHeader = this.shadowRoot.querySelector('.planning-header');
        const planningBodyContainer = this.shadowRoot.querySelector('.planning-body-container');

        planningBodyContainer.addEventListener('scroll', () => {
            planningHeader.scrollLeft = planningBodyContainer.scrollLeft;
        });
    }

    render() {
        let maxHeight = "200px";
        this.shadowRoot.innerHTML = `
            <style>
                @import url('styles.css');
                .planning-body-container{
                    height: ${maxHeight}
                }
            </style>
            <div class="planning-container">
                <!-- Navigation -->
                <div class="navigation">
                    <button title="Semaine précédente" class="nav-button" id="prev-week">&lt;</button>
                    <span id="current-week" class="current-week"></span>
                    <button title="Réinitialiser le planning" class="nav-button" id="reset-planning">Supprimer tous les évènements</button>
                    <button title="Semaine suivante" class="nav-button" id="next-week">&gt;</button>
                </div>

                <!-- Planning -->
                <div class="planning">
                    <!-- Conteneur pour le défilement horizontal -->
                    <div class="planning-scroll-container">
                        <!-- En-tête du planning -->
                        <div class="planning-header">
                            <div class="time-header"></div>
                            <div class="day-header">Lundi</div>
                            <div class="day-header">Mardi</div>
                            <div class="day-header">Mercredi</div>
                            <div class="day-header">Jeudi</div>
                            <div class="day-header">Vendredi</div>
                            <div class="day-header">Samedi</div>
                            <div class="day-header">Dimanche</div>
                        </div>

                        <!-- Conteneur du corps du planning -->
                        <div class="planning-body-container">
                            <div class="planning-body">
                                <div class="time-column">
                                    
                                    ${this.creerTimeSlots()}
                                </div>
                                <div class="day-column" id="lundi"></div>
                                <div class="day-column" id="mardi"></div>
                                <div class="day-column" id="mercredi"></div>
                                <div class="day-column" id="jeudi"></div>
                                <div class="day-column" id="vendredi"></div>
                                <div class="day-column" id="samedi"></div>
                                <div class="day-column" id="dimanche"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter les attributs data-date aux colonnes des jours
        this.mettreAJourDatesColonnes();
    }

    mettreAJourDatesColonnes() {
        const colonnesJours = this.shadowRoot.querySelectorAll(".day-column");
        let date = new Date(this.lundiCourant);

        colonnesJours.forEach(colonne => {
            const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            colonne.dataset.date = dateString;
            date.setDate(date.getDate() + 1);
        });
    }

    creerTimeSlots() {
        let timeSlots = '';
        for (let i = 0; i < 24; i++) {
            timeSlots += `<div class="time-slot">${i.toString().padStart(2, '0')}:00</div>`;
        }
        return timeSlots;
    }

    initialiserCalendrier() {
        const shadowRoot = this.shadowRoot;
        if (!shadowRoot.querySelectorAll(".day-header").length) {
            console.error("Les éléments day-header ne sont pas trouvés !");
            return;
        }

        // Ajouter un écouteur pour le bouton de réinitialisation
        const resetButton = this.shadowRoot.querySelector('#reset-planning');
        resetButton.addEventListener('click', () => this.reinitialiserPlanning());

        // Ajouter les événements pour les boutons de navigation
        this.shadowRoot.getElementById('prev-week').addEventListener('click', () => {
            this.reculeSemaine();
        });
        this.shadowRoot.getElementById('next-week').addEventListener('click', () => {
            this.avanceSemaine();
        });
    }

    reinitialiserPlanning() {
        // Effacer le Local Storage
        localStorage.removeItem('evenements');

        // Supprimer tous les événements du planning
        const eventSlots = this.shadowRoot.querySelectorAll('.event-slot');
        eventSlots.forEach(eventSlot => eventSlot.remove());
    }

    initialiserClicDiv() {
        const shadowRoot = this.shadowRoot;
        let colonnesJours = shadowRoot.querySelectorAll(".day-column");

        Array.from(colonnesJours).forEach(colonne => {
            let ignorerProchainClic = false;

            // Écoute l'événement personnalisé pour ignorer le prochain clic
            colonne.addEventListener('ignoreNextClick', (event) => {
                ignorerProchainClic = true;
            });

            colonne.addEventListener("click", (event) => {
                if (ignorerProchainClic) {
                    ignorerProchainClic = false; // Réinitialise après avoir ignoré ce clic
                    event.preventDefault();
                    return;
                }

                let mouseX = event.clientX; // Coordonnée X de la souris (par rapport à la fenêtre)
                let mouseY = event.clientY; // Coordonnée Y de la souris (par rapport à la fenêtre)

                // Calcule la position Y relative à la colonne pour bien placer l'élément
                const rectColonne = colonne.getBoundingClientRect();
                const relativeMouseY = mouseY - rectColonne.top;

                new Evenement(colonne, mouseX, relativeMouseY, shadowRoot, this.hauteurColonneTemps);
            });
        });
    }

    afficheCalendrier(date) {
        let d = new Date(date);
        let lesDates = this.shadowRoot.querySelectorAll(".day-header");
        let colonnesJours = this.shadowRoot.querySelectorAll(".day-column");
        let cWeek = this.shadowRoot.querySelector("#current-week");
        let premierJour;
        let dernierJour;

        for (let i = 0; i < lesDates.length; i++) {
            let uneDate = lesDates[i];
            let colonneJour = colonnesJours[i];
            let nomJour = this.listeJours[d.getDay()];
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
        cWeek.innerHTML = "Semaine du " + premierJour + " au " + dernierJour + " " + this.listeMois[this.lundiCourant.getMonth()] + " " + this.lundiCourant.getFullYear();

        this.chargerEvenementsDepuisStockage();
    }

    reculeSemaine() {
        this.lundiCourant.setDate(this.lundiCourant.getDate() - 7);
        this.afficheCalendrier(this.lundiCourant);
    }

    avanceSemaine() {
        this.lundiCourant.setDate(this.lundiCourant.getDate() + 7);
        this.afficheCalendrier(this.lundiCourant);
    }
}

customElements.define('planning-calendrier', Planning);

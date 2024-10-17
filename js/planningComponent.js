class Planning extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.timeColumnHeight = 0;

        // Initialiser lundiCourant au lundi de la semaine actuelle
        this.lundiCourant = new Date();
        this.lundiCourant.setHours(0, 0, 0, 0); // Réinitialiser l'heure
        const day = this.lundiCourant.getDay();
        const diff = (day <= 0 ? -6 : 1) - day; // Calculer la différence pour obtenir le lundi
        this.lundiCourant.setDate(this.lundiCourant.getDate() + diff);

        // Tableaux pour les noms de jours et de mois
        this.retourneJour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        this.retourneMois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    }

    connectedCallback() {
        this.render();
        this.initialiserCalendrier();

        setTimeout(() => {
            this.initialiserClicDiv();

            // Obtenir la hauteur totale de la colonne horaire
            const timeSlot = this.shadowRoot.querySelector('.time-slot');
            const timeSlotHeight = timeSlot.offsetHeight;
            const numberOfTimeSlots = 24;
            this.timeColumnHeight = timeSlotHeight * numberOfTimeSlots;

            // Synchroniser le défilement horizontal
            this.synchroniserDefilement();

            // Charger les événements sauvegardés
            this.loadEventsFromStorage();
        }, 0);
    }

    loadEventsFromStorage() {
        let events = JSON.parse(localStorage.getItem('events')) || [];

        // Obtenir les dates de début et de fin de la semaine courante
        const weekStartDate = new Date(this.lundiCourant);
        const weekEndDate = new Date(this.lundiCourant);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // Dimanche

        // Filtrer les événements pour la semaine courante
        events = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= weekStartDate && eventDate <= weekEndDate;
        });

        // Supprimer les événements actuels du planning
        this.clearEvents();

        // Charger les événements filtrés
        events.forEach(eventData => {
            const column = this.shadowRoot.querySelector(`.day-column[data-date="${eventData.date}"]`);
            if (column) {
                const divCreator = new DivCreator(
                    column,
                    0,
                    parseInt(eventData.top),
                    this.shadowRoot,
                    this.timeColumnHeight,
                    false // Ne pas sauvegarder à nouveau
                );

                // Appliquer les styles sauvegardés
                divCreator.div.style.top = eventData.top;
                divCreator.div.style.height = eventData.height;
                divCreator.div.style.backgroundColor = eventData.color;
                divCreator.div.dataset.eventId = eventData.id;

                // Recalculer les heures de début et de fin
                divCreator.objDiv.redefinirTop(parseInt(eventData.top));
                divCreator.objDiv.redefinirHeight(parseInt(eventData.height));
                divCreator.topText.innerHTML = "Début : <b>" + divCreator.objDiv.calculTop() + "</b> - Fin : <b>" + divCreator.objDiv.calculHeight() + "</b>";
                divCreator.sousDiv.innerHTML = "Durée : <b>" + divCreator.objDiv.totalHeure() + "</b>";
            }
        });
    }

    clearEvents() {
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
        this.shadowRoot.innerHTML = `
            <style>
                @import url('styles.css');
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
                                    <!-- Création des créneaux horaires -->
                                    ${this.createTimeSlots()}
                                </div>
                                <div class="day-column" id="monday"></div>
                                <div class="day-column" id="tuesday"></div>
                                <div class="day-column" id="wednesday"></div>
                                <div class="day-column" id="thursday"></div>
                                <div class="day-column" id="friday"></div>
                                <div class="day-column" id="saturday"></div>
                                <div class="day-column" id="sunday"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter les attributs data-date aux colonnes des jours
        this.updateDayColumnsDates();
    }

    updateDayColumnsDates() {
        const dayColumns = this.shadowRoot.querySelectorAll(".day-column");
        let date = new Date(this.lundiCourant);

        dayColumns.forEach(column => {
            const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            column.dataset.date = dateString;
            date.setDate(date.getDate() + 1);
        });
    }

    createTimeSlots() {
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
        resetButton.addEventListener('click', () => this.resetPlanning());

        // Initialiser les dates dans les en-têtes
        this.afficheCalendrier(this.lundiCourant);

        // Ajouter les événements pour les boutons de navigation
        this.shadowRoot.getElementById('prev-week').addEventListener('click', () => {
            this.reculeSemaine();
        });
        this.shadowRoot.getElementById('next-week').addEventListener('click', () => {
            this.avanceSemaine();
        });
    }

    resetPlanning() {
        // Effacer le Local Storage
        localStorage.removeItem('events');

        // Supprimer tous les événements du planning
        const eventSlots = this.shadowRoot.querySelectorAll('.event-slot');
        eventSlots.forEach(eventSlot => eventSlot.remove());
    }

    // Méthode pour gérer le clic et créer des divs dynamiques
    initialiserClicDiv() {
        const shadowRoot = this.shadowRoot;

        // Sélectionne toutes les colonnes avec la classe "day-column" dans le shadowRoot
        let dayColumns = shadowRoot.querySelectorAll(".day-column");

        Array.from(dayColumns).forEach(column => {
            let ignoreNextClick = false; // Flag pour ignorer le clic après le redimensionnement

            // Écoute l'événement personnalisé pour ignorer le prochain clic
            column.addEventListener('ignoreNextClick', (event) => {
                ignoreNextClick = true;
            });

            column.addEventListener("click", (event) => {
                if (ignoreNextClick) {
                    // Ignore le prochain clic après le redimensionnement
                    ignoreNextClick = false; // Réinitialise après avoir ignoré ce clic
                    event.preventDefault();
                    return;
                }

                let mouseX = event.clientX; // Coordonnée X de la souris (par rapport à la fenêtre)
                let mouseY = event.clientY; // Coordonnée Y de la souris (par rapport à la fenêtre)

                // Calcule la position Y relative à la colonne pour bien placer l'élément
                const columnRect = column.getBoundingClientRect();
                const relativeMouseY = mouseY - columnRect.top;

                // Crée une nouvelle instance de DivCreator pour créer et gérer un div
                new DivCreator(column, mouseX, relativeMouseY, shadowRoot, this.timeColumnHeight);
            });
        });
    }

    // Méthode pour afficher le calendrier avec les dates
    afficheCalendrier(date) {
        let d = new Date(date);
        let lesDates = this.shadowRoot.querySelectorAll(".day-header");
        let dayColumns = this.shadowRoot.querySelectorAll(".day-column");
        let cWeek = this.shadowRoot.querySelector("#current-week");
        let premier;
        let dernier;

        for (let i = 0; i < lesDates.length; i++) {
            let uneDate = lesDates[i];
            let dayColumn = dayColumns[i];
            let dayName = this.retourneJour[d.getDay()];
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
        cWeek.innerHTML = "Semaine du " + premier + " au " + dernier + " " + this.retourneMois[d.getMonth()] + " " + d.getFullYear();

        // Recharger les événements pour la nouvelle semaine
        this.loadEventsFromStorage();
    }

    // Méthode pour reculer d'une semaine
    reculeSemaine() {
        this.lundiCourant.setDate(this.lundiCourant.getDate() - 7);
        this.afficheCalendrier(this.lundiCourant);
    }

    // Méthode pour avancer d'une semaine
    avanceSemaine() {
        this.lundiCourant.setDate(this.lundiCourant.getDate() + 7);
        this.afficheCalendrier(this.lundiCourant);
    }
}

customElements.define('planning-calendrier', Planning);

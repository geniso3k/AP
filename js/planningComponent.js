class Planning extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.timeColumnHeight = 0; // Initialisation de la hauteur de la colonne horaire
    }

    connectedCallback() {
        this.render();
        this.initialiserCalendrier();

        // Utilisez setTimeout pour retarder l'initialisation des clics
        setTimeout(() => {
            this.initialiserClicDiv();
            // Obtenir la hauteur de la colonne horaire
            const timeColumn = this.shadowRoot.querySelector('.time-column');
            this.timeColumnHeight = timeColumn.offsetHeight;
        }, 0);  // Retarde l'exécution à la prochaine boucle d'événements pour s'assurer que le DOM est prêt
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
                    <button title="Semaine suivante" class="nav-button" id="next-week">&gt;</button>
                </div>

                <!-- Planning -->
                <div class="planning">
                    <div class="planning-header-container">
                        <div class="planning-header">
                            <div class="time-header"></div>
                            <div class="day-header">Lundi 18</div>
                            <div class="day-header">Mardi 19</div>
                            <div class="day-header">Mercredi 20</div>
                            <div class="day-header">Jeudi 21</div>
                            <div class="day-header">Vendredi 22</div>
                            <div class="day-header">Samedi 23</div>
                            <div class="day-header">Dimanche 24</div>
                        </div>
                    </div>
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
        `;
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
    }

    // Nouvelle méthode pour gérer le clic et créer des divs dynamiques
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
}

customElements.define('planning-calendrier', Planning);

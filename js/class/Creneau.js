// Creneau.js

class Creneau {
    constructor(dayColumnId, startTime, duration) {
        this.id = null; // Identifiant unique (sera défini lors de la sauvegarde dans IndexedDB)
        this.dayColumnId = dayColumnId;
        this.startTime = startTime;
        this.duration = duration;
        this.motif = '';

        // Créer l'élément du créneau
        this.eventSlot = document.createElement('div');
        this.eventSlot.classList.add('event-slot');

        // Positionner le créneau
        this.updatePosition();

        // Ajouter le créneau à la colonne du jour
        const dayColumn = document.getElementById(this.dayColumnId);
        if (dayColumn) {
            dayColumn.appendChild(this.eventSlot);
        }
    }

    updatePosition() {
        const startPixel = this.startTime * 50; // Supposant que chaque heure fait 50px
        const heightPixel = this.duration * 50;

        this.eventSlot.style.top = `${startPixel}px`;
        this.eventSlot.style.height = `${heightPixel}px`;
    }
}

// Attacher la classe Creneau à l'objet global window
window.Creneau = Creneau;

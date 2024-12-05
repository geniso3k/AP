// Creneau.js

class Creneau {
    constructor(startDate, endDate, startTime, endTime, motif = '', planning) {
        this.id = null;
        this.startDate = startDate; // Date de début du créneau
        this.endDate = endDate;     // Date de fin du créneau
        this.startTime = startTime;
        this.endTime = endTime;     // Nouvelle propriété
        this.motif = motif;
        this.planning = planning;   // Référence au planning pour accéder à checkOverlap

        // Liste des clones pour chaque jour
        this.clones = [];

        // Créer l'élément du créneau
        this.eventSlot = document.createElement('div');
        this.eventSlot.classList.add('event-slot');

        // Ajouter le contenu
        this.updateContent();

        // Ajouter les handles de redimensionnement
        this.addResizeHandles();

        // Positionner le créneau
        this.updatePosition();
    }

    updatePosition() {
        // Supprimer les clones existants
        this.removeFromColumns();

        // Ajouter les clones pour chaque jour
        this.addToColumns();

        // Mettre à jour les positions pour tous les clones
        this.updateClonesPosition();
    }

    removeFromColumns() {
        this.clones.forEach((clone) => {
            if (clone.parentElement) {
                clone.parentElement.removeChild(clone);
            }
        });
        this.clones = [];
    }

    addToColumns() {
        const dayIds = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

        let currentDate = new Date(this.startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(this.endDate);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            const dayIndex = currentDate.getDay(); // 0 (Dimanche) à 6 (Samedi)
            const dayColumnId = dayIds[dayIndex];
            const dayColumn = document.getElementById(dayColumnId);

            if (dayColumn) {
                const eventClone = this.eventSlot.cloneNode(true);
                eventClone.style.position = 'absolute';

                this.clones.push(eventClone);

                // Associer les événements au clone
                this.initEvents(eventClone);

                dayColumn.appendChild(eventClone);
            }

            // Passer au jour suivant
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    updateClonesPosition() {
        const hourHeight = 50; // Chaque heure correspond à 50px
        const dayIds = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

        let currentDate = new Date(this.startDate);
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(this.endDate);
        endDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < this.clones.length; i++) {
            const clone = this.clones[i];

            let startPixel, heightPixel;

            if (currentDate.getTime() === this.startDate.getTime()) {
                // Premier jour
                startPixel = this.startTime * hourHeight;
                heightPixel = (24 - this.startTime) * hourHeight;
            } else if (currentDate.getTime() === this.endDate.getTime()) {
                // Dernier jour
                startPixel = 0;
                heightPixel = this.endTime * hourHeight;
            } else {
                // Jours intermédiaires
                startPixel = 0;
                heightPixel = 24 * hourHeight;
            }

            clone.style.top = `${startPixel}px`;
            clone.style.height = `${heightPixel}px`;

            // Gestion des chevauchements
            const overlappingCreneaux = this.planning.checkOverlap(this, currentDate);
            const totalCreneaux = overlappingCreneaux.length + 1; // Inclure le créneau courant
            const widthPercentage = 100 / totalCreneaux;
            const index = overlappingCreneaux.indexOf(this);

            clone.style.width = `${widthPercentage}%`;
            clone.style.left = `${widthPercentage * index}%`;

            // Passer au jour suivant
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    updateContent() {
        // Afficher le motif et les dates dans le créneau
        this.eventSlot.innerHTML = `
            <div class="top-text">${this.motif}</div>
            <div class="event-date">${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}</div>
        `;
    }

    formatDate(date) {
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
    }

    addResizeHandles() {
        const topHandle = document.createElement('div');
        topHandle.classList.add('resize-handle', 'top-handle');

        const bottomHandle = document.createElement('div');
        bottomHandle.classList.add('resize-handle', 'bottom-handle');

        this.eventSlot.appendChild(topHandle);
        this.eventSlot.appendChild(bottomHandle);
    }

    initEvents(clone) {
        // Déplacement du créneau
        clone.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) return;

            e.preventDefault();

            let isDragging = true;
            const initialY = e.clientY;
            const initialTop = parseFloat(clone.style.top) || 0;

            const onMouseMove = (e) => {
                if (!isDragging) return;
                const deltaY = e.clientY - initialY;
                const newTop = initialTop + deltaY;

                const hourHeight = 50;
                const newStartTime = newTop / hourHeight;

                // Mettre à jour le startTime
                this.startTime = newStartTime;
                this.updatePosition();
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                this.planning.saveCreneau(this);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Redimensionnement
        const topHandle = clone.querySelector('.top-handle');
        const bottomHandle = clone.querySelector('.bottom-handle');

        this.initResizeEvents(topHandle, 'top', clone);
        this.initResizeEvents(bottomHandle, 'bottom', clone);
    }

    initResizeEvents(handle, handleType, clone) {
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();

            let isResizing = true;
            const initialY = e.clientY;
            const initialHeight = clone.offsetHeight;
            const initialTop = clone.offsetTop;
            const hourHeight = 50;

            const onMouseMove = (e) => {
                if (!isResizing) return;
                const deltaY = e.clientY - initialY;

                if (handleType === 'bottom') {
                    const newHeight = initialHeight + deltaY;
                    if (newHeight > 20) {
                        // Mettre à jour endTime
                        const newEndTime = this.startTime + (newHeight / hourHeight);
                        this.endTime = newEndTime;
                        this.updatePosition();
                    }
                } else if (handleType === 'top') {
                    const newTop = initialTop + deltaY;
                    const newHeight = initialHeight - deltaY;
                    if (newHeight > 20 && newTop >= 0) {
                        // Mettre à jour startTime
                        const newStartTime = newTop / hourHeight;
                        this.startTime = newStartTime;
                        this.updatePosition();
                    }
                }
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                this.planning.saveCreneau(this);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

window.Creneau = Creneau;

// Planning.js

class Planning {
    constructor() {
        this.creneaux = []; // Tableau pour stocker tous les créneaux

        this.initEventHandlers();
    }

    initEventHandlers() {
        // Gérer le clic sur les colonnes de jour pour créer un nouveau créneau
        const dayColumns = document.querySelectorAll('.day-column');

        dayColumns.forEach((dayColumn) => {
            dayColumn.addEventListener('click', (e) => {
                // Éviter de déclencher l'événement lors du clic sur un créneau existant
                if (e.target !== dayColumn) return;

                // Calculer l'heure de début en fonction de la position du clic
                const rect = dayColumn.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const startTime = y / 50; // Supposant que chaque heure fait 50px
                const duration = 1; // Durée initiale par défaut (1 heure)

                const dayColumnId = dayColumn.id;

                // Créer un nouveau créneau
                const creneau = new Creneau(dayColumnId, startTime, duration);

                // Ajouter le créneau au tableau
                this.creneaux.push(creneau);

                // Afficher le formulaire popup pour saisir le motif
                this.showMotifPopup(creneau);

                // Initialiser les événements pour ce créneau
                this.initCreneauEvents(creneau);
            });
        });
    }

    showMotifPopup(creneau) {
        // Créer un formulaire popup pour saisir le motif
        const popup = document.createElement('div');
        popup.classList.add('popup-form');

        const form = document.createElement('form');

        const label = document.createElement('label');
        label.textContent = 'Entrez le motif:';
        const input = document.createElement('input');
        input.type = 'text';
        input.required = true;

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'OK';

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(submitButton);

        popup.appendChild(form);
        document.body.appendChild(popup);

        // Centrer le popup
        popup.style.top = `${window.innerHeight / 2 - popup.offsetHeight / 2}px`;
        popup.style.left = `${window.innerWidth / 2 - popup.offsetWidth / 2}px`;

        // Gérer la soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const motif = input.value.trim();
            if (motif) {
                // Enregistrer le motif dans le créneau
                creneau.motif = motif;

                // Afficher le motif dans le créneau
                creneau.eventSlot.textContent = motif;

                // Supprimer le popup
                document.body.removeChild(popup);

                // Sauvegarder le créneau dans la base de données
                this.saveCreneau(creneau);
            }
        });
    }

    initCreneauEvents(creneau) {
        const eventSlot = creneau.eventSlot;

        // Ajouter des handles pour le redimensionnement
        const topHandle = document.createElement('div');
        topHandle.classList.add('resize-handle', 'top-handle');
        const bottomHandle = document.createElement('div');
        bottomHandle.classList.add('resize-handle', 'bottom-handle');

        eventSlot.appendChild(topHandle);
        eventSlot.appendChild(bottomHandle);

        // Ajouter les événements pour le redimensionnement
        this.initResizeEvents(creneau, topHandle, 'top');
        this.initResizeEvents(creneau, bottomHandle, 'bottom');

        // Ajouter les événements pour le déplacement (glisser-déposer)
        this.initDragEvents(creneau);
    }

    initResizeEvents(creneau, handle, handleType) {
        let isResizing = false;
        let initialY = 0;
        let initialHeight = 0;
        let initialTop = 0;

        const onMouseMove = (e) => {
            if (!isResizing) return;
            const deltaY = e.clientY - initialY;

            if (handleType === 'bottom') {
                const newHeight = initialHeight + deltaY;
                if (newHeight > 20) { // Hauteur minimale
                    creneau.duration = newHeight / 50; // Mettre à jour la durée
                    creneau.updatePosition();
                }
            } else if (handleType === 'top') {
                const newTop = initialTop + deltaY;
                const newHeight = initialHeight - deltaY;
                if (newHeight > 20 && newTop >= 0) {
                    creneau.startTime = newTop / 50; // Mettre à jour l'heure de début
                    creneau.duration = newHeight / 50;
                    creneau.updatePosition();
                }
            }
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Sauvegarder les modifications dans la base de données
            this.saveCreneau(creneau);
        };

        const onMouseDown = (e) => {
            e.stopPropagation();
            isResizing = true;
            initialY = e.clientY;
            initialHeight = creneau.eventSlot.offsetHeight;
            initialTop = creneau.eventSlot.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);
    }

    initDragEvents(creneau) {
        const eventSlot = creneau.eventSlot;

        let isDragging = false;
        let initialX = 0;
        let initialY = 0;
        let initialTop = 0;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - initialX;
            const deltaY = e.clientY - initialY;

            const newTop = initialTop + deltaY;

            // Mettre à jour la position verticale
            eventSlot.style.top = `${newTop}px`;

            // Vérifier si le créneau a été déplacé vers une autre colonne de jour
            const dayColumns = document.querySelectorAll('.day-column');
            dayColumns.forEach((dayColumn) => {
                const rect = dayColumn.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right) {
                    if (creneau.dayColumnId !== dayColumn.id) {
                        // Retirer de l'ancienne colonne
                        const oldDayColumn = document.getElementById(creneau.dayColumnId);
                        oldDayColumn.removeChild(eventSlot);

                        // Ajouter à la nouvelle colonne
                        dayColumn.appendChild(eventSlot);

                        // Mettre à jour l'ID de la colonne du jour du créneau
                        creneau.dayColumnId = dayColumn.id;
                    }
                }
            });

            // Mettre à jour l'heure de début en fonction de la nouvelle position
            creneau.startTime = newTop / 50;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // Sauvegarder les modifications dans la base de données
            this.saveCreneau(creneau);
        };

        const onMouseDown = (e) => {
            // Éviter de commencer le déplacement lors du clic sur les handles de redimensionnement
            if (e.target.classList.contains('resize-handle')) return;

            e.preventDefault();
            isDragging = true;
            initialX = e.clientX;
            initialY = e.clientY;
            initialTop = eventSlot.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        eventSlot.addEventListener('mousedown', onMouseDown);
    }

    saveCreneau(creneau) {
        // Sauvegarder le créneau dans la base de données
        db.saveCreneau(creneau);
    }

    loadCreneaux() {
        // Charger les créneaux depuis la base de données
        db.getCreneaux().then((creneauxData) => {
            creneauxData.forEach((data) => {
                const creneau = new Creneau(data.dayColumnId, data.startTime, data.duration);
                creneau.id = data.id;
                creneau.motif = data.motif;
                creneau.eventSlot.textContent = data.motif;

                this.creneaux.push(creneau);
                this.initCreneauEvents(creneau);
            });
        });
    }
}

// Attacher la classe Planning à l'objet global window
window.Planning = Planning;

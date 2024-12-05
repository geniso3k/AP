// Planning.js

class Planning {
    constructor() {
        this.creneaux = [];
        this.creationMode = 'form'; // 'form' ou 'graphical'

        this.initEventHandlers();
    }

    initEventHandlers() {
        const dayColumns = document.querySelectorAll('.day-column');

        dayColumns.forEach((dayColumn) => {
            if (this.creationMode === 'form') {
                dayColumn.addEventListener('click', (e) => this.handleDayColumnClickForm(e));
            } else if (this.creationMode === 'graphical') {
                dayColumn.addEventListener('mousedown', (e) => this.handleDayColumnMouseDown(e));
            }
        });

        // Gestion du bouton pour changer de mode
        document.getElementById('toggle-mode').addEventListener('click', () => {
            if (this.creationMode === 'form') {
                this.creationMode = 'graphical';
                document.getElementById('toggle-mode').textContent = 'Mode Formulaire';
            } else {
                this.creationMode = 'form';
                document.getElementById('toggle-mode').textContent = 'Mode Graphique';
            }

            // Réinitialiser les écouteurs d'événements
            this.initEventHandlers();
        });
    }

    handleDayColumnClickForm(e) {
        const dayColumn = e.currentTarget;

        const rect = dayColumn.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hourHeight = 50;
        const startTime = y / hourHeight;
        const duration = 1;

        this.showMotifPopup(startTime, startTime + duration);
    }

    handleDayColumnMouseDown(e) {
        const dayColumn = e.currentTarget;
        const rect = dayColumn.getBoundingClientRect();
        const startY = e.clientY - rect.top;
        const hourHeight = 50;
        let isCreating = true;

        const tempEvent = document.createElement('div');
        tempEvent.classList.add('event-slot');
        tempEvent.style.top = `${startY}px`;
        tempEvent.style.height = '0px';
        dayColumn.appendChild(tempEvent);

        const onMouseMove = (e) => {
            if (!isCreating) return;
            const currentY = e.clientY - rect.top;
            const height = currentY - startY;
            tempEvent.style.height = `${height}px`;
        };

        const onMouseUp = (e) => {
            isCreating = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const endY = e.clientY - rect.top;
            const startTime = startY / hourHeight;
            const endTime = endY / hourHeight;

            // Ouvrir le formulaire popup avec les valeurs pré-remplies
            this.showMotifPopup(startTime, endTime);

            // Retirer l'élément temporaire
            dayColumn.removeChild(tempEvent);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }



    showMotifPopup(startTime, duration, existingCreneau = null) {
        // Créer une superposition pour le fond
        const overlay = document.createElement('div');
        overlay.classList.add('popup-overlay');
        document.body.appendChild(overlay);

        // Créer le formulaire popup
        const popup = document.createElement('div');
        popup.classList.add('popup-form');

        const form = document.createElement('form');

        // Champ pour le motif
        const motifLabel = document.createElement('label');
        motifLabel.textContent = 'Motif :';
        const motifInput = document.createElement('input');
        motifInput.type = 'text';
        motifInput.required = true;
        if (existingCreneau) {
            motifInput.value = existingCreneau.motif;
        }

        // Champ pour la date de début
        const dateLabel = document.createElement('label');
        dateLabel.textContent = 'Date de début :';
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.required = true;

        // Champ pour la date de fin
        const endDateLabel = document.createElement('label');
        endDateLabel.textContent = 'Date de fin :';
        const endDateInput = document.createElement('input');
        endDateInput.type = 'date';
        endDateInput.required = true;

        // Champ pour l'heure de début
        const startTimeLabel = document.createElement('label');
        startTimeLabel.textContent = 'Heure de début :';
        const startTimeInput = document.createElement('input');
        startTimeInput.type = 'time';
        startTimeInput.required = true;

        // Champ pour l'heure de fin
        const endTimeLabel = document.createElement('label');
        endTimeLabel.textContent = 'Heure de fin :';
        const endTimeInput = document.createElement('input');
        endTimeInput.type = 'time';
        endTimeInput.required = true;

        // Si on modifie un créneau existant, pré-remplir les champs
        if (existingCreneau) {
            const existingStartDate = existingCreneau.startDate;
            const existingEndDate = existingCreneau.endDate;
            dateInput.value = existingStartDate.toISOString().split('T')[0];
            endDateInput.value = existingEndDate.toISOString().split('T')[0];
            startTimeInput.value = this.formatTime(existingCreneau.startTime);
            endTimeInput.value = this.formatTime(existingCreneau.startTime + existingCreneau.duration);
        } else {
            // Pré-remplir la date et l'heure en fonction de l'endroit cliqué
            const today = new Date();
            dateInput.value = today.toISOString().split('T')[0];
            endDateInput.value = dateInput.value;
            startTimeInput.value = this.formatTime(startTime);
            endTimeInput.value = this.formatTime(startTime + duration);
        }

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'OK';

        // Dans showMotifPopup

form.appendChild(motifLabel);
form.appendChild(motifInput);
form.appendChild(dateLabel);
form.appendChild(dateInput);
form.appendChild(endDateLabel);
form.appendChild(endDateInput);
form.appendChild(startTimeLabel);
form.appendChild(startTimeInput);
form.appendChild(endTimeLabel);
form.appendChild(endTimeInput);
form.appendChild(submitButton);

// ...


        popup.appendChild(form);
        document.body.appendChild(popup); // Ajouter le popup au body

        // Centrer le popup sur l'écran
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.zIndex = '1001'; // S'assurer qu'il est au-dessus de l'overlay

        // Gestion de la fermeture du popup
        overlay.addEventListener('click', () => {
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const motif = motifInput.value.trim();
            const dateValue = dateInput.value;
            const endDateValue = endDateInput.value;
            const startTimeValue = startTimeInput.value;
            const endTimeValue = endTimeInput.value;

            if (motif && dateValue && endDateValue && startTimeValue && endTimeValue) {
                // Convertir les heures en nombres décimaux
                const startTime = this.convertTimeToDecimal(startTimeValue);
                const endTime = this.convertTimeToDecimal(endTimeValue);
                const duration = endTime - startTime;

                if (duration <= 0) {
                    alert('L\'heure de fin doit être après l\'heure de début.');
                    return;
                }

                // Créer des objets Date pour les dates de début et de fin
                const startDateParts = dateValue.split('-');
                const startDate = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2]);

                const endDateParts = endDateValue.split('-');
                const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]);

                if (endDate < startDate) {
                    alert('La date de fin doit être après la date de début.');
                    return;
                }

                if (existingCreneau) {
                    existingCreneau.motif = motif;
                    existingCreneau.startDate = startDate;
                    existingCreneau.endDate = endDate;
                    existingCreneau.startTime = startTime;
                    existingCreneau.duration = duration;
                    existingCreneau.updatePosition();
                    existingCreneau.updateContent();
                    this.saveCreneau(existingCreneau);
                } else {
                    const creneau = new Creneau(startDate, endDate, startTime, duration, motif, this);

                    // Vérifier les chevauchements
                    const overlappingCreneaux = this.checkOverlap(creneau);
                    if (overlappingCreneaux.length >= 2) {
                        alert('Impossible de créer plus de deux créneaux au même moment.');
                        return;
                    }

                    this.creneaux.push(creneau);
                    this.saveCreneau(creneau);
                }
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });
    }

    formatTime(timeDecimal) {
        const hours = Math.floor(timeDecimal);
        const minutes = Math.round((timeDecimal - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    convertTimeToDecimal(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours + minutes / 60;
    }

    checkOverlap(creneau) {
        const overlappingCreneaux = this.creneaux.filter((other) => {
            if (other === creneau) return false;

            // Vérifier si les dates se chevauchent
            if (creneau.endDate < other.startDate || creneau.startDate > other.endDate) return false;

            // Vérifier si les heures se chevauchent
            const creneauStart = creneau.startTime;
            const creneauEnd = creneau.startTime + creneau.duration;
            const otherStart = other.startTime;
            const otherEnd = other.startTime + other.duration;

            return (creneauStart < otherEnd) && (creneauEnd > otherStart);
        });

        return overlappingCreneaux;
    }

    saveCreneau(creneau) {
        db.saveCreneau(creneau);
    }

    loadCreneaux() {
        db.getCreneaux().then((creneauxData) => {
            creneauxData.forEach((data) => {
                const creneau = new Creneau(
                    new Date(data.startDate),
                    new Date(data.endDate),
                    data.startTime,
                    data.duration,
                    data.motif,
                    this
                );
                creneau.id = data.id;
                this.creneaux.push(creneau);
            });
        });
    }
}

window.Planning = Planning;

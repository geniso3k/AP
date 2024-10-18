// DivCreator.js

class DivCreator {
    constructor(column, X, Y, shadowRoot, timeColumnHeight, shouldSave = true, eventData = null) {
        this.column = column;
        this.X = X;
        this.Y = Y;
        this.div = null;
        this.resizingFrom = null; // Détermine si on redimensionne par le bas ou le haut
        this.shadowRoot = shadowRoot; // Référence au shadowRoot
        this.timeColumnHeight = timeColumnHeight; // Hauteur totale de la colonne horaire
        this.minHeight = 17; // La hauteur minimale du div
        this.shouldSave = shouldSave; // Paramètre pour contrôler la sauvegarde
        this.motif = ''; // Stocke le motif de l'événement
        this.eventData = eventData; // Données de l'événement si chargé depuis le stockage local
        this.createDiv();
    }

    createDiv() {
        // Création de sousDiv
        this.sousDiv = document.createElement("div");
        this.sousDiv.classList.add("sousDiv");

        this.div = document.createElement("div");
        this.div.classList.add("event-slot");

        // Styles du div principal
        if (this.eventData) {
            // Si nous chargeons un événement existant
            this.div.style.backgroundColor = this.eventData.color;
            this.div.style.top = this.eventData.top;
            this.div.style.height = this.eventData.height;
            this.motif = this.eventData.motif || '';
        } else {
            // Nouvel événement
            this.div.style.backgroundColor = this.generateRandomColor();
            this.div.style.top = `${this.Y}px`;
            this.div.style.height = this.minHeight + "px";
            this.div.style.cursor = "grab";
        }

        this.div.addEventListener("click", (event) => {
            event.stopPropagation(); // Empêche l'événement click de se propager à la colonne
        });

        // Drag handles (pour redimensionner en haut ou en bas)
        let resizeHandleTop = document.createElement("div");
        resizeHandleTop.classList.add("resize-handle", "top-handle");
        resizeHandleTop.style.position = "absolute";
        resizeHandleTop.style.top = "0";
        resizeHandleTop.style.width = "100%";
        resizeHandleTop.style.height = "10px";
        resizeHandleTop.style.cursor = "n-resize";

        let resizeHandleBottom = document.createElement("div");
        resizeHandleBottom.classList.add("resize-handle", "bottom-handle");
        resizeHandleBottom.style.position = "absolute";
        resizeHandleBottom.style.bottom = "0";
        resizeHandleBottom.style.width = "100%";
        resizeHandleBottom.style.height = "10px";
        resizeHandleBottom.style.cursor = "s-resize";

        // Création de topText
        this.topText = document.createElement("div");
        this.topText.classList.add("top-text");

        // Ajout des éléments au div principal
        this.column.appendChild(this.div);
        this.div.appendChild(this.topText);
        this.div.appendChild(resizeHandleTop);
        this.div.appendChild(resizeHandleBottom);
        this.div.appendChild(this.sousDiv);

        this.addDivEvents(resizeHandleTop, resizeHandleBottom);

        // Calcule l'heure de début et de fin
        this.objDiv = new Heure(this.timeColumnHeight, this.div.offsetTop, this.div.offsetHeight);

        // Mettre à jour le texte affiché
        this.updateTopText();

        if (!this.eventData) {
            // Si c'est un nouvel événement, demander le motif
            this.changerMotif();
        }

        // Sauvegarder l'événement si nécessaire
        if (this.shouldSave && !this.eventData) {
            this.saveEvent();
        } else if (this.eventData) {
            // Attribuer l'ID de l'événement
            this.div.dataset.eventId = this.eventData.id;
        }
    }

    generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    saveEvent() {
        // Obtenir la date associée à la colonne
        const dateString = this.column.dataset.date; // Date au format YYYY-MM-DD

        // Obtenir les informations de l'événement
        const eventData = {
            id: this.generateUniqueId(),
            dayId: this.column.id,
            date: dateString, // Ajouter la date
            top: this.div.style.top,
            height: this.div.style.height,
            color: this.div.style.backgroundColor,
            motif: this.motif, // Ajouter le motif
            // Autres informations si nécessaire
        };

        let events = JSON.parse(localStorage.getItem('events')) || [];

        events.push(eventData);

        localStorage.setItem('events', JSON.stringify(events));

        this.div.dataset.eventId = eventData.id;
    }

    updateEventInStorage() {
        const eventId = this.div.dataset.eventId;
        let events = JSON.parse(localStorage.getItem('events')) || [];

        const eventIndex = events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
            // Mettre à jour les informations
            events[eventIndex].top = this.div.style.top;
            events[eventIndex].height = this.div.style.height;
            events[eventIndex].motif = this.motif; // Mettre à jour le motif
            // Autres mises à jour si nécessaire

            // Sauvegarder les modifications
            localStorage.setItem('events', JSON.stringify(events));
        }
    }

    deleteEventFromStorage() {
        const eventId = this.div.dataset.eventId;
        let events = JSON.parse(localStorage.getItem('events')) || [];

        // Filtrer l'événement à supprimer
        events = events.filter(event => event.id !== eventId);

        // Sauvegarder les modifications
        localStorage.setItem('events', JSON.stringify(events));
    }

    generateRandomColor() {
        let rndm = Math.floor(Math.random() * 999999) + 100000;
        return "#" + rndm;
    }

    addDivEvents(resizeHandleTop, resizeHandleBottom) {
        // Clic droit pour supprimer le div
        this.div.addEventListener("contextmenu", (event) => {
            this.div.remove();
            // Supprimer du Local Storage
            this.deleteEventFromStorage();
            event.preventDefault();
            return false;
        });

        // Redimensionnement par le haut
        resizeHandleTop.addEventListener("mousedown", (down) => {
            this.resizingFrom = "top";
            this.handleMouseDown(down);
        });

        // Redimensionnement par le bas
        resizeHandleBottom.addEventListener("mousedown", (down) => {
            this.resizingFrom = "bottom";
            this.handleMouseDown(down);
        });

        this.div.addEventListener("mousedown", (down) => {
            if (!down.target.classList.contains("resize-handle")) {
                this.resizingFrom = "center";
                this.handleMouseDown(down);
            }
        });

        this.div.addEventListener("dblclick", (event) => {
            event.stopPropagation();
            this.changerMotif();
        });
    }

    changerMotif() {
        // Demander à l'utilisateur d'entrer un nouveau motif
        const nouveauMotif = prompt("Entrez le motif de l'événement :");

        // Si l'utilisateur entre un texte
        if (nouveauMotif && nouveauMotif.trim() !== "") {
            // Mettre à jour le motif dans l'instance
            this.motif = nouveauMotif;
            this.updateTopText();

            // Sauvegarder la modification dans le stockage local
            this.updateEventInStorage();
        }
    }

    updateTopText() {
        if (this.objDiv) {
            this.topText.innerHTML = `Début : <b>${this.objDiv.calculTop()}</b> - Fin : <b>${this.objDiv.calculHeight()}</b><br>Motif : ${this.motif || 'Pas de motif (double-cliquez pour modifier)'}`;
            this.sousDiv.innerHTML = `Durée : <b>${this.objDiv.totalHeure()}</b>`;
        } else {
            this.topText.innerHTML = `Début : <b>...</b> - Fin : <b>...</b><br>Motif : ${this.motif || 'Pas de motif (double-cliquez pour modifier)'}`;
            this.sousDiv.innerHTML = `Durée : <b>...</b>`;
        }
    }

    handleMouseDown(down) {
        let initialY = down.clientY;
        let initialTop = this.div.offsetTop;
        let initialHeight = this.div.offsetHeight;
        const containerHeight = this.column.offsetHeight;

        // Fonction appelée pendant le déplacement de la souris
        const onMouseMove = (position) => {
            let currentY = position.clientY;
            let direction = currentY - initialY;

            // Gestion du redimensionnement ou du déplacement
            if (this.resizingFrom === "bottom") {
                if (direction >= 0) {
                    // Redimensionnement vers le bas
                    let newHeight = initialHeight + direction;
                    if (newHeight + initialTop > containerHeight) {
                        newHeight = containerHeight - initialTop;
                    }
                    this.div.style.height = `${newHeight}px`;
                } else {
                    // Redimensionnement vers le haut depuis le bas
                    let newHeight = initialHeight + direction;
                    if (newHeight < this.minHeight) newHeight = this.minHeight;
                    this.div.style.height = `${newHeight}px`;
                }
            } else if (this.resizingFrom === "top") {
                if (direction <= 0) {
                    // Redimensionnement vers le haut
                    let newTop = initialTop + direction;
                    let newHeight = initialHeight - direction;
                    if (newTop < 0) {
                        newTop = 0;
                        newHeight = initialHeight + initialTop;
                    }
                    if (newHeight < this.minHeight) newHeight = this.minHeight;
                    this.div.style.top = `${newTop}px`;
                    this.div.style.height = `${newHeight}px`;
                } else {
                    // Redimensionnement vers le bas depuis le haut
                    let newHeight = initialHeight - direction;
                    if (newHeight < this.minHeight) newHeight = this.minHeight;
                    this.div.style.top = `${initialTop + direction}px`;
                    this.div.style.height = `${newHeight}px`;
                }
            } else if (this.resizingFrom === "center") {
                let newTop = initialTop + direction;
                if (newTop < 0) {
                    newTop = 0;
                }
                if (newTop + initialHeight > containerHeight) {
                    newTop = containerHeight - initialHeight;
                }
                this.div.style.top = `${newTop}px`;
            }

            // Met à jour les heures de début et de fin après modification
            this.objDiv.redefinirTop(this.div.offsetTop);
            this.objDiv.redefinirHeight(this.div.offsetHeight);
            this.updateTopText();
        };

        const onMouseUp = () => {
            this.updateEventInStorage();

            // Retirer les écouteurs
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        // Ajout des événements de déplacement et de relâchement
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}

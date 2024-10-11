class DivCreator {
    constructor(column, X, Y) {
        this.column = column; // La colonne où le div sera ajouté
        this.X = X; // Position X (coordonnée de la souris)
        this.Y = Y; // Position Y (coordonnée de la souris)
        this.div = null; // Référence au div créé
        this.isResizing = false; // Pour gérer le redimensionnement
        this.createDiv(); // Méthode pour créer le div
    }

    // Méthode de création du div
    createDiv() {
        this.div = document.createElement("div"); // Création du div
        this.div.innerHTML = "Je suis là"; // Contenu du div
        this.div.classList.add("event-slot"); // Ajout de la classe

        let sousDiv = document.createElement("div"); // Sous-div
        sousDiv.innerHTML = "Dans la div";
        sousDiv.classList.add("sousDiv");

        const rect = this.column.getBoundingClientRect(); // Position de la colonne

        // Positionne le div relativement à la colonne
        this.div.style.backgroundColor = this.generateRandomColor(); // Couleur aléatoire
        this.div.style.width = "100%";
        this.div.style.position = "absolute"; 
        this.div.style.top = `${this.Y - rect.top}px`; // Ajuste la position en fonction du clic
        this.div.style.minHeight = "35px"; // Hauteur minimale pour éviter un div trop petit

        // Ajoute le div à la colonne et le sous-div au div
        this.column.appendChild(this.div);
        this.div.appendChild(sousDiv);

        // Ajoute les événements spécifiques au div
        this.addDivEvents();
    }

    // Génère une couleur aléatoire
    generateRandomColor() {
        let rndm = Math.floor(Math.random() * 999999) + 100000;
        return "#" + rndm;
    }

    // Méthode pour ajouter les événements (clic droit pour supprimer, redimensionnement)
    addDivEvents() {
        // Suppression via clic droit
        this.div.addEventListener("contextmenu", (event) => {
            this.div.remove(); // Supprime le div
            event.preventDefault();
            return false;
        });

        // Redimensionnement via mousedown
        this.div.addEventListener("mousedown", (down) => {
            this.handleMouseDown(down);
        });

        // Empêche le clic pendant le redimensionnement
        this.div.addEventListener("click", (event) => {
            if (this.isResizing) {
                event.preventDefault(); // Annule l'événement click si redimensionnement
                this.isResizing = false; // Réinitialise après relâchement de la souris
            }
        });
    }

    // Méthode pour gérer le redimensionnement du div
    handleMouseDown(down) {
        let initialY = down.clientY; // Position initiale de la souris
        let initialTop = this.div.offsetTop; // Position initiale du div
        let initialHeight = this.div.offsetHeight; // Hauteur initiale du div
        this.isResizing = false;

        down.stopPropagation();

        // Fonction appelée pendant le déplacement de la souris
        const onMouseMove = (position) => {
            this.isResizing = true;
            let currentY = position.clientY; // Position actuelle de la souris

            // Vérifie si on redimensionne vers le bas ou le haut
            if (currentY > initialY) {
                // Redimension vers le bas
                let newHeight = initialHeight + (currentY - initialY);
                this.div.style.height = `${newHeight}px`;
                console.log("Redimension vers le bas");
                let tab = {
                    "height" : this.div.style.height,
                    "top" : this.div.style.top,
                    "newHeight" : newHeight,
                    "currentY" : currentY,
                    "initialY" : initialY
                };
                console.log(tab);
            } else {
                // Redimension vers le haut
                let newTop = initialTop - (initialHeight + (initialY - currentY) - initialHeight);
                if (newTop < 0) newTop = 0; // Empêche de sortir de la zone supérieure
                if(currentY < 129) currentY = 129;
                

                this.div.style.top = `${newTop}px`; // Ajuste le top pour bouger vers le haut
                this.div.style.height = initialY - currentY + 35 + "px";
                let tab = {
                    "height" : this.div.style.height,
                    "top" : this.div.style.top,
                    "newTop" : newTop,
                    "currentY" : currentY,
                    "initialY" : initialY
                };
                
                console.log(tab);
                console.log("Redimension vers le haut");
            }
        };

        // Arrête le redimensionnement quand la souris est relâchée
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        // Ajoute les événements de déplacement et de relâchement
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}

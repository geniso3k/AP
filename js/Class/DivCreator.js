class DivCreator {
    constructor(column, X, Y) {
        this.column = column;
        this.X = X;
        this.Y = Y;
        this.div = null;
        this.topText = null; // Propriété pour le texte du top
        this.sousDiv = null; // Propriété pour la sous-div
        this.resizingFrom = null; // Pour gérer le redimensionnement
        this.timeColumnHeight = null; // Hauteur de la colonne des heures
        this.createDiv();
        this.minHeight = 17; // la longueur minimum du div
    }

    createDiv() {
        // Sélectionne la colonne des heures avec la classe "time-column"
        let timeColumn = document.querySelector('.time-column');

        // Récupère la hauteur de la colonne
        this.timeColumnHeight = timeColumn.offsetHeight;

        this.div = document.createElement("div");
        this.div.classList.add("event-slot");

        // Sous div pour l'affichage des heures
        this.sousDiv = document.createElement("div");
        this.sousDiv.classList.add("sousDiv");

        const rect = this.column.getBoundingClientRect();
        this.div.style.backgroundColor = this.generateRandomColor();
        this.div.style.width = "100%";
        this.div.style.position = "absolute";
        this.div.style.top = `${this.Y - rect.top}px`;
        this.div.style.minHeight = this.minHeight + "px";

        // Ne remplace pas tout le contenu de this.div, modifie seulement le texte
        this.topText = document.createElement("div"); // Stocke topText dans this.topText
        this.topText.classList.add("top-text"); // Ajout d'une classe pour mieux styliser
        this.div.appendChild(this.topText); // Ajoute le texte du top

        // Modifie directement le texte de this.sousDiv
        this.div.appendChild(this.sousDiv); // Ajoute la sous-div dans le div principal

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

        this.div.appendChild(resizeHandleTop);
        this.div.appendChild(resizeHandleBottom);
        this.column.appendChild(this.div);

        this.addDivEvents(resizeHandleTop, resizeHandleBottom);

        // Calcule l'heure de début et de fin
        this.objDiv = new Heure(this.timeColumnHeight, this.div.offsetTop, this.div.offsetHeight);

        // Affiche l'heure de début et de fin sans écraser le contenu du div
        this.topText.innerHTML = "Début pour <b>" + this.objDiv.calculTop() + "</b> et fin pour <b>" + this.objDiv.calculHeight()+"</b>";
    }

    generateRandomColor() {
        let rndm = Math.floor(Math.random() * 999999) + 100000;
        return "#" + rndm;
    }

    addDivEvents(resizeHandleTop, resizeHandleBottom) {
        // Clic droit pour supprimer le div
        this.div.addEventListener("contextmenu", (event) => {
            this.div.remove();
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
    }

    handleMouseDown(down) {
        let initialY = down.clientY;
        let initialTop = this.div.offsetTop;
        let initialHeight = this.div.offsetHeight;
        const containerHeight = this.column.offsetHeight;
    
        document.onselectstart = (e) => { e.preventDefault() }
    
        const onMouseMove = (position) => {
            let currentY = position.clientY;
            let direction = currentY - initialY;
    
            // Si on redimensionne par le bas
            if (this.resizingFrom === "bottom") {
                if (direction >= 0) {
                    let newHeight = initialHeight + direction;
                    if (newHeight + initialTop > containerHeight) {
                        newHeight = containerHeight - initialTop;
                    }
                    this.div.style.height = `${newHeight}px`;
                } else {
                    let newHeight = initialHeight + direction;
                    if (newHeight < this.minHeight) newHeight = this.minHeight;
                    this.div.style.height = `${newHeight}px`;
                }
            }
    
            // Si on redimensionne par le haut
            if (this.resizingFrom === "top") {
                if (direction <= 0) {
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
                    let newHeight = initialHeight - direction;
                    if (newHeight < this.minHeight) newHeight = this.minHeight;
                    this.div.style.top = `${initialTop + direction}px`;
                    this.div.style.height = `${newHeight}px`;
                }
            }
    
            // Met à jour les heures de début et de fin après redimensionnement
            this.objDiv.redefinirTop(this.div.offsetTop);
            this.objDiv.redefinirHeight(this.div.offsetHeight);
            this.topText.innerHTML = "Début pour <b>" + this.objDiv.calculTop() + "</b> et fin pour <b>" + this.objDiv.calculHeight()+"</b>";
        };
    
        const onMouseUp = () => {
            ignoreNextClick = true;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    
}

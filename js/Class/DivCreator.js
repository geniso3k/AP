// DivCreator.js

class DivCreator {
    constructor(column, X, Y) {
        this.column = column;
        this.X = X;
        this.Y = Y;
        this.div = null;
        this.resizingFrom = null; // Détermine si on redimensionne par le bas ou le haut
        this.createDiv();
    }

    createDiv() {
        this.div = document.createElement("div");
        this.div.innerHTML = "Je suis là";
        this.div.classList.add("event-slot");

        let sousDiv = document.createElement("div");
        sousDiv.innerHTML = "Dans la div";
        sousDiv.classList.add("sousDiv");

        const rect = this.column.getBoundingClientRect();
        this.div.style.backgroundColor = this.generateRandomColor();
        this.div.style.width = "100%";
        this.div.style.position = "absolute";
        this.div.style.top = `${this.Y - rect.top}px`;
        this.div.style.minHeight = "35px";

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

        this.div.appendChild(resizeHandleTop);
        this.div.appendChild(resizeHandleBottom);
        this.div.appendChild(sousDiv);
        this.column.appendChild(this.div);

        this.addDivEvents(resizeHandleTop, resizeHandleBottom);
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
        

        // Empêche la création d'un autre div ou d'autres comportements de la souris


        // Fonction appelée pendant le déplacement de la souris
        const onMouseMove = (position) => {
            let currentY = position.clientY;
            let direction = currentY - initialY;

            // Si on redimensionne par le bas
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
                    if (newHeight < 35) newHeight = 35; // Limite de hauteur minimale
                    this.div.style.height = `${newHeight}px`;
                }
            }

            // Si on redimensionne par le haut
            if (this.resizingFrom === "top") {
                if (direction <= 0) {
                    // Redimensionnement vers le haut (on bouge le top et on change la hauteur)
                    let newTop = initialTop + direction;
                    let newHeight = initialHeight - direction;
                    if (newTop < 0) {
                        newTop = 0;
                        newHeight = initialHeight + initialTop;
                    }
                    if (newHeight < 35) newHeight = 35; // Limite de hauteur minimale
                    this.div.style.top = `${newTop}px`;
                    this.div.style.height = `${newHeight}px`;
                } else {
                    // Si on essaie d'agrandir en partant du haut vers le bas, ajuster uniquement la hauteur
                    let newHeight = initialHeight - direction;
                    if (newHeight < 35) newHeight = 35; // Limite de hauteur minimale
                    this.div.style.top = `${initialTop + direction}px`; // Ajustement du top
                    this.div.style.height = `${newHeight}px`;
                }
            }
        };

        const onMouseUp = () => {

            ignoreNextClick = true; // Ignore le prochain clic (empêche la création d'un div)
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            // Empêche la création d'un autre div lorsque l'utilisateur relâche la souris

        };

        // Ajout des événements de déplacement et de relâchement
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}

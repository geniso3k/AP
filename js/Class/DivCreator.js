class DivCreator {
    constructor(column, X, Y) {
        this.column = column; 
        this.X = X; 
        this.Y = Y; 
        this.div = null; 
        this.isResizing = false; 
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
        
        this.column.appendChild(this.div);
        this.div.appendChild(sousDiv);

        this.addDivEvents();
    }

    generateRandomColor() {
        let rndm = Math.floor(Math.random() * 999999) + 100000;
        return "#" + rndm;
    }

    addDivEvents() {
        this.div.addEventListener("contextmenu", (event) => {
            this.div.remove(); 
            event.preventDefault();
            return false;
        });

        this.div.addEventListener("mousedown", (down) => {
            this.handleMouseDown(down);
        });

        this.div.addEventListener("click", (event) => {
            if (this.isResizing) {
                event.preventDefault(); 
                this.isResizing = false;
            }
        });
    }

    handleMouseDown(down) {
        let initialY = down.clientY; 
        let initialTop = this.div.offsetTop; 
        let initialHeight = this.div.offsetHeight; 
        const containerHeight = this.column.offsetHeight; // Hauteur du conteneur parent
        this.isResizing = false;

        down.stopPropagation();

        const onMouseMove = (position) => {
            this.isResizing = true;
            let currentY = position.clientY;

            if (currentY > initialY) {
                // Redimension vers le bas
                let newHeight = initialHeight + (currentY - initialY);
                // Vérifie que la hauteur ne dépasse pas la hauteur du conteneur
                if (newHeight + initialTop > containerHeight) {
                    newHeight = containerHeight - initialTop;
                }
                this.div.style.height = `${newHeight}px`;

            } else {
                // Redimension vers le haut
                let newTop = initialTop - (initialY - currentY);
                // Limiter la position du haut à 0 (pour ne pas sortir du conteneur)
                if (newTop < 0) {
                    newTop = 0;
                }
                let newHeight = initialHeight + (initialTop - newTop);

                // Limite pour la hauteur minimale
                if (newHeight < 35) {
                    newHeight = 35;
                    newTop = initialTop + (initialHeight - newHeight);
                }

                this.div.style.top = `${newTop}px`; 
                this.div.style.height = `${newHeight}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
}

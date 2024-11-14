class Evenement {
    constructor(startY, startX, parentElement) {
        this.startY = startY;
        this.startX = startX;
        this.endY = startY;
        this.parentElement = parentElement;
        this.height = Math.abs(this.endY - this.startY);
        this.top = Math.min(this.startY, this.endY);
        this.left = 0;
        this.redimensionnement = null;
        this.columns = [];
        this.divs = [];

        this.div = this.creeObjetHtml();
    }

    ajouterJour(jours, heures = {debut: 0, fin: null}){
        jours.forEach((jour, index) =>{
            if (this.columns.includes(jour)) return;
            
            const hauteurTotale = jour.getBoundingClientRect().height;

            const topDiv = heures.debut ? (heures.debut / 24) * hauteurTotale : 0;

            const hauteurDiv = heures.fin ? 
            ((heures.fin - (heures.debut || 0)) / 24) * hauteurTotale
            : 
            hauteurTotale - topDiv;

            if(index != 0){

        const nouvelleDiv = document.createElement("div");
                nouvelleDiv.classList.add("event-slot");
                nouvelleDiv.style.position = "absolute";
                if(index+1 < jours.length && index != 0){
                    nouvelleDiv.style.height = "100%";
                }else{
                    nouvelleDiv.style.height = hauteurDiv + topDiv + "px";
                }
                nouvelleDiv.style.width = "100%";
                nouvelleDiv.style.backgroundColor = "rgba(0, 123, 255, 0.5)";
                nouvelleDiv.style.borderRadius = "4px";
                nouvelleDiv.setAttribute("id", index);
                nouvelleDiv.setAttribute("name","rien encore");
                jour.appendChild(nouvelleDiv);
                this.columns.push(jour);
                this.divs.push(nouvelleDiv);


            }else{
                this.div.style.height = "100%";
                
            }

            
             

            


            //fin foreach
            /*
            console.log("index : "+ index );
            console.dir("id : "+jour.id);
            console.log("=========");
*/
        });

    }

    creeObjetHtml() {
        const div = document.createElement("div");
        div.classList.add("event-slot");
        div.style.position = "absolute";
        div.style.top = this.top + "px";
        div.style.left = this.left + "px";
        div.style.width = "100%"; // Vous pouvez ajuster la largeur si nécessaire
        div.style.height = this.height + "px";
        div.style.backgroundColor = "rgba(0, 123, 255, 0.5)";
        div.style.borderRadius = "4px";
        div.classList.add("redimensionnement");
        div.style.minWidth = "20px";

        if(this.divs.length <= 0){

            this.poigneeHaut = document.createElement("div");
            this.poigneeHaut.classList.add("poigneeHaut");


            this.poigneeBas = document.createElement("div");
            this.poigneeBas.classList.add("poigneeBas");


            this.parentElement.appendChild(div);
            div.appendChild(this.poigneeHaut);
            div.appendChild(this.poigneeBas);
            this.ajouterEvenementsDiv(div, this.poigneeHaut, this.poigneeBas);
        }
        
        this.parentElement.appendChild(div);


        return div;
    }

    setHeight(newH) {
        this.div.style.height = newH + "px";
        this.height = newH;
    }

    setTop(newT) {
        this.div.style.top = newT + "px";
        this.top = newT;
    }

    setLeft(newL) {
        this.div.style.left = newL + "px";
        this.left = newL;
    }

    getHeight() {
        return this.div.style.height;
    }

    ajouterEvenementsDiv(divv, poigneeHaut, poigneeBas) {
        const self = this;
        let rect = self.parentElement.getBoundingClientRect();
        let initialTop, initialHeight, offsetY, offsetX, initialLeft;

        const onMouseMove = (event) => {
            const currentY = event.clientY - rect.top;
            const currentX = event.clientX - rect.left;
            const directionY = currentY - self.startY;
            const directionX = currentX - self.startX;

            switch (self.redimensionnement) {
                case "haut": {
                    const nouveauTop = currentY - offsetY;
                    const newHeight = initialHeight + (initialTop - nouveauTop);

                    if (newHeight >= 20 && nouveauTop >= 0) {
                        self.setTop(nouveauTop);
                        self.setHeight(newHeight);
                    }
                    break;
                }
                case "bas": {
                    const newHeight = initialHeight + directionY;

                    if (newHeight >= 20 && (initialTop + newHeight) <= rect.height) {
                        self.setHeight(newHeight);
                    }
                    break;
                }
                case "centre": {
                    self.div.classList.add("dragging");
                    
                    const nouveauTop = currentY - offsetY;
                    const nouveauLeft = currentX - offsetX;
                    

                    if (nouveauTop >= 0 && (nouveauTop + self.height) <= rect.height) {
                        self.setTop(nouveauTop);
                    }

                    // Vérifier les limites horizontales
                    if (nouveauLeft >= 0 && (nouveauLeft + self.div.offsetWidth) <= self.parentElement.offsetWidth) {
                        self.setLeft(nouveauLeft);
                    }

                    // Détecter la colonne sous la souris
                    const elementSousLaSouris = document.elementFromPoint(event.clientX, event.clientY);
                    if (elementSousLaSouris && elementSousLaSouris.classList.contains("day-column") && elementSousLaSouris !== self.parentElement) {
                        // Changer le parent de la div
                        self.parentElement = elementSousLaSouris;
                        self.parentElement.appendChild(self.div);

                        // Mettre à jour rect pour le nouveau parent
                        rect = self.parentElement.getBoundingClientRect();

                        // Recalculer offsetX et offsetY pour le nouveau parent
                        self.startX = event.clientX - rect.left;
                        self.startY = event.clientY - rect.top;
                        offsetX = self.startX - self.left;
                        offsetY = self.startY - self.top;
                    }

                    break;
                }
                default:
                    break;
            }
        };

        const onMouseUp = () => {
            self.div.classList.remove("dragging");
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            self.redimensionnement = null;
        };

        poigneeHaut.addEventListener("mousedown", (down) => {
            self.redimensionnement = "haut";
            self.startY = down.clientY - rect.top;
            self.startX = down.clientX - rect.left;
            initialTop = self.top;
            initialHeight = self.height;
            offsetY = self.startY - initialTop;
            offsetX = self.startX - self.left;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        poigneeBas.addEventListener("mousedown", (down) => {
            self.redimensionnement = "bas";
            self.startY = down.clientY - rect.top;
            self.startX = down.clientX - rect.left;
            initialTop = self.top;
            initialHeight = self.height;
            // Pas besoin d'offsetY pour le redimensionnement vers le bas
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        divv.addEventListener("mousedown", (down) => {
            if (!down.target.classList.contains("poigneeHaut") && !down.target.classList.contains("poigneeBas")) {
                self.redimensionnement = "centre";
                self.startY = down.clientY - rect.top;
                self.startX = down.clientX - rect.left;
                initialTop = self.top;
                initialLeft = self.left;
                offsetY = self.startY - initialTop;
                offsetX = self.startX - initialLeft;
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }
        });
    }
}

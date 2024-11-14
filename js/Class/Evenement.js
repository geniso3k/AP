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
        this.supprimage = false;

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
                nouvelleDiv.setAttribute("name","rien encore");
                jour.appendChild(nouvelleDiv);
                this.columns.push(jour);
                this.divs.push(nouvelleDiv);


                if(index+1 === jours.length){
                    this.lancerTest();
                    let poigneeBasNvl = document.createElement("div");
                    poigneeBasNvl.classList.add("poigneeBas");
                    nouvelleDiv.appendChild(poigneeBasNvl);
                    this.ajouterEvenementsDiv(nouvelleDiv, null, poigneeBasNvl);
    
    
                }


            }else{
                // Vérifier que la hauteur ne dépasse pas celle du conteneur
                const parentHeight = this.parentElement.getBoundingClientRect().height;
                const calculatedHeight = parentHeight - topDiv;

                // Appliquer la hauteur limitée
                this.div.style.height = calculatedHeight + "px";
                this.height = calculatedHeight;
                
            }


        });

    }
    lancerTest(){
        //lancement test console.log("lancement test");
        if(this.divs.length > 0){
            this.poigneeBas.remove();
            this.supprimage = true;
        }
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
        div.style.minWidth = "20px";

        

            this.poigneeHaut = document.createElement("div");
            this.poigneeHaut.classList.add("poigneeHaut");


            this.poigneeBas = document.createElement("div");
            this.poigneeBas.classList.add("poigneeBas");


            this.parentElement.appendChild(div);
            div.appendChild(this.poigneeHaut);
            div.appendChild(this.poigneeBas);
            this.ajouterEvenementsDiv(div, this.poigneeHaut, this.poigneeBas);

        
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
        let rect = divv.parentElement.getBoundingClientRect();
        let initialTop, initialHeight, offsetY, offsetX, initialLeft;
    
        const setHeight = (newH) => {
            divv.style.height = newH + "px";
        };
    
        const setTop = (newT) => {
            divv.style.top = newT + "px";
        };
    
        const getHeight = () => {
            return parseFloat(divv.style.height) || divv.getBoundingClientRect().height;
        };
    
        const getTop = () => {
            return parseFloat(divv.style.top) || 0;
        };
    
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
                        setTop(nouveauTop);
                        setHeight(newHeight);
                    }
                    break;
                }
                case "bas": {
                    const newHeight = initialHeight + directionY;
    
                    if (newHeight >= 20 && (initialTop + newHeight) <= rect.height) {
                        setHeight(newHeight);
                    }
                    break;
                }
                case "centre": {
                    divv.classList.add("dragging");
                    
                    const nouveauTop = currentY - offsetY;
                    const nouveauLeft = currentX - offsetX;
                    
                    if (nouveauTop >= 0 && (nouveauTop + getHeight()) <= rect.height) {
                        setTop(nouveauTop);
                    }
    
                    if (nouveauLeft >= 0 && (nouveauLeft + divv.offsetWidth) <= divv.parentElement.offsetWidth) {
                        divv.style.left = nouveauLeft + "px";
                    }
    
                    const elementSousLaSouris = document.elementFromPoint(event.clientX, event.clientY);
                    if (elementSousLaSouris && elementSousLaSouris.classList.contains("day-column") && elementSousLaSouris !== divv.parentElement) {
                        elementSousLaSouris.appendChild(divv);
                        
    
                        rect = divv.parentElement.getBoundingClientRect();
    
                        self.startX = event.clientX - rect.left;
                        self.startY = event.clientY - rect.top;
                        offsetX = self.startX - (parseFloat(divv.style.left) || 0);
                        offsetY = self.startY - (parseFloat(divv.style.top) || 0);
                    }
    
                    break;
                }
                default:
                    break;
            }
        };
    
        const onMouseUp = () => {
            divv.classList.remove("dragging");
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            self.redimensionnement = null;
        };
    
        if (this.supprimage == false && poigneeHaut) {
            poigneeHaut.addEventListener("mousedown", (down) => {
                self.redimensionnement = "haut";
                rect = divv.parentElement.getBoundingClientRect();
                self.startY = down.clientY - rect.top;
                initialTop = getTop();
                initialHeight = getHeight();
                offsetY = self.startY - initialTop;
                offsetX = self.startX - (parseFloat(divv.style.left) || 0);
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        }
    
        if (poigneeBas) {
            poigneeBas.addEventListener("mousedown", (down) => {
                self.redimensionnement = "bas";
                rect = divv.parentElement.getBoundingClientRect();
                self.startY = down.clientY - rect.top;
                initialTop = getTop();
                initialHeight = getHeight();
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        }
    
        divv.addEventListener("mousedown", (down) => {
            if (this.supprimage == false){
                if (!down.target.classList.contains("poigneeHaut") && !down.target.classList.contains("poigneeBas")) {
                    self.redimensionnement = "centre";
                    rect = divv.parentElement.getBoundingClientRect();
                    self.startY = down.clientY - rect.top;
                    self.startX = down.clientX - rect.left;
                    initialTop = getTop();
                    initialLeft = parseFloat(divv.style.left) || 0;
                    offsetY = self.startY - initialTop;
                    offsetX = self.startX - initialLeft;
                    document.addEventListener("mousemove", onMouseMove);
                    document.addEventListener("mouseup", onMouseUp);
                }
            }
        });
    }
}
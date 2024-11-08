class Evenement{
    constructor(startY, parentElement){
        this.startY = startY;
        this.endY = startY;
        this.parentElement = parentElement;
        this.height = Math.abs(this.endY - this.startY);
        this.top = Math.min(this.startY, this.endY);
        this.div = this.creeObjetHtml();
        this.redimensionnement = null;
        this.poigneeHaut = null;
        this.poigneeBas = null;
    }




    creeObjetHtml(){
        const div = document.createElement("div");
        div.classList.add("event-slot"); // Ajout d'une classe pour les styles CSS de base
        div.style.position = "absolute";
        div.style.top = this.top + "px";
        div.style.width = "100%";
        div.style.height = this.height + "px";
        div.style.backgroundColor = "rgba(0, 123, 255, 0.5)"; // Couleur de fond par défaut
        div.style.borderRadius = "4px";
        div.classList.add("redimensionnement");

        this.poigneeHaut = document.createElement("div");
        this.poigneeHaut.classList.add("poigneeHaut");

        this.poigneeBas = document.createElement("div");
        this.poigneeBas.classList.add("poigneeBas");

        this.parentElement.appendChild(div);
        div.appendChild(this.poigneeHaut);
        div.appendChild(this.poigneeBas);

        this.ajouterEvenementsDiv(this.poigneeHaut, this.poigneeBas);



        return div;
    }

    setHeight(newH){

        this.div.style.height = newH +"px";

    }

    setTop(newT){

        this.div.style.top = newT + "px";

    }

    getHeight(){

        return this.div.style.height;

    }

    // Ajouter les événements liés à l'élément div
    ajouterEvenementsDiv(poigneeHaut, poigneeBas) {
        
            console.log("Mouse moving");

        const rect = this.parentElement.getBoundingClientRect();

        const onMouseMove = (move) => {
            const relativeY = move.clientY - rect.top;

            if (this.redimensionnement === "haut") {
                const newHeight = this.startY + this.height - relativeY;
                if (newHeight > 20) { // Hauteur minimale
                    this.setHeight(newHeight);
                    this.setTop(relativeY);
                }
            } else if (this.redimensionnement === "bas") {
                const newHeight = relativeY - this.startY;
                if (newHeight > 20) { // Hauteur minimale
                    this.setHeight(newHeight);
                }
            } else if (this.redimensionnement === "centre") {
                const offset = relativeY - this.startY;
                this.setTop(this.top + offset);
            }
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            this.redimensionnement = null;
        };

        // Redimensionnement par le haut
        this.poigneeHaut.addEventListener("mousedown", (down) => {
            this.redimensionnement = "haut";
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Redimensionnement par le bas
        this.poigneeBas.addEventListener("mousedown", (down) => {
            this.redimensionnement = "bas";
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Déplacement de l'événement (centre)
        this.div.addEventListener("mousedown", (down) => {
            if (!down.target.classList.contains("poigneeHaut") && !down.target.classList.contains("poigneeBas")) {
                this.redimensionnement = "centre";
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }
        });
    }


}
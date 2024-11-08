class Evenement{
    constructor(startY, parentElement){
        this.startY = startY;
        this.endY = startY;
        this.parentElement = parentElement;


        // Calcul des dimensions et position de la div
        this.height = Math.abs(this.endY - this.startY);
        this.top = Math.min(this.startY, this.endY);
        this.left = Math.min(this.startX, this.endX);

        //Création de la div
        this.div = this.creeObjetHtml();
    }




    creeObjetHtml(){
        const div = document.createElement("div");
        div.classList.add("event-slot"); // Ajout d'une classe pour les styles CSS de base

        // Styles de base pour la position et la taille
        div.style.position = "absolute";
        div.style.top = this.top + "px";
        div.style.left = this.left + "px";
        div.style.width = "100%";
        div.style.height = this.height + "px";
        div.style.backgroundColor = "rgba(0, 123, 255, 0.5)"; // Couleur de fond par défaut
        div.style.borderRadius = "4px";

        this.parentElement.appendChild(div);



        return div;
    }

    setHeight(newH){

        this.div.style.height = newH +"px";

    }


}
class Planning{
    constructor(){
        try{
            this.oldTab = JSON.parse(localStorage.getItem("tab"));
            this._tab = this.oldTab || [];
            
        }catch(e){
            console.warn("Erreur lors du chargement des évènements.");
            this._tab = [];
        }
        console.log(this.oldTab);
        if(this.oldTab){
            let div;
            this.oldTab.forEach(event => {
                
                div = new Evenement(event.startY, event.startX, event.parentId);
                div.div.style.height = event.height + "px";
                
            });

        }

    }

    get tab(){
        return this._tab;
    }
    set tab(t){
        this._tab.push(t);
        this.sauvegarder();
    }

    sauvegarder(){


        localStorage.setItem("tab", JSON.stringify(this._tab));
        console.log("Storage : "+localStorage.getItem("tab"));

    }

    suppEventIndex(i) {

        if (i >= 0 && i < this._tab.length) {

            this._tab.splice(i, 1); // Supprime 1 élément à l'index i

        } else {
            console.error("Index hors des limites !");
        }

        this.sauvegarder();
    }

    toutEvent(){

        return this._tab.length;


    }

    editDebut(d, i){

        const evenement = this._tab.find(event => event.id === parseInt(id));

        if (evenement) {
            evenement.debut = nouvelleValeur; // Mettre à jour la propriété `debut`
            this.sauvegarder(); // Sauvegarder les changements dans localStorage
            console.log(`Début de l'événement avec ID ${id} modifié à ${nouvelleValeur}`);
        } else {
            console.error(`Événement avec ID ${id} non trouvé.`);
        }
    }

    editFin(f, i){

        const evenement = this._tab.find(event => event.id === parseInt(id));

        if (evenement) {
            evenement.debut = nouvelleValeur; // Mettre à jour la propriété `debut`
            this.sauvegarder(); // Sauvegarder les changements dans localStorage
            console.log(`Début de l'événement avec ID ${id} modifié à ${nouvelleValeur}`);
        } else {
            console.error(`Événement avec ID ${id} non trouvé.`);
        }

    }


}
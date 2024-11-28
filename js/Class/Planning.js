class Planning {
    constructor() {
        this.currentWeek = this.viserLundi(); // Stocker la semaine courante
        this.loadEvents();
    }
    viserLundi() {
   return document.getElementById("current-week").innerText;
}

    loadEvents() {
        try {
            const storedEvents = localStorage.getItem(this.currentWeek);
            this._tab = storedEvents ? JSON.parse(storedEvents) : [];
        } catch (e) {
            console.warn("Erreur lors du chargement des évènements. " + e);
            this._tab = [];
        }
    }

    changeWeek(newWeek) {
        this.currentWeek = newWeek;
        this.loadEvents();
    }

    get tab() {
        return this._tab;
    }

    set tab(e) {
        this._tab.push(e);
        this.sauvegarder();
    }

    sauvegarder() {
        localStorage.setItem(this.currentWeek, JSON.stringify(this._tab));
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

        const evenement = this._tab.find(event => event.id === parseInt(i));

        if (evenement) {
            evenement.startX = d; // Mettre à jour la propriété `debut`
            this.sauvegarder(); // Sauvegarder les changements dans localStorage
            console.log(`Début de l'événement avec ID ${i} modifié à ${d}`);
        } else {
            console.error(`Événement avec ID ${i} non trouvé.`);
        }
    }

    editFin(f, i){

        const evenement = this._tab.find(event => event.id === parseInt(i));
        console.log(evenement);
        if (evenement) {
            evenement.startY = f; // Mettre à jour la propriété `debut`
            this.sauvegarder(); // Sauvegarder les changements dans localStorage
            console.log(`Début de l'événement avec ID ${i} modifié à ${f}`);
        } else {
            console.error(`Événement avec ID ${i} non trouvé.`);
        }

    }


}
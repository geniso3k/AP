class Heure{

    constructor(totalite, top, height){
        this.totalite = totalite;
        this.top = top;
        this.height = height;
    }

    redefinirTop(newTop){

        this.top = newTop;

    }
    redefinirHeight(newHeight){

        this.height = newHeight;

    }

    calculTop(){

        // Calcul de la proportion de la journée correspondant à la position du div
        let timeFraction = this.top / this.totalite; // Fraction du jour en fonction de la position top

        // Calcul des heures et des minutes
        let totalHeures = timeFraction * 24; // Total en heures décimales
        let heures = Math.floor(totalHeures); // Partie entière en heures
        let minutes = Math.floor((totalHeures - heures) * 60); // Partie décimale convertie en minutes

        return(heures + "h" + (minutes < 10 ? "0" : "") + minutes);

    }

    calculHeight(){
        // Calcul de la proportion de la journée correspondant à la position du div
        let timeFraction = (this.height+this.top) / this.totalite; // Fraction du jour en fonction de la position top

        // Calcul des heures et des minutes
        let totalHeures = timeFraction * 24; // Total en heures décimales
        let heures = Math.floor(totalHeures); // Partie entière en heures
        let minutes = Math.floor((totalHeures - heures) * 60); // Partie décimale convertie en minutes

        return(heures + "h" + (minutes < 10 ? "0" : "") + minutes);

    }


}
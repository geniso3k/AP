function Creneau(jour,mois,annee,heureDepart,heureFin, message){
    this.jour = jour;
    this.heureDepart = heureDepart;
    this.heureFin = heureFin;
    this.message = message;

    
}



Creneau.prototype.createDiv(message){
    let dateDepart = new Date(annee, mois, jour, heureDepart);
    let dateFin = new Date(annee, mois, jour, heureFin);


    this.creneau = document.createElement("div");
    this.creneau.style.position = "absolute";
    this.creneau.innerHTML(message);
    this.creneau.style.top = 
}

Creneau.prototype.moveTo = function(heureDepart, heureFin){
    this.heureDepart = heureDepart;
    this.heureFin = heureFin;
}

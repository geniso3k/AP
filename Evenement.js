class Evenement{
    constructor(id, libelle, dateHeureDebut, dateHeureFin, couleur){
        this.id = id;
        this.libelle = libelle;
        this.dateHeureDebut = dateHeureDebut;
        this.dateHeureFin = dateHeureFin;
        this.couleur = couleur;
    }

    get id(){
        return this.id;
    }

    creerObjetHtml(){

    }
}

class Creneau{
    constructor(jour,heureDebut,heureFin){
        this.jour = jour;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
    }
    
    creerObjetHtml(){

    }
}
class Planning{

}
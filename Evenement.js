class Evenement{
    #id ;
    #libelle;
    #dateHeureDebut;
    #dateHeureFin;
    #couleur;


    constructor(id, libelle, dateHeureDebut, dateHeureFin, couleur){
        this.#id = id;
        this.#libelle = libelle;
        this.#dateHeureDebut = dateHeureDebut;
        this.#dateHeureFin = dateHeureFin;
        this.#couleur = couleur;
        this.maListe = [];
    }

    ajouterElement(Creneau){
        this.maListe.push(Creneau);
    }

    get id(){
        return this.id;
    }

    afficherListe(){
        console.log(this.maListe);
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
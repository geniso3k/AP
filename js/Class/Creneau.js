//Class Creneau
class Creneau{
    static creneaux = [];
    constructor(id, motif, dateDebut, dateFin, heureDebut, heureFin){

        this.id = Creneau.creneaux.length;
        this.motif = motif;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.evenements = [];
        
    }



    static ajouterCreneaux(creneau) {

        if (creneau instanceof Creneau) {


            Creneau.creneaux.push(creneau);


        } else {


            console.error("L'objet ajouté n'est pas une instance de Creneau.");


        }
    }

    static voirCreneaux() {


        
        console.table(

            Creneau.creneaux.map(creneau => ({
                id: creneau.id,
                motif: creneau.motif,
                dateDebut: creneau.dateDebut,
                dateFin: creneau.dateFin,
                heureDebut: creneau.heureDebut,
                heureFin: creneau.heureFin,
                nombreEvenements: creneau.evenements.length, // Ajout du nombre d'événements
            }))


        );
        

    }

    ajouterEvenement(ev){

        // if (ev.date >= this.dateDebut && ev.date <= this.dateFin &&
          //  ev.heureDebut >= this.heureDebut && ev.heureFin <= this.heureFin) {
            this.evenements.push(ev);/*
        } else {
            console.error(
                `L'événement ne respecte pas les limites du créneau (${this.dateDebut} ${this.heureDebut} - ${this.dateFin} ${this.heureFin}).`
            );
        }*/

    }

    voirEvenements(){


        console.table(this.evenements);


    }

    set Motif(m){

        this.motif = m;
        

    }

    get Motif(){

        return this.motif;
    }
    

}
//Class Creneau
class Creneau{
    static creneaux = [];
    static evenements = 0;
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
            
            this.evenements.push(ev);
            /*
            
        } else {
            console.error(
                `L'événement ne respecte pas les limites du créneau (${this.dateDebut} ${this.heureDebut} - ${this.dateFin} ${this.heureFin}).`
            );
        }*/

    }
    trouverEvenementParId(eventId) {
        return this.evenements.find(ev => ev.id === eventId) || null;
    }



    voirEvenements(){


        console.table(this.evenements);


    }

    set Motif(newMotif){

        this.voirEvenements();

        this.motif = newMotif;

        this.evenements.forEach(event => {
            
            const div = document.querySelector(`.event-slot[data-id="${event.dataId}"]`);
            console.log(event.id);
            
            if (div) {
                const motifText = div.querySelector(".motif-text");
                if (motifText) {
                    motifText.textContent = newMotif; // Mise à jour du texte
                    console.log(`Motif mis à jour pour l'événement ${event.id} dans le DOM :`, newMotif, `sur la div ${div}`);
                } else {
                    console.warn("Aucun <p> trouvé pour cet événement dans le DOM.");
                }
            } else {
                console.warn("Aucune div trouvée pour l'événement avec ID :", event.id);
            }
        });

        

    }

    get Motif(){

        return this.motif;
    }
    

}
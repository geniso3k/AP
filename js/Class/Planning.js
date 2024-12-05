class Planning {

    constructor(){
        
        this.db = db;
        this.viserLundi();
            
    }

    /////

    viserLundi(){
        let lundi = document.getElementById("current-week").innerText;
        this.week = lundi;
        this.charger;
        return lundi;
    }



    

    /////

    ajouter(obj){

       let evenement = {
            semaine : this.week,
            div : {
                startX : obj.startX,
                startY : obj.startY,
                top : obj.top,
                height : obj.height,
                motif : obj.motif,
                parentId : obj.parentId
            }

       }
       ajouterEventsBDD(evenement.semaine, evenement.div);

    }

    /////

    charger(){

      
            // Utiliser querySelectorAll pour obtenir une NodeList statique
            let eventSlots = document.querySelectorAll(".event-slot");
        
            // Itérer et supprimer chaque élément
            eventSlots.forEach(element => {
                console.log("element supprimé" + element);
                element.remove(); // Supprimer l'élément
            });
            
      
                LireEventsBDD( (evenements) => {

                    evenements.forEach(evenement => {
                        let div;
                        if(evenement.semaine == this.week){
                            div = new Evenement(evenement.div.startY, evenement.div.startX, evenement.div.parentId);
                            div.setHeight(evenement.div.height);

                        }
                    });
                })


        }
    }



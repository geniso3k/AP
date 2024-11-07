// Evenement.js

class Evenement extends CreateurDiv {
    constructor(colonne, X, Y, shadowRoot, hauteurColonneTemps, shouldSave = true, donneesEvenement = null) {
        super(colonne, X, Y, shadowRoot, hauteurColonneTemps, shouldSave, donneesEvenement);
        this.motif = '';
        this.donneesEvenement = donneesEvenement;
        this.initialiserEvenement();
    }

    // Initialiser l'événement (chargement ou création)
    initialiserEvenement() {
        if (this.donneesEvenement) {
            // Charger les données existantes de l'événement
            this.motif = this.donneesEvenement.motif || '';
            this.div.dataset.eventId = this.donneesEvenement.id;
        } else {
            // Demander le motif pour un nouvel événement
            this.changerMotif();
        }

        // Mettre à jour le texte affiché (heure et motif)
        this.mettreAJourTopText();
    }

    // Méthode pour changer le motif de l'événement
    changerMotif() {
        const nouveauMotif = prompt("Entrez le motif de l'événement :");
        if (nouveauMotif && nouveauMotif.trim() !== "") {
            this.motif = nouveauMotif;
            this.mettreAJourTopText();
            this.mettreAJourEvenementDansStockage();
        }
    }

    // Mise à jour du texte affiché (heure de début/fin, motif)
    mettreAJourTopText() {
        if (this.objDiv) {
            this.topText.innerHTML = `Début : <b>${this.objDiv.calculTop()}</b> - Fin : <b>${this.objDiv.calculHeight()}</b><br>Motif : ${this.motif || 'Pas de motif (double-cliquez pour modifier)'}`;
            this.sousDiv.innerHTML = `Durée : <b>${this.objDiv.totalHeure()}</b>`;
        } else {
            this.topText.innerHTML = `Début : <b>...</b> - Fin : <b>...</b><br>Motif : ${this.motif || 'Pas de motif (double-cliquez pour modifier)'}`;
            this.sousDiv.innerHTML = `Durée : <b>...</b>`;
        }
    }



    // Sauvegarder l'événement dans le stockage local
    sauvegarderEvenement() {
        const dateString = this.colonne.dataset.date;
        const donneesEvenement = {
            id: this.genererIdUnique(),
            dayId: this.colonne.id,
            date: dateString,
            top: this.div.style.top,
            hauteur: this.div.style.height,  // Sauvegarder la hauteur
            couleur: this.div.style.backgroundColor,
            motif: this.motif || '',
        };

        let evenements = JSON.parse(localStorage.getItem('evenements')) || [];
        evenements.push(donneesEvenement);
        localStorage.setItem('evenements', JSON.stringify(evenements));
        this.div.dataset.eventId = donneesEvenement.id;
    }

    // Mettre à jour l'événement existant dans le stockage local
    mettreAJourEvenementDansStockage() {
        const eventId = this.div.dataset.eventId;
        let evenements = JSON.parse(localStorage.getItem('evenements')) || [];
        const eventIndex = evenements.findIndex(event => event.id === eventId);

        if (eventIndex !== -1) {
            evenements[eventIndex].top = this.div.style.top;
            evenements[eventIndex].hauteur = this.div.style.height;  // Mettre à jour la hauteur
            evenements[eventIndex].motif = this.motif || '';
            localStorage.setItem('evenements', JSON.stringify(evenements));
        }
    }

    // Supprimer l'événement du stockage local
    supprimerEvenementDuStockage() {
        const eventId = this.div.dataset.eventId;
        let evenements = JSON.parse(localStorage.getItem('evenements')) || [];
        evenements = evenements.filter(event => event.id !== eventId);
        localStorage.setItem('evenements', JSON.stringify(evenements));
    }

    // Ajouter les événements liés à l'élément div
    ajouterEvenementsDiv(poigneeRedimensionnementHaut, poigneeRedimensionnementBas) {
        // Redimensionnement par le haut
        poigneeRedimensionnementHaut.addEventListener("mousedown", (down) => {
            this.redimensionnementDepuis = "haut";
            this.gererMouseDown(down);
        });

        // Redimensionnement par le bas
        poigneeRedimensionnementBas.addEventListener("mousedown", (down) => {
            this.redimensionnementDepuis = "bas";
            this.gererMouseDown(down);
        });

        // Déplacement de l'événement
        this.div.addEventListener("mousedown", (down) => {
            if (!down.target.classList.contains("resize-handle")) {
                this.redimensionnementDepuis = "centre";
                this.gererMouseDown(down);
            }
        });

        // Double-clique pour changer le motif
        this.div.addEventListener("dblclick", (event) => {
            event.stopPropagation();
            this.changerMotif();
        });

        // Clic droit pour supprimer l'événement
        this.div.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this.div.remove();
            this.supprimerEvenementDuStockage();
            return false;
        });
    }
}

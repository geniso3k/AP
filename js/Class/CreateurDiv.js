// CreateurDiv.js

class CreateurDiv {
    constructor(colonne, X, Y, shadowRoot, hauteurColonneTemps, shouldSave = true, donneesEvenement = null) {
        this.colonne = colonne;
        this.X = X;
        this.Y = Y;
        this.div = null;
        this.redimensionnementDepuis = null;
        this.shadowRoot = shadowRoot;
        this.hauteurColonneTemps = hauteurColonneTemps;
        this.hauteurMin = 100;  // Hauteur minimale
        this.shouldSave = shouldSave;
        this.donneesEvenement = donneesEvenement;
        this.creerDiv();
    }

    creerDiv() {
        // Création de sousDiv
        this.sousDiv = document.createElement("div");
        this.sousDiv.classList.add("sousDiv");

        this.div = document.createElement("div");
        this.div.classList.add("event-slot");

        // Styles du div principal
        if (this.donneesEvenement) {
            this.div.style.backgroundColor = this.donneesEvenement.couleur;
            this.div.style.top = this.donneesEvenement.top;
            this.div.style.height = this.donneesEvenement.hauteur;
        } else {
            this.div.style.backgroundColor = this.genererCouleurAleatoire();
            this.div.style.top = `${this.Y}px`;
            this.div.style.height = this.hauteurMin + "px";  // Hauteur minimale
            this.div.style.cursor = "grab";
        }

        this.div.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        // Création des poignées de redimensionnement
        let poigneeRedimensionnementHaut = document.createElement("div");
        poigneeRedimensionnementHaut.classList.add("resize-handle", "top-handle");
        poigneeRedimensionnementHaut.style.position = "absolute";
        poigneeRedimensionnementHaut.style.top = "0";
        poigneeRedimensionnementHaut.style.width = "100%";
        poigneeRedimensionnementHaut.style.height = "10px";
        poigneeRedimensionnementHaut.style.cursor = "n-resize";

        let poigneeRedimensionnementBas = document.createElement("div");
        poigneeRedimensionnementBas.classList.add("resize-handle", "bottom-handle");
        poigneeRedimensionnementBas.style.position = "absolute";
        poigneeRedimensionnementBas.style.bottom = "0";
        poigneeRedimensionnementBas.style.width = "100%";
        poigneeRedimensionnementBas.style.height = "10px";
        poigneeRedimensionnementBas.style.cursor = "s-resize";

        // Création de topText
        this.topText = document.createElement("div");
        this.topText.classList.add("top-text");

        // Ajout des éléments au div principal
        this.colonne.appendChild(this.div);
        this.div.appendChild(this.topText);
        this.div.appendChild(poigneeRedimensionnementHaut);
        this.div.appendChild(poigneeRedimensionnementBas);
        this.div.appendChild(this.sousDiv);

        // Ajouter les événements
        this.ajouterEvenementsDiv(poigneeRedimensionnementHaut, poigneeRedimensionnementBas);

        // Calculer l'heure de début et de fin
        this.objDiv = new Heure(this.hauteurColonneTemps, this.div.offsetTop, this.div.offsetHeight);

        // Mettre à jour le texte affiché
        this.mettreAJourTopText();

        // Sauvegarder l'événement si nécessaire
        if (this.shouldSave && !this.donneesEvenement) {
            this.sauvegarderEvenement();
        } else if (this.donneesEvenement) {
            this.div.dataset.eventId = this.donneesEvenement.id;
        }
    }

    genererIdUnique() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    genererCouleurAleatoire() {
        let rndm = Math.floor(Math.random() * 999999) + 100000;
        return "#" + rndm;
    }

    gererMouseDown(down) {
        let initialY = down.clientY;
        let initialTop = this.div.offsetTop;
        let initialHeight = this.div.offsetHeight;
        const hauteurConteneur = this.colonne.offsetHeight;

        const onMouseMove = (position) => {
            let currentY = position.clientY;
            let direction = currentY - initialY;

            if (this.redimensionnementDepuis === "bas") {
                let nouvelleHauteur = initialHeight + direction;
                if (nouvelleHauteur + initialTop > hauteurConteneur) {
                    nouvelleHauteur = hauteurConteneur - initialTop;
                }
                this.div.style.height = `${nouvelleHauteur}px`;
            } else if (this.redimensionnementDepuis === "haut") {
                let nouveauTop = initialTop + direction;
                let nouvelleHauteur = initialHeight - direction;
                if (nouveauTop < 0) {
                    nouveauTop = 0;
                    nouvelleHauteur = initialHeight + initialTop;
                }
                this.div.style.top = `${nouveauTop}px`;
                this.div.style.height = `${nouvelleHauteur}px`;
            } else if (this.redimensionnementDepuis === "centre") {
                let nouveauTop = initialTop + direction;
                if (nouveauTop < 0) {
                    nouveauTop = 0;
                }
                this.div.style.top = `${nouveauTop}px`;
            }

            // Mettre à jour les heures
            this.objDiv.redefinirTop(this.div.offsetTop);
            this.objDiv.redefinirHeight(this.div.offsetHeight);
            this.mettreAJourTopText();
        };

        const onMouseUp = () => {
            // Sauvegarder après le redimensionnement ou déplacement
            this.mettreAJourEvenementDansStockage();  // Méthode à implémenter dans `Evenement`

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    mettreAJourTopText() {
        if (this.objDiv) {
            this.topText.innerHTML = `Début : <b>${this.objDiv.calculTop()}</b> - Fin : <b>${this.objDiv.calculHeight()}</b>`;
            this.sousDiv.innerHTML = `Durée : <b>${this.objDiv.totalHeure()}</b>`;
        } else {
            this.topText.innerHTML = `Début : <b>...</b> - Fin : <b>...</b>`;
            this.sousDiv.innerHTML = `Durée : <b>...</b>`;
        }
    }

}

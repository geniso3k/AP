class Evenement {
    constructor(startY, startX, parentElement) {
        this.startY = startY;
        this.startX = startX;
        this.endY = startY;
        this.parentElement = parentElement;
        this.height = Math.abs(this.endY - this.startY);
        this.top = Math.min(this.startY, this.endY);
        this.left = 0;
        this.redimensionnement = null;
        this.columns = [];
        this.divs = [];
        this.supprimage = false;
        this.motif = "Sans motif (Double click pour modifier)";

        // Utiliser creeObjetHtml pour créer la div principale avec le motif
        this.div = this.creeObjetHtml(parentElement, {
            top: this.top,
            height: this.height,
            width: "100%",
            left: this.left,
            motif: this.motif
        });
        // Ajouter les poignées
        this.ajouterPoignees(this.div);
        console.log(this.parentElement);
    }

    ajouterJour(jours, heures = { debut: 0, fin: null }) {
        jours.forEach((jour, index) => {
            if (this.columns.includes(jour)) return;

            const hauteurTotale = jour.getBoundingClientRect().height;

            const topDiv = heures.debut ? (heures.debut / 24) * hauteurTotale : 0;

            const hauteurDiv = heures.fin
                ? ((heures.fin - (heures.debut || 0)) / 24) * hauteurTotale
                : hauteurTotale - topDiv;

            let nvHeight;
            if (index + 1 < jours.length && index != 0) {
                nvHeight = hauteurTotale;
            } else {
                nvHeight = hauteurDiv + topDiv;
            }
            console.log(nvHeight);

            if (index === 0) {
                this.div.style.height = `${this.parentElement.getBoundingClientRect().height - topDiv}px`;
            } else {
                const nouvelleDiv = this.creeObjetHtml(jour, {
                    height: nvHeight,
                    width: "100%"
                    // Ne pas passer le motif pour les divs suivantes
                });

                this.columns.push(jour);
                this.divs.push(nouvelleDiv);

                if (index + 1 === jours.length) {
                    this.lancerTest();
                    const poigneeBasNvl = document.createElement("div");
                    poigneeBasNvl.classList.add("poigneeBas");
                    nouvelleDiv.appendChild(poigneeBasNvl);
                    this.ajouterEvenementsDiv(nouvelleDiv, null, poigneeBasNvl);
                }
            }
        });
    }

    lancerTest() {
        // Supprimer la poignée basse de la première div si l'événement s'étend sur plusieurs jours
        if (this.divs.length > 0 && this.POIGNEE_BAS) {
            this.POIGNEE_BAS.remove();
            this.POIGNEE_BAS = null; // Nettoyage
            this.supprimage = true;
        }
    }

    creeObjetHtml(parent, { top = 0, height = 0, left = 0, width = "100%", motif } = {}) {
        const DIV = document.createElement("div");
        DIV.classList.add("event-slot");
        DIV.style.position = "absolute";
        DIV.style.top = top + "px";
        DIV.style.left = left + "px";
        DIV.style.width = width;
        DIV.style.height = height + "px";

        // Créer le motif uniquement si le motif est fourni
        if (motif) {
            this.motifText = document.createElement("p");
            this.motifText.classList.add("motif-text");
            this.motifText.innerText = motif;

            DIV.appendChild(this.motifText); // Ajouter le <p> à l'événement
        }

        if (parent) {
            parent.appendChild(DIV);
        }

        return DIV;
    }

    ajouterPoignees(d) {
        // Ajouter la poignée haute
        this.POIGNEE_HAUT = document.createElement("div");
        this.POIGNEE_HAUT.classList.add("poigneeHaut");
        d.appendChild(this.POIGNEE_HAUT);

        // Ajouter la poignée basse si l'événement ne s'étend pas sur plusieurs jours
        if (!this.supprimage) {
            this.POIGNEE_BAS = document.createElement("div");
            this.POIGNEE_BAS.classList.add("poigneeBas");
            d.appendChild(this.POIGNEE_BAS);
        }

        this.ajouterEvenementsDiv(d, this.POIGNEE_HAUT, this.POIGNEE_BAS);
    }

    set Motif(m) {
        this.motif = m;
        if (this.motifText) {
            this.motifText.innerText = m;
        }
    }

    get Motif() {
        return this.motif;
    }

    showAlert(alertBox) {
        alertBox.classList.remove("hidden");
        alertBox.style.visibility = "visible";
        alertBox.style.opacity = "1";

        const saveHandler = () => this.saveInput();
        const cancelHandler = () => this.closeBox();

        document.getElementById("alert-save").addEventListener("click", saveHandler, { once: true });
        document.getElementById("alert-cancel").addEventListener("click", cancelHandler, { once: true });
    }

    saveInput() {
        const INPUT = document.getElementById("alert-input");
        const NEW_MOTIF = INPUT.value.trim();

        this.Motif = NEW_MOTIF; // Utiliser le setter pour mettre à jour le motif
        this.closeBox();
    }

    closeBox() {
        let alertBox = document.getElementById("custom-alert");
        alertBox.classList.add("hidden");
        alertBox.style.visibility = "hidden";
        alertBox.style.opacity = "0";
        document.getElementById("alert-input").value = ""; // Réinitialiser le champ d'entrée
    }

    setHeight(newH) {
        this.div.style.height = newH + "px";
        this.height = newH;
    }

    setTop(newT) {
        this.div.style.top = newT + "px";
        this.top = newT;
    }

    setLeft(newL) {
        this.div.style.left = newL + "px";
        this.left = newL;
    }

    getHeight() {
        return this.div.style.height;
    }

    ajouterEvenementsDiv(divv, poigneeHaut, poigneeBas) {
        const self = this;
        let rect = divv.parentElement.getBoundingClientRect();
        let initialTop, initialHeight, offsetY, offsetX, initialLeft;

        const setHeight = (newH) => {
            divv.style.height = newH + "px";
        };

        const setTop = (newT) => {
            divv.style.top = newT + "px";
        };

        const getHeight = () => {
            return parseFloat(divv.style.height) || divv.getBoundingClientRect().height;
        };

        const getTop = () => {
            return parseFloat(divv.style.top) || 0;
        };

        const onMouseMove = (event) => {
            const currentY = event.clientY - rect.top;
            const currentX = event.clientX - rect.left;
            const directionY = currentY - self.startY;
            const directionX = currentX - self.startX;

            switch (self.redimensionnement) {
                case "haut": {
                    const nouveauTop = currentY - offsetY;
                    const newHeight = initialHeight + (initialTop - nouveauTop);

                    if (newHeight >= 20 && nouveauTop >= 0) {
                        setTop(nouveauTop);
                        setHeight(newHeight);
                    }
                    break;
                }
                case "bas": {
                    const newHeight = initialHeight + directionY;

                    if (newHeight >= 20 && (initialTop + newHeight) <= rect.height) {
                        setHeight(newHeight);
                    }
                    break;
                }
                case "centre": {
                    divv.classList.add("dragging");

                    const nouveauTop = currentY - offsetY;
                    const nouveauLeft = currentX - offsetX;

                    

                    if (nouveauTop >= 0 && (nouveauTop + getHeight()) <= rect.height) {
                        setTop(nouveauTop);
                    }

                    if (nouveauLeft >= 0 && (nouveauLeft + divv.offsetWidth) <= divv.parentElement.offsetWidth) {
                        divv.style.left = nouveauLeft + "px";
                    }

                    const elementSousLaSouris = document.elementFromPoint(event.clientX, event.clientY);
                    if (elementSousLaSouris && elementSousLaSouris.classList.contains("day-column") && elementSousLaSouris !== divv.parentElement) {
                        elementSousLaSouris.appendChild(divv);

                        rect = divv.parentElement.getBoundingClientRect();

                        self.startX = event.clientX - rect.left;
                        self.startY = event.clientY - rect.top;
                        offsetX = self.startX - (parseFloat(divv.style.left) || 0);
                        offsetY = self.startY - (parseFloat(divv.style.top) || 0);
                    }

                    

                    break;
                }
                default:
                    break;
            }
        };

        const onMouseUp = () => {
            divv.classList.remove("dragging");
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            self.redimensionnement = null;
        };

        if (poigneeHaut) {
            const ALERT_BOX = document.getElementById("custom-alert");
            divv.addEventListener("dblclick", () => this.showAlert(ALERT_BOX));

            poigneeHaut.addEventListener("mousedown", (down) => {
                self.redimensionnement = "haut";
                rect = divv.parentElement.getBoundingClientRect();
                self.startY = down.clientY - rect.top;
                initialTop = getTop();
                initialHeight = getHeight();
                offsetY = self.startY - initialTop;
                offsetX = self.startX - (parseFloat(divv.style.left) || 0);
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        }

        if (poigneeBas) {
            poigneeBas.addEventListener("mousedown", (down) => {
                self.redimensionnement = "bas";
                rect = divv.parentElement.getBoundingClientRect();
                self.startY = down.clientY - rect.top;
                initialTop = getTop();
                initialHeight = getHeight();
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        }

        divv.addEventListener("mousedown", (down) => {
            if(!this.supprimage){
            if (!down.target.classList.contains("poigneeHaut") && !down.target.classList.contains("poigneeBas")) {
                self.redimensionnement = "centre";
                rect = divv.parentElement.getBoundingClientRect();
                self.startY = down.clientY - rect.top;
                self.startX = down.clientX - rect.left;
                initialTop = getTop();
                initialLeft = parseFloat(divv.style.left) || 0;
                offsetY = self.startY - initialTop;
                offsetX = self.startX - initialLeft;
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }
        }
        });

        divv.addEventListener("contextmenu", (event) => {
            divv.remove();
            event.preventDefault();
            return false;
        });




        
    }
}

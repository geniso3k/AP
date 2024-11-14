// Sélectionne tous les éléments avec la classe "day-column"
let planningBody = document.querySelector(".planning-body");

planningBody.addEventListener("mousedown", function(down) {
    // Utilise elementFromPoint pour détecter la colonne sous la souris
    let elementSousLaSouris = document.elementFromPoint(down.clientX, down.clientY);
    if (!elementSousLaSouris || !elementSousLaSouris.classList.contains("day-column")) {
        return; // Arrête l'exécution si le clic n'est pas dans une colonne de jour
    }

    let jourD = elementSousLaSouris.id;
    let rect = elementSousLaSouris.getBoundingClientRect();
    let startY = down.clientY - rect.top; // Position relative à day-column
    let startX = down.clientX - rect.left; // Position X relative au day-column

    // Création de l'événement en utilisant la classe Evenement
    divCrea = new Evenement(startY, startX, elementSousLaSouris/*, debutJ, finJ*/);


    // Fonction pour gérer le mouvement de la souris uniquement dans la colonne
    function onMouseMove(pos) {
        let relativeY = pos.clientY - rect.top;  // Position Y relative à la colonne
        let newHeight = Math.abs(relativeY - startY);

        divCrea.setHeight(newHeight);

        if (relativeY < startY) {
            divCrea.setTop(relativeY);
        } else {
            divCrea.setTop(startY);
        }


    }

    function onMouseFinish(up) {

    // Récupérer l'élément sous la souris
    const elementFin = document.elementFromPoint(up.clientX, up.clientY);

    // Vérifier que c'est un élément valide
    if (!elementFin || !elementFin.classList.contains("day-column")) return;

    const jourFin = elementFin.id; // Récupérer l'ID de l'élément
    const rectFin = elementFin.getBoundingClientRect();

    // Calcul des heures de début et de fin
    const heureDebut = ((down.clientY - rect.top) / rect.height) * 24;
    const heureFin = ((up.clientY - rectFin.top) / rectFin.height) * 24;

    // Récupérer tous les jours sélectionnés
    const jours = toutJourSel(jourD, jourFin);

    // Si les jours sont différents, ajouter les divs pour ces jours
    if (jourFin != jourD) {
        divCrea.ajouterJour(jours, { debut: heureDebut, fin: heureFin });
    }
    // Vérifier la hauteur minimale
    if (parseInt(divCrea.getHeight()) < 20) {
        divCrea.setHeight(20);
    }

    // Nettoyer les événements
    planningBody.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseFinish);
}

    function toutJourSel(jourDebut, jourFin) {
        // Convertir les IDs en nombres
        const idDebut = parseInt(jourDebut);
        const idFin = parseInt(jourFin);
    
        // Déterminer l'intervalle
        const minId = Math.min(idDebut, idFin);
        const maxId = Math.max(idDebut, idFin);
    
        // Sélectionner les jours dans l'intervalle
        const joursSelectionnes = [];
        for (let i = minId; i <= maxId; i++) {
            const jour = document.getElementById(i);
            if (jour) joursSelectionnes.push(jour); // Ajoutez la colonne à la liste
        }

        return joursSelectionnes; // Retourne les éléments DOM des jours concernés
    }
    

    planningBody.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseFinish);
    document.addEventListener("mouseleave", onMouseFinish);
});
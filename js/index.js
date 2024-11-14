// Sélectionne tous les éléments avec la classe "day-column"
let planningBody = document.querySelector(".planning-body");

planningBody.addEventListener("mousedown", function(down) {
    // Utilise `elementFromPoint` pour détecter la colonne sous la souris
    let elementSousLaSouris = document.elementFromPoint(down.clientX, down.clientY);
    if (!elementSousLaSouris || !elementSousLaSouris.classList.contains("day-column")) {
        return; // Arrête l'exécution si le clic n'est pas dans une colonne de jour
    }

    let rect = elementSousLaSouris.getBoundingClientRect();
    let startY = down.clientY - rect.top; // Position relative à day-column
    let startX = down.clientX - rect.left; // Position X relative au day-column

    // Création de l'événement en utilisant la classe Evenement
    divCrea = new Evenement(startY, startX, elementSousLaSouris);

    console.log("Debut : " + startY);

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
        endY = up.clientY - rect.top;
        if (parseInt(divCrea.getHeight()) < 20) {
            // Si l'évènement fait moins que 20 pixels, on lui ajoute 20
            divCrea.setHeight(20);
        }

        planningBody.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseFinish);
    }

    planningBody.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseFinish);
    document.addEventListener("mouseleave", onMouseFinish);
});

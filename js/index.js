let planningBody = document.querySelector(".planning-body");

planningBody.addEventListener("mousedown", function(down) {
    let elementSousLaSouris = document.elementFromPoint(down.clientX, down.clientY);
    if (!elementSousLaSouris || !elementSousLaSouris.classList.contains("day-column")) {
        return;
    }

    let jourD = elementSousLaSouris.id;
    let rect = elementSousLaSouris.getBoundingClientRect();
    let startY = down.clientY - rect.top;
    let startX = down.clientX - rect.left;

    // Declare divCrea with let to scope it locally
    let divCrea = new Evenement(startY, startX, elementSousLaSouris);

    function onMouseMove(pos) {
        let relativeY = pos.clientY - rect.top;
        let newHeight = Math.abs(relativeY - startY);
        divCrea.setHeight(newHeight);

        if (relativeY < startY) {
            divCrea.setTop(relativeY);
        } else {
            divCrea.setTop(startY);
        }
    }

    function onMouseFinish(up) {
        const elementFin = document.elementFromPoint(up.clientX, up.clientY);
        if (!elementFin || !elementFin.classList.contains("day-column")) return;

        const jourFin = elementFin.id;
        const rectFin = elementFin.getBoundingClientRect();

        const heureDebut = ((down.clientY - rect.top) / rect.height) * 24;
        const heureFin = ((up.clientY - rectFin.top) / rectFin.height) * 24;

        const jours = toutJourSel(jourD, jourFin);

        if (jourFin != jourD) {
            divCrea.ajouterJour(jours, { debut: heureDebut, fin: heureFin });
        }

        if (parseInt(divCrea.getHeight()) < 20) {
            divCrea.setHeight(20);
        }

        planningBody.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseFinish);


    }

    function toutJourSel(jourDebut, jourFin) {
        const idDebut = parseInt(jourDebut);
        const idFin = parseInt(jourFin);

        const minId = Math.min(idDebut, idFin);
        const maxId = Math.max(idDebut, idFin);

        const joursSelectionnes = [];
        for (let i = minId; i <= maxId; i++) {
            const jour = document.getElementById(i);
            if (jour) joursSelectionnes.push(jour);
        }

        return joursSelectionnes;
    }

    planningBody.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseFinish);
    document.addEventListener("mouseleave", onMouseFinish);
});

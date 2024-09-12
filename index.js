let isMouseDown = false; // Variable pour savoir si la souris est appuyée

// Fonction appelée lorsqu'on clique sur une cellule
function cliquer(id) {
    let div = document.getElementById(id);
    let separ = div.id.split('_'); // Diviser l'ID pour obtenir le numéro de ligne et de colonne

    // Quand on clique, on passe isMouseDown à true
    div.addEventListener("mousedown", function() {
        isMouseDown = true;

        // Vérifier si on est dans la première colonne (comparaison correcte)
        if (separ[1] === '1') { // '1' comme chaîne de caractères
            colorColumn(separ[1], "yellow"); // Corriger en utilisant la colonne, pas la ligne
        }

        // Lorsque la souris est relâchée, on remet toutes les cellules en blanc
        document.addEventListener("mouseup", function() {
            isMouseDown = false;
            resetColors(); // Remettre les couleurs à blanc
        }, { once: true });
    });

    // Lorsqu'on entre dans une autre cellule avec la souris appuyée
    document.querySelectorAll('td').forEach(function(cell) {
        cell.addEventListener("mouseenter", function() {
            if (isMouseDown) {
                this.style.backgroundColor = "yellow"; // Correction de la syntaxe
            }
        });
    });
}

// Fonction pour colorer toutes les cellules d'une colonne donnée
function colorColumn(col, color) {
    for (let i = 1; i <= 4; i++) { // Supposons qu'il y ait 4 lignes dans le tableau
        let cellId = i + '_' + col;
        let cell = document.getElementById(cellId);
        if (cell) {
            cell.style.backgroundColor = color; // Appliquer la couleur à la cellule
        }
    }
}

// Fonction pour remettre toutes les cellules à la couleur blanche
function resetColors() {
    document.querySelectorAll('td').forEach(function(cell) {
        cell.style.backgroundColor = "white"; // Remettre la couleur blanche à toutes les cellules
    });
}

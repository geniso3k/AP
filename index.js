let isMouseDown = false; // Variable pour savoir si la souris est appuyée

// Attacher un événement `mouseup` global pour gérer le relâchement de la souris
document.addEventListener("mouseup", function() {
    isMouseDown = false;
    //resetColors();
});

// Fonction appelée lorsqu'on clique sur une cellule
function init() {
    // Attacher les événements à chaque cellule une seule fois
    document.querySelectorAll('td').forEach(function(cell) {
        
        // Quand on appuie sur la cellule avec la souris
        cell.addEventListener("mousedown", function(event) {
            isMouseDown = true;
            cell.style.backgroundColor = "yellow"; // Colorer la cellule cliquée

        });

        // Quand on survole d'autres cellules avec la souris enfoncée
        cell.addEventListener("mouseenter", function() {
            if (isMouseDown) {
                cell.style.backgroundColor = "yellow"; // Colorer la cellule survolée si la souris est enfoncée
            }
        });

        // Quand on quitte une cellule
        cell.addEventListener("mouseleave", function() {
            let col = splitter(cell, "col");
            if (col === '1') {
                console.log("Sortie d'une cellule dans la première colonne");
            }
        });
    });

    // Écouteur de clic global
    document.addEventListener('mousedown', function(event) {
        if(!isMouseDown){
            // Si le clic est fait en dehors des cellules <td>, on réinitialise les couleurs
            if (event.target.tagName.toLowerCase() !== 'td') {
                resetColors();
            }
        }
    });
}

// Fonction pour séparer l'ID de la cellule en ligne et colonne
function splitter(a, choix) {
    let split = a.id.split('_');
    let lig = split[1];
    let col = split[0];

    if (choix == "col") {
        return col;
    } else {
        return lig;
    }
}

// Fonction pour remettre toutes les cellules à la couleur blanche
function resetColors() {
    document.querySelectorAll('td').forEach(function(cell) {
        cell.style.backgroundColor = "white"; // Remettre la couleur blanche à toutes les cellules
    });
}

// Initialiser les événements une seule fois lorsque le DOM est prêt
window.onload = function() {
    init(); // Attacher les événements à toutes les cellules
}

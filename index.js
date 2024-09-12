let isMouseDown = false; // Variable pour savoir si la souris est appuyée
const mouseLine = document.getElementById('mouse-line'); // L'élément ligne qui suit la souris
const mouseTime = document.getElementById('mouse-time'); // L'élément pour afficher l'heure
const lineHeight = -270; // Hauteur du trait

// Attacher un événement `mouseup` global pour gérer le relâchement de la souris
document.addEventListener("mouseup", function() {
    isMouseDown = false;
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
// Fonction pour calculer l'heure exacte en fonction de la position de la souris, en ignorant la ligne des jours
function calculateExactTimeFromPosition(mouseY, tableTop) {
    const startHour = 0; // Heure de début dans ton tableau (00:00)
    const totalHours = 24; // Total d'heures affichées dans le tableau (00:00 - 23:00)

    const tableBody = document.querySelector('.calendar tbody');
    const tableRows = tableBody.querySelectorAll('tr');
    const firstRow = tableRows[0]; // La première ligne du tableau contient les jours

    const rowHeight = firstRow.offsetHeight; // Hauteur d'une ligne horaire (ligne normale)
    const relativeY = mouseY - tableTop - firstRow.offsetHeight; // Soustraire la hauteur de la première ligne

    // Si la souris est au-dessus de la première heure, ne rien afficher
    if (relativeY < 0) return null;

    const hoursOffset = Math.floor(relativeY / rowHeight); // Trouve l'heure correspondante
    const minutesOffset = Math.floor(((relativeY % rowHeight) / rowHeight) * 60); // Minutes à l'intérieur de l'heure

    const hours = startHour + hoursOffset;
    const minutes = minutesOffset;

    // Formater l'heure avec des zéros si nécessaire
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

// Initialiser le suivi de la souris
function initMouseTracking() {
    const calendar = document.querySelector('.calendar-container');

    // Suivre la position de la souris lorsque celle-ci est dans la zone du tableau
    calendar.addEventListener('mousemove', function(event) {
        const rect = calendar.getBoundingClientRect();
        const mouseY = event.clientY - rect.top;

        // Ajuster la ligne pour la placer juste au niveau de la souris
        const adjustedY = mouseY - (lineHeight / 2); // Ajustement pour centrer le trait sur la souris
        mouseLine.style.top = adjustedY + 'px';
        mouseLine.style.display = 'block'; // Afficher la ligne

        // Calculer et afficher l'heure exacte correspondante à gauche
        const time = calculateExactTimeFromPosition(event.clientY, rect.top);
        if (time !== null) {
            mouseTime.innerText = time;
            mouseTime.style.top = adjustedY + 'px';
            mouseTime.style.display = 'block'; // Afficher l'heure
        } else {
            mouseTime.style.display = 'none'; // Masquer l'heure si hors limites
        }
    });

    // Cacher la ligne et l'heure lorsque la souris quitte la zone du tableau
    calendar.addEventListener('mouseleave', function() {
        mouseLine.style.display = 'none'; // Masquer la ligne quand la souris quitte la zone
        mouseTime.style.display = 'none'; // Masquer l'heure
    });
}
// Initialiser les événements une seule fois lorsque le DOM est prêt
window.onload = function() {
    init(); // Attacher les événements à toutes les cellules
    initMouseTracking();
}

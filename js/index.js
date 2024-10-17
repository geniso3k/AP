
var ignoreNextClick = false; // Nouveau flag pour ignorer le clic après le redimensionnement
// Sélectionne toutes les colonnes avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event) {
        if (ignoreNextClick) {
            // Ignore le prochain clic après le redimensionnement
            ignoreNextClick = false; // Réinitialise après avoir ignoré ce clic
            event.preventDefault();
            return;
        }

        let mouseX = event.clientX; // Coordonnée X de la souris
        let mouseY = event.clientY; // Coordonnée Y de la souris

        // Crée une nouvelle instance de DivCreator pour créer et gérer un div
        new DivCreator(column, mouseX, mouseY);
    });
});

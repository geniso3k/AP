// Sélectionne toutes les colonnes avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event) {
        if (event.defaultPrevented) return; // Empêche la création d'un div pendant le redimensionnement

        let mouseX = event.clientX; // Coordonnée X de la souris
        let mouseY = event.clientY; // Coordonnée Y de la souris

        // Crée une nouvelle instance de DivCreator pour créer et gérer un div
        new DivCreator(column, mouseX, mouseY);
    });
});
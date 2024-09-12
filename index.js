function cliquer(id) {
    let div = document.getElementById(id);
    
    // Changer la couleur au moment où l'on clique (mousedown)
    div.addEventListener("mousedown", function() {
        div.style.backgroundColor = "yellow";
        
        // Attacher l'événement "mouseup" au document pour détecter quand on relâche la souris
        document.addEventListener("mouseup", function() {
            div.style.backgroundColor = "white";
        }, { once: true });  // Utilisation de { once: true } pour s'assurer que cet événement est déclenché une seule fois
    });
}

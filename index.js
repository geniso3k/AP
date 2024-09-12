let isMouseDown = false; // Variable pour savoir si la souris est appuyée

// Fonction appelée lorsqu'on clique sur une cellule
function cliquer(id) {
    let div = document.getElementById(id);
    let sep = div.id.split('_');
    let col = sep[0];
    let lig = sep[1];

    div.addEventListener("mousedown", function(){
        isMouseDown = true;
        div.style.backgroundColor = "yellow";
    })
    document.addEventListener("mouseup", function(){
        isMouseDown = false;
        resetColors();
    })

    document.querySelectorAll('td').forEach(function(cell){
        cell.addEventListener("mouseenter", function(){
            if(isMouseDown){
                cell.style.backgroundColor = "yellow";
            }
        })
    })
    element.addEventListener("mouseleave", function(){

        if(splitter(element, col) == '1' ){
            
        }

    })
}

function splitter(a, choix){

    split = a.id.split('_');
    lig = split[1];
    col = split[0];

    if(choix == "col"){
        return col;
    }else{
        return lig;
    }


}
// Fonction pour colorer toute une ligne
function colorRow(row, color) {
    document.querySelectorAll(`td[data-row="${row}"]`).forEach(function(cell) {
        cell.style.backgroundColor = color; // Appliquer la couleur à chaque cellule de la ligne
    });
}

// Fonction pour remettre toutes les cellules à la couleur blanche
function resetColors() {
    document.querySelectorAll('td').forEach(function(cell) {
        cell.style.backgroundColor = "white"; // Remettre la couleur blanche à toutes les cellules
    });
}

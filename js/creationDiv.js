// Sélectionne tous les éléments avec la classe "day-column"
let dayColumns = document.getElementsByClassName("day-column");

// Ajoute un écouteur d'événements pour chaque colonne de jour
Array.from(dayColumns).forEach(column => {
    column.addEventListener("click", function(event){
        if (event.defaultPrevented) return;

        let mouseX = event.clientX;
        let mouseY = event.clientY;
        creationDiv(column, mouseX,mouseY);
    });
});
let allEvents = document.getElementsByClassName("event-slot");


function creationDiv(column, X, Y){

    let div = document.createElement("div");
    div.innerHTML = "Je suis là";
    div.classList.add("event-slot");

    let sousDiv = document.createElement("div");
    sousDiv.innerHTML = "Dans la div";
    sousDiv.classList.add("sousDiv");
    
    const rect = column.getBoundingClientRect();

    // Positionne le div en utilisant les coordonnées de la souris
    let rndm = Math.floor(Math.random() * 999999) + 100000;
    console.log(rndm);
    div.style.backgroundColor = "#"+rndm;
    div.style.width = "100%";
    div.style.position = "absolute"; // Positionne le div en mode absolu
    div.style.top = `${Y - rect.top}px`; // Ajuste par rapport à la colonne
    div.style.minHeight = "35px";

 


    // Ajoute le nouvel élément div au parent de la colonne
    column.appendChild(div);
    div.appendChild(sousDiv);


    let isResizing = false; //

    div.addEventListener("contextmenu", function(event){

        div.remove();
        event.preventDefault();
        return false;

    });



    div.addEventListener("mousedown", function(down){

        let initialY = down.clientY;
        let initialTop = div.offsetTop; // Position initiale du div
        let initialHeight = div.offsetHeight;
        down.stopPropagation() ;

        isResizing = false;

        function onMouseMove(position){

            isResizing = true;

            let currentY = position.clientY;


            if(!((initialHeight + (currentY - initialY)) > initialHeight)){

               
                console.log("redimension vers le haut");

                
                let newTop = initialTop - (initialHeight + (initialY - currentY) - initialHeight);
                if(newTop < 0) newTop = 0;
                if(currentY < 129) currentY = 129;
                div.style.top = newTop + "px";
                div.style.height = initialY-currentY+35+"px";
                
                let newHeight = initialHeight - (currentY - initialY);
                div.style.height = newHeight + "px";

                console.log("Height : " + div.offsetHeight +" InitialHeight : "+initialHeight+" currentY : "+currentY+" InitialY :" +initialY+ " InitialTop: "+initialTop+" Calcul : "+(initialHeight+ (currentY-initialY)) );

            }else{


                console.log("Redimension vers le bas");
                let newHeight = initialHeight + (currentY - initialY);
                div.style.height = newHeight + "px";
                
                console.log("InitialHeight : "+initialHeight+" currentY : "+currentY+" InitialY :" +initialY+ " InitialTop: "+initialTop+" Calcul : "+(initialHeight+ (currentY-initialY)) );
                




            }


        }
        // On stoppe le redimensionnement quand la souris est relâchée
        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            
        }

        // Ajoute les écouteurs d'événements
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

    });

    div.addEventListener("click", function(event) {
        if (isResizing) {
            event.preventDefault(); // Annule l'événement click si redimensionnement
            isResizing = false; // Réinitialise la variable après relâchement de la souris
        }
    });

}



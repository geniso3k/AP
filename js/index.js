

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

         // Création de l'événement en utilisant la classe Evenement
        divCrea = new Evenement(startY, elementSousLaSouris);   

        console.log("Debut : "+startY);

        // Fonction pour gérer le mouvement de la souris uniquement dans la colonne
        function onMouseMove(pos) {

            let relativeY = pos.clientY - rect.top;  // Position Y relative à la colonne haut en bas
            
                let newHeight = Math.abs(relativeY-startY);

                console.log(newHeight + " : newHeight");
                
                divCrea.setHeight(newHeight);
            

        }

        function onMouseFinish(up){

            // Capture les positions de fin relatives à planning-body
            endX = up.offsetX;
            endY = up.offsetY;

            

            // Vérifie si l'élément sous la souris est bien une `day-column`
            if (elementSousLaSouris && elementSousLaSouris.classList.contains("day-column")) {
                console.log("Colonne détectée :", elementSousLaSouris.id + " Y : "+endY);
            }

           

            planningBody.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseFinish);
        }


        planningBody.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseFinish); 
        document.addEventListener("mouseleave", onMouseFinish);
    });


/*

function creationDiv(column, X, Y){

    let div = document.createElement("div");
    div.innerHTML = "Je suis là";
    div.classList.add("event-slot");

    let sousDiv = document.createElement("div");
    sousDiv.innerHtml = "En dessous";
    sousDiv.classList.add("sousDiv");
    
    const rect = column.getBoundingClientRect();
    console.log(rect.left+" /"+rect.top);

    // Positionne le div en utilisant les coordonnées de la souris
    div.style.width = "100%";
    div.style.position = "absolute"; // Positionne le div en mode absolu
    div.style.top = `${Y - rect.top}px`; // Ajuste par rapport à la colonne
    div.style.marginRight = `${X - rect.right}px`;


    // Ajoute le nouvel élément div au parent de la colonne
    column.appendChild(div);
    div.appendChild(sousDiv);

}

*/


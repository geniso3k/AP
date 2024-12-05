let db;
let BDDpret = false;

function ouvrirBase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("MaBase", 1);

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.createObjectStore("evenements", { keyPath: "id", autoIncrement: true });
            console.log("Table 'evenements' créée !");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            console.log("Base de données ouverte !");
            resolve(); // Résolution de la promesse
        };

        request.onerror = function (event) {
            console.error("Erreur lors de l'ouverture :", event.target.error);
            reject(event.target.error); // Rejet de la promesse
        };
    });
}


// Fonction générique pour exécuter des opérations sur "evenements"
function executerOperation(mode, operation) {
    if (!db) {
        console.error("La base de données n'est pas encore prête !");
        return;
    }

    let transaction = db.transaction(["evenements"], mode);
    let store = transaction.objectStore("evenements");

    operation(store); // Exécuter l'opération passée en paramètre
}

// Ajouter un événement
function ajouterEventsBDD(semaine, div) {
    executerOperation("readwrite", function (store) {
        let request = store.add({ semaine: semaine, div: div });



        request.onerror = function (event) {
            console.error("Erreur lors de l'ajout :", event.target.error + "Données ; "+div);
        };
    });
}


// Lire tous les événements
function LireEventsBDD(callback) {
    executerOperation("readonly", function (store) {
        let request = store.getAll();

        request.onsuccess = function () {
            callback(request.result);
        };

        request.onerror = function (event) {
            console.error("Erreur lors de la lecture :", event.target.error);
        };
    });
}

    /////

    document.getElementById("time-header").addEventListener("click", supprimerEventsBDD);
// Supprimer tous les événements
function supprimerEventsBDD() {
    executerOperation("readwrite", function (store) {
        let request = store.clear();

        request.onsuccess = function () {
            console.log("Tous les événements ont été supprimés !");
        };

        request.onerror = function (event) {
            console.error("Erreur lors de la suppression :", event.target.error);
        };
    });
}


ouvrirBase();

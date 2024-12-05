// db.js

const db = (() => {
    let dbInstance = null;

    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('planningDB', 3); // Version augmentée à 3

            request.onerror = (e) => {
                console.error('Erreur lors de l\'ouverture de la base de données', e);
                reject(e);
            };

            request.onsuccess = (e) => {
                dbInstance = e.target.result;
                resolve(dbInstance);
            };

            request.onupgradeneeded = (e) => {
                dbInstance = e.target.result;

                if (!dbInstance.objectStoreNames.contains('creneaux')) {
                    const creneauxStore = dbInstance.createObjectStore('creneaux', { keyPath: 'id', autoIncrement: true });
                } else {
                    // Mise à jour de la structure de l'object store si nécessaire
                    const creneauxStore = e.currentTarget.transaction.objectStore('creneaux');
                    // Ajouter des champs ou des index si nécessaire
                }
            };
        });
    };

    const getDB = () => {
        return dbInstance ? Promise.resolve(dbInstance) : openDB();
    };

    const saveCreneau = (creneau) => {
        return getDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['creneaux'], 'readwrite');
                const store = transaction.objectStore('creneaux');

                const data = {
                    startDate: creneau.startDate.toISOString(),
                    endDate: creneau.endDate.toISOString(),
                    startTime: creneau.startTime,
                    duration: creneau.duration,
                    motif: creneau.motif,
                };

                if (creneau.id != null) {
                    data.id = creneau.id;
                }

                const request = store.put(data);

                request.onsuccess = () => {
                    creneau.id = request.result;
                    resolve();
                };

                request.onerror = (e) => {
                    console.error('Erreur lors de la sauvegarde du créneau', e);
                    reject(e);
                };
            });
        });
    };

    const getCreneaux = () => {
        return getDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['creneaux'], 'readonly');
                const store = transaction.objectStore('creneaux');

                const request = store.getAll();

                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = (e) => {
                    console.error('Erreur lors de la récupération des créneaux', e);
                    reject(e);
                };
            });
        });
    };

    return {
        saveCreneau,
        getCreneaux,
    };
})();

window.db = db;

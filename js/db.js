// db.js

const db = (() => {
    let dbInstance = null;

    const openDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('planningDB', 1);

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
                    creneauxStore.createIndex('week', 'week', { unique: false });
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
                    dayColumnId: creneau.dayColumnId,
                    startTime: creneau.startTime,
                    duration: creneau.duration,
                    motif: creneau.motif,
                    week: getCurrentWeekNumber(),
                };
    
                // Inclure 'id' uniquement si 'creneau.id' est défini
                if (creneau.id != null) {
                    data.id = creneau.id;
                }
    
                const request = store.put(data);
    
                request.onsuccess = () => {
                    creneau.id = request.result; // Enregistrer l'ID généré
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

                const index = store.index('week');
                const weekNumber = getCurrentWeekNumber();
                const request = index.getAll(weekNumber);

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

    const getCurrentWeekNumber = () => {
        const date = new Date();
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
        return weekNumber;
    };

    return {
        saveCreneau,
        getCreneaux,
    };
})();

// Attacher l'objet db à l'objet global window
window.db = db;

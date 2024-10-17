class Heure {
    constructor(totalite, top, height) {
        this.totalite = totalite;  // Totalité (taille totale en pixels) représente une journée complète
        this.top = top;            // Position top en pixels
        this.height = height;      // Hauteur en pixels (durée d'un événement, par exemple)
    }

    redefinirTop(newTop) {
        this.top = newTop;
    }

    redefinirHeight(newHeight) {
        this.height = newHeight;
    }

    calculTop() {
        return this.calculTempsDepuisPosition(this.top);
    }

    calculHeight() {
        if (this.calculTempsDepuisPosition(this.top + this.height) === "0h00") {
            return "23h59";
        } else {
            return this.calculTempsDepuisPosition(this.top + this.height);
        }
    }

    calculTempsDepuisPosition(position) {
        // Calcul de la proportion de la journée correspondant à la position donnée (top ou height)
        let timeFraction = position / this.totalite; 

        // Définir une date de référence au début de la journée (00:00:00)
        let date = new Date();
        date.setHours(0, 0, 0, 0);

        // Ajouter la fraction de la journée en millisecondes à la date
        let totalMillisecondsInDay = 24 * 60 * 60 * 1000;
        let addedMilliseconds = timeFraction * totalMillisecondsInDay;

        // Mettre à jour la date en ajoutant la durée calculée
        date.setTime(date.getTime() + addedMilliseconds);

        // Retourner l'heure et les minutes formatées
        let heures = date.getHours();
        let minutes = date.getMinutes();

        return heures + "h" + (minutes < 10 ? "0" : "") + minutes;
    }

    totalHeure() {
        // Obtenir les heures de début et de fin au format "xhmm"
        let dateDebut = this.calculTop();    // Heure de début (formatée)
        let dateFin = this.calculHeight();   // Heure de fin (formatée)

        // Convertir les heures et minutes de début et de fin en minutes totales
        let [heuresDebut, minutesDebut] = dateDebut.split("h").map(Number);
        let [heuresFin, minutesFin] = dateFin.split("h").map(Number);

        // Calculer le nombre total de minutes depuis minuit pour chaque heure
        let totalMinutesDebut = heuresDebut * 60 + minutesDebut;
        let totalMinutesFin = heuresFin * 60 + minutesFin;

        // Si la fin est antérieure au début, cela signifie que l'événement traverse minuit
        if (totalMinutesFin < totalMinutesDebut) {
            totalMinutesFin += 24 * 60; // Ajouter 24 heures (en minutes)
        }

        // Calculer la différence en minutes
        let differenceMinutes = totalMinutesFin - totalMinutesDebut;

        // Convertir la différence en heures et minutes
        let heures = Math.floor(differenceMinutes / 60);
        let minutes = differenceMinutes % 60;

        // Retourner la durée totale formatée
        return heures + "h" + (minutes < 10 ? "0" : "") + minutes;
    }
}


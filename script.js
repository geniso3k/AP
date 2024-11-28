class Planning {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.events = [];
        this.currentDate = new Date(); // Tracks the current week
        this.editingEvent = null;
        this.draggingEvent = null;
        this.resizingEvent = null;
        this.gridCellHeight = 50; // Each grid cell is 50px tall
        this.minutesPerPixel = 60 / this.gridCellHeight; // 60 minutes / 50px
        this.init();
    }

    init() {
        this.createUI();
        this.attachEventListeners();
    }

    createUI() {
        this.container.innerHTML = `
            <div class="planning-header">
                <button class="nav-btn" id="prev-week">&lt;</button>
                <span id="current-week"></span>
                <button class="nav-btn" id="next-week">&gt;</button>
            </div>
            <div class="planning-grid" id="planning-grid"></div>
            <div class="event-form" id="event-form">
                <label>Event Title:</label>
                <input type="text" id="event-title" placeholder="Enter event title">
                <label>Start Date and Time:</label>
                <input type="datetime-local" id="event-start">
                <label>End Date and Time:</label>
                <input type="datetime-local" id="event-end">
                <label>Color:</label>
                <input type="color" id="event-color" value="#3498db">
                <button id="save-event">Save</button>
                <button id="delete-event" style="display:none;">Delete</button>
                <button id="cancel-event">Cancel</button>
            </div>
        `;
        this.updateWeekLabel();
        this.renderGrid();
    }

    updateWeekLabel() {
        const startOfWeek = this.getStartOfWeek(this.currentDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options = { month: "short", day: "numeric" };
        this.container.querySelector("#current-week").textContent =
            `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
    }

    renderGrid() {
        const grid = this.container.querySelector("#planning-grid");
        grid.innerHTML = "";

        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        // Header row
        grid.innerHTML += `<div class="grid-cell header-cell"></div>`;
        days.forEach(day => {
            grid.innerHTML += `<div class="grid-cell header-cell">${day}</div>`;
        });

        // Hourly rows
        hours.forEach(hour => {
            grid.innerHTML += `<div class="grid-cell header-cell">${hour}</div>`;
            for (let i = 0; i < 7; i++) {
                grid.innerHTML += `<div class="grid-cell" data-day="${i}" data-hour="${hour}"></div>`;
            }
        });
    }

    attachEventListeners() {
        const grid = this.container.querySelector("#planning-grid");
        const saveButton = document.querySelector("#save-event");
        const deleteButton = document.querySelector("#delete-event");
        const cancelButton = document.querySelector("#cancel-event");

        grid.addEventListener("dblclick", this.createOrEditEvent.bind(this)); // Double-click to create/edit
        grid.addEventListener("mousedown", this.startDragOrResize.bind(this)); // Start drag or resize
        grid.addEventListener("mousemove", this.dragOrResizeEvent.bind(this)); // Dragging or resizing
        grid.addEventListener("mouseup", this.endDragOrResize.bind(this)); // End dragging/resizing
        saveButton.addEventListener("click", this.saveEvent.bind(this));
        deleteButton.addEventListener("click", this.deleteEvent.bind(this));
        cancelButton.addEventListener("click", this.cancelEvent.bind(this));
    }

    getStartOfWeek(date) {
        const day = date.getDay() || 7;
        const diff = date.getDate() - day + 1;
        return new Date(date.setDate(diff));
    }

    createOrEditEvent(event) {
        if (event.target.classList.contains("grid-cell") && !event.target.classList.contains("header-cell")) {
            const form = document.querySelector("#event-form");
            form.style.display = "block";

            const day = parseInt(event.target.dataset.day, 10);
            const hour = parseInt(event.target.dataset.hour.split(":")[0], 10);

            const currentDate = new Date(this.currentDate);
            currentDate.setDate(this.currentDate.getDate() + day);

            const startDateTime = new Date(currentDate);
            startDateTime.setHours(hour, 0, 0);

            const endDateTime = new Date(startDateTime);
            endDateTime.setMinutes(endDateTime.getMinutes() + 60); // Default 1-hour duration

            document.querySelector("#event-start").value = startDateTime.toISOString().slice(0, 16);
            document.querySelector("#event-end").value = endDateTime.toISOString().slice(0, 16);
            this.editingEvent = null;
        }
    }

    startDragOrResize(event) {
        if (event.target.classList.contains("resize-handle")) {
            const eventDiv = event.target.closest(".event");
            this.resizingEvent = this.events[parseInt(eventDiv.dataset.index, 10)];
            this.resizeStartY = event.clientY;
        }
    }

    dragOrResizeEvent(event) {
        if (this.resizingEvent) {
            const deltaY = event.clientY - this.resizeStartY;
            const durationChange = Math.round(deltaY / this.gridCellHeight * this.minutesPerPixel);
            const newEndDate = new Date(this.resizingEvent.endDate);
            newEndDate.setMinutes(newEndDate.getMinutes() + durationChange);
            if (newEndDate > this.resizingEvent.startDate) {
                this.resizingEvent.endDate = newEndDate;
            }
            this.renderEvents();
        }
    }

    endDragOrResize() {
        this.resizingEvent = null;
    }

    saveEvent() {
        const title = document.querySelector("#event-title").value.trim();
        const startDate = new Date(document.querySelector("#event-start").value);
        const endDate = new Date(document.querySelector("#event-end").value);
        const color = document.querySelector("#event-color").value;

        if (!title || !startDate || !endDate || startDate >= endDate) {
            alert("Please enter valid event details.");
            return;
        }

        if (this.editingEvent !== null) {
            const event = this.events[this.editingEvent];
            event.title = title;
            event.startDate = startDate;
            event.endDate = endDate;
            event.color = color;
            this.editingEvent = null;
        } else {
            this.events.push({ title, startDate, endDate, color });
        }

        this.renderEvents();
        this.cancelEvent();
    }

    deleteEvent() {
        if (this.editingEvent !== null) {
            this.events.splice(this.editingEvent, 1);
            this.editingEvent = null;
            this.renderEvents();
            this.cancelEvent();
        }
    }

    cancelEvent() {
        document.querySelector("#event-form").style.display = "none";
        document.querySelector("#delete-event").style.display = "none";
        this.editingEvent = null;
    }

    renderEvents() {
        const grid = this.container.querySelector("#planning-grid");
        grid.querySelectorAll(".grid-cell .event").forEach(event => event.remove());

        this.events.forEach((event, index) => {
            const startDayIndex = (event.startDate.getDay() + 6) % 7;

            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event");
            eventDiv.dataset.index = index;
            eventDiv.style.backgroundColor = event.color;
            eventDiv.textContent = `${event.title}`;

            const resizeHandle = document.createElement("div");
            resizeHandle.classList.add("resize-handle");
            eventDiv.appendChild(resizeHandle);

            const cell = grid.querySelector(
                `.grid-cell[data-day="${startDayIndex}"][data-hour="${event.startDate.getHours()}:00"]`
            );

            if (cell) {
                const durationMinutes =
                    (event.endDate.getHours() * 60 + event.endDate.getMinutes()) -
                    (event.startDate.getHours() * 60 + event.startDate.getMinutes());
                eventDiv.style.height = `${(durationMinutes / 60) * this.gridCellHeight}px`;
                cell.appendChild(eventDiv);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Planning("planning-container");
});

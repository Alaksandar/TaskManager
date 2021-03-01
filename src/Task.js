import "./assets/styles/style.css";



// Создать строку задачи:

export class Task {

    constructor(name, checked = false) {
        this.name = name;
        this.checked = checked;
    }

    create(li) {

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const label = document.createElement('label');
        label.textContent = this.name;

        li.append(checkbox);
        li.append(label);
    }
}
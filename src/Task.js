import "./assets/styles/style.css";

import delete_icon from "./assets/images/icon-delete.png";

// Создать строку задачи:

export class Task {

    constructor(name, checked = false) {
        this.name = name;
        this.checked = checked;
    }

    create(li) {

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = this.checked;

        const label = document.createElement('label');
        label.textContent = this.name;

        const deleteIcon = document.createElement("img");
        deleteIcon.src = delete_icon;
        deleteIcon.classList.add("delete");

        li.append(checkbox);
        li.append(label);
        li.append(deleteIcon);
    }
}
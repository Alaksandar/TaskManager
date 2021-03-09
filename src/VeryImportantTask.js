import { Task } from "./task.js";

import { veryImportantStore } from "./store.js";



// Создать очень срочную задачу,
// поместить задачу в соответствующую колонку,
// сохранить данные задачи в массиве в "./store.js"

export class VeryImportantTask extends Task {

    constructor(name, checked) {
        super(name, checked);
    }

    create(li) {
        super.create(li);

        li.setAttribute("data-very-important", veryImportantStore.length);

        const ul = document.querySelector(".very-important-task-col ul");
        ul.append(li);

        this.id = veryImportantStore.length;
        veryImportantStore.push(this);
    }
}
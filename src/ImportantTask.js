import { Task } from "./task.js";

import { importantStore } from "./store.js";



// Создать срочную задачу,
// поместить задачу в соответствующую колонку,
// сохранить данные задачи в массиве в "./store.js"

export class ImportantTask extends Task {

    constructor(name, checked) {
        super(name, checked);
    }
    
    create(li) {
        super.create(li);

        li.setAttribute("data-important", importantStore.length);

        const ul = document.querySelector(".important-task-col ul");
        ul.append(li);

        this.id = importantStore.length;
        importantStore.push(this);
    }
}
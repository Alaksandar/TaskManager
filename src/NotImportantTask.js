import { Task } from "./Task.js";

import { notImportantStore } from "./Store.js";



// Создать несрочную задачу,
// поместить задачу в соответствующую колонку,
// сохранить данные задачи в массиве в "./Store.js"

export class NotImportantTask extends Task {

    constructor(name, checked) {
        super(name, checked);
    }

    create(li) {
        super.create(li);

        li.setAttribute("data-not-important", notImportantStore.length);

        const ul = document.querySelector(".not-important-task-col ul");
        ul.append(li);
        
        this.id = notImportantStore.length;
        notImportantStore.push(this);

        console.log("notImportantStore ", notImportantStore);
    }
}

import { Task } from "./Task.js";

import { importantStore } from "./Store.js";



// Создать срочную задачу,
// поместить задачу в соответствующую колонку,
// сохранить данные задачи в массиве в "./Store.js"

export class ImportantTask extends Task {

    constructor(name, checked) {
        super(name, checked);
    }

    create(li) {
        super.create(li);

        li.setAttribute("data-important", importantStore.length);

        const ul = document.querySelector(".important-task-col ul");

        if (Array.from(ul.children).length > 0 &&
            Array.from(ul.children).some(li => li.classList.contains("clean"))) {

            li.classList.add("clean");
        }

        ul.append(li);

        this.id = importantStore.length;

        importantStore.push(this);

        console.log("importantStore ", importantStore);
    }
}
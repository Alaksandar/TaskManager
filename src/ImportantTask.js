import { Task } from "./Task.js";


// Хранение данных задач в массиве:
const importantStore = [];


// Создать срочную задачу,
// сохранить данные задачи в массиве

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

        console.log("importantStore ", importantStore);
    }
}
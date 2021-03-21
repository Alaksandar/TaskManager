import { NotImportantTask } from "./notImportantTask.js";
import { ImportantTask } from "./importantTask.js";
import { VeryImportantTask } from "./veryImportantTask.js";
import { Task } from "./task.js";

import { notImportantStore, importantStore, veryImportantStore } from "./store.js";

import "./assets/styles/style.css";


const addButton = document.querySelector("button[data-action=add]");
const close_form = document.querySelector(".close_form");
// const inputText = document.querySelector('input[type="text"]');



// Раскрыть форму при клике на кнопку "Создать задачу" (и иконке "pancil"),
// cкрыть кнопку "Создать задачу":

export function openForm(addButton) {

    // console.log("openForm")

    const addList = document.querySelector("#add-list");
    addList.classList.remove("close");
    addList.classList.add("open");

    addButton.hidden = true;
}



// Свернуть форму при клике на кнопку "x" (и кнопку "Добавить"),
// очистить содержимое и пользовательские атрибуты поля ввода,
// отменить селектор, показать кнопку "Создать задачу":

export function closeForm(close_form) {

    // console.log("editTask");

    const addList = close_form.parentElement.parentElement;
    addList.classList.remove("open");
    addList.classList.add("close");

    const inputText = document.querySelector('input[type="text"]');
    inputText.removeAttribute("tasktypename");
    inputText.removeAttribute("editLiAttribute");
    inputText.value = "";

    const options = document.querySelectorAll(".option");
    for (let option of options) {
        option.selected = false;
    }

    const addButton = document.querySelector("button[data-action=add]");
    addButton.hidden = false;
}



// export function closeWarning(inputText) {

//     const task_warning = inputText.nextElementSibling;
//     task_warning.classList.add("close_warning");
//     if (task_warning.classList.contains("open_warning")){
//         task_warning.classList.remove("open_warning");
//     }
// }



// Редактировать задачу кликом по иконке "pancil", раскрыть форму,
// задать пользовательские атрибуты и содержимое полю ввода,
// переход к function submitTask()

export function editTask(e) {

    if (e.target.classList.contains("edit")) {

        // console.log("editTask");

        openForm(addButton);

        let taskType = e.target.parentElement.dataset;
        let taskTypeName = Object.keys(taskType)[0];
        let editLiAttribute = Object.values(taskType)[0];

        const inputText = document.querySelector('input[type="text"]');
        inputText.value = e.target.previousElementSibling.innerText;

        inputText.setAttribute("taskTypeName", taskTypeName);
        inputText.setAttribute("editLiAttribute", editLiAttribute);

    } else return;
}



// Создать задачу при клике на кнопку "Добавить":
// a) при редактировании задачи (поле ввода содержит пользовательские атрибуты),
// b) на основе конструктора из "./task.js";
// поместить задачу в соответствующей колонке, если:
// 1) поле ввода не пустое, 2) выбран уровень срочности, 3) задача не дублируется;
// свернуть форму;
// findDublicateTask() - блокировка ввода дублирующихся задач;
// changeLocalStorage() - сохранение изменений в LocalStorage;

export function submitTask(e) {
    e.preventDefault();

    // console.log("submitTask");

    const inputText = document.querySelector('input[type="text"]');
    const options = document.querySelectorAll("option");

    const { value } = inputText;


    if (inputText.getAttribute("tasktypename")) {

        console.log("0000000");
        editTaskToSubmit(inputText);

    } else {


        if (value === "" || findDublicateTask(value)) {
            console.log(2222222, value, findDublicateTask(value));
            return
        }


        const li = document.createElement("li");


        if (options[0].selected && (inputText.value != "")) {

            console.log('if (options[0].selected && (inputText.value != ""))');

            new NotImportantTask(inputText.value).create(li);

            changeLocalStorage("notImportantStore", notImportantStore);

        } else if (options[1].selected && (inputText.value != "")) {

            console.log('if (options[1].selected && (inputText.value != ""))');

            new ImportantTask(inputText.value).create(li);

            changeLocalStorage("importantStore", importantStore);

        } else if (options[2].selected && (inputText.value != "")) {

            console.log('if (options[2].selected && (inputText.value != ""))');

            new VeryImportantTask(inputText.value).create(li);

            changeLocalStorage("veryImportantStore", veryImportantStore);
        }

        closeForm(close_form);

        console.log("444444444");

    }
}



// Сохранение отредактированной задачи при клике на кнопку "Добавить":

function editTaskToSubmit(inputText) {

    // console.log("editTaskToSubmit");

    const taskTypeName = inputText.getAttribute("tasktypename");
    const editLiAttribute = inputText.getAttribute("editLiAttribute");

    const options = document.querySelectorAll("option");
    const list = document.querySelectorAll("li");

    for (let li of list) {

        if ((Object.keys(li.dataset)[0] === taskTypeName) &&
            (Object.values(li.dataset)[0] === editLiAttribute)) {


            if ((options[0].selected) || (options[1].selected) || (options[2].selected)) {

                console.log("Selected!");

                const label = li.firstElementChild.nextElementSibling;

                if ((label.innerText === inputText.value) || !(findDublicateTask(inputText.value))) {

                    label.innerText = inputText.value;
                    const new_li = document.createElement("li");

                    if ((inputText.getAttribute("tasktypename") === "notImportant") &&
                        (li.getAttribute("data-not-important") === editLiAttribute)) {


                        if (options[0].selected) {

                            console.log("notImportant options[0].selected");

                            notImportantStore[editLiAttribute].name = label.innerText;
                            notImportantStore[editLiAttribute].checked = li.firstElementChild.checked;


                        } else if (options[1].selected) {

                            console.log("notImportant options[1].selected");

                            notImportantStore.splice(li.dataset.notImportant, 1);
                            li.remove();

                            new ImportantTask(inputText.value).create(new_li);


                        } else if (options[2].selected) {

                            console.log("notImportant options[2].selected");

                            notImportantStore.splice(li.dataset.notImportant, 1);
                            li.remove();

                            new VeryImportantTask(inputText.value).create(new_li);

                        } else return;


                    } else if ((inputText.getAttribute("tasktypename") === "important") &&
                        (li.getAttribute("data-important") === editLiAttribute)) {


                        if (options[0].selected) {

                            console.log("important options[0].selected");

                            li.remove();
                            importantStore.splice(li.dataset.important, 1);

                            new NotImportantTask(inputText.value).create(new_li);

                        } else if (options[1].selected) {

                            console.log("important options[1].selected");

                            importantStore[editLiAttribute].name = label.innerText;
                            importantStore[editLiAttribute].checked = li.firstElementChild.checked;

                        } else if (options[2].selected) {

                            console.log("important options[2].selected");
                            importantStore.splice(li.dataset.important, 1);

                            li.remove();
                            new VeryImportantTask(inputText.value).create(new_li);

                        } else return;


                    } else if ((inputText.getAttribute("tasktypename") === "veryImportant") &&
                        (li.getAttribute("data-very-important") === editLiAttribute)) {


                        if (options[0].selected) {

                            console.log("veryImportant options[0].selected");

                            li.remove();
                            veryImportantStore.splice(li.dataset.veryImportant, 1);

                            new NotImportantTask(inputText.value).create(new_li);

                        } else if (options[1].selected) {

                            console.log("veryImportant options[1].selected");

                            li.remove();
                            veryImportantStore.splice(li.dataset.veryImportant, 1);


                            new ImportantTask(inputText.value).create(new_li);

                        } else if (options[2].selected) {

                            console.log("veryImportant options[2].selected");

                            veryImportantStore[editLiAttribute].name = label.innerText;
                            veryImportantStore[editLiAttribute].checked = li.firstElementChild.checked;

                        } else return;
                    }

                    culculateListAtributes(notImportantStore, "data-not-important");
                    culculateListAtributes(importantStore, "data-important");
                    culculateListAtributes(veryImportantStore, "data-very-important");

                    changeLocalStorage("notImportantStore", notImportantStore);
                    changeLocalStorage("importantStore", importantStore);
                    changeLocalStorage("veryImportantStore", veryImportantStore);

                    closeForm(close_form);
                
                } else {

                    console.log("Task is already exists");
                }

            } else {

                console.log("Choose select!");
            }
        }
    }    
}



//         let taskTexst = inputText.value;

//         inputText.value = "";
//         console.log("taskTexst ", taskTexst);


//         if (taskTypeName === "notImportant") {



//             if (options[0].selected) {

//                 console.log("Selected notImportant !");

//                 notImportantStore[editLiAttribute].checked = li.firstElementChild.checked;
//                 changeLocalStorage("notImportantStore", notImportantStore);

//             } else if (options[1].selected) {

//                 console.log("Selected important !");

//                 let checked = li.firstElementChild.checked;
//                 notImportantStore.splice(li.dataset.notImportant, 1); 
//                 li.remove();
//                 changeLocalStorage("notImportantStore", notImportantStore);

//                 new ImportantTask(taskTexst, checked).create(li);
//                 changeLocalStorage("importantStore", importantStore);


//             } else if (options[2].selected  && !(findDublicateTask(taskTexst))) {

//                 console.log("Selected veryImportant !");

//                 let checked = li.firstElementChild.checked;
//                 notImportantStore.splice(li.dataset.notImportant, 1); 
//                 li.remove();
//                 changeLocalStorage("notImportantStore", notImportantStore);

//                 new VeryImportantTask(taskTexst, checked).create(li);
//                 changeLocalStorage("veryImportantStore", veryImportantStore);
//             }

// } else {

//     console.log("Selected not notImportant !");

//     submitBtn.setAttribute("taskTexst", taskTexst);
//     notImportantStore.splice(li.dataset.notImportant, 1);

//         console.log("notImportantStore ", notImportantStore);
//         console.log("submitBtn ", submitBtn);

//     li.remove();
//     changeLocalStorage("notImportantStore", notImportantStore);


//     return;
// }

//     } else if (taskTypeName === "important") {

//         inputText.removeAttribute("tasktypename");
//         inputText.removeAttribute("editLiAttribute");


//         if (options[1].selected) {

//             console.log("Selected important !");

//             importantStore[editLiAttribute].name = taskTexst;
//             importantStore[editLiAttribute].checked = li.firstElementChild.checked;
//             changeLocalStorage("importantStore", importantStore);

//         } else {

//             console.log("Selected not important !");
//             li.remove();
//             changeLocalStorage("importantStore", importantStore);
//             return;
//         }

//     } else if (taskTypeName === "veryImportant") {

//         inputText.removeAttribute("tasktypename");
//         inputText.removeAttribute("editLiAttribute");


//         if (options[2].selected) {

//             console.log("Selected veryImportant !");

//             veryImportantStore[editLiAttribute].name = taskTexst;
//             veryImportantStore[editLiAttribute].checked = li.firstElementChild.checked;
//             changeLocalStorage("veryImportantStore", veryImportantStore);

//         } else {

//             console.log("Selected not veryImportant !");
//             li.remove();
//             changeLocalStorage("veryImportantStore", veryImportantStore);
//             return;
//         }
//     }

//     // changeLocalStorage("notImportantStore", notImportantStore);
//     // changeLocalStorage("importantStore", importantStore);
//     // changeLocalStorage("veryImportantStore", veryImportantStore);

//     closeForm(close_form);

// } else {

//     console.log("Choose select!");
// }
// } else return;

// changeLocalStorage("notImportantStore", notImportantStore);



// Скрыть / показать колонку с заданиями кликом на заголовок:

export function hideShowTasksColumn(e) {

    if (!e.target.classList.contains("title")) {
        return

    } else {
        for (let li of Array.from(e.target.nextElementSibling.children)) {

            if (!li.firstElementChild.checked) {

                li.classList.toggle("clean");
                e.target.classList.toggle("chosen");
            }
        }
    }
}



// Маркировка задач, сохранение статуса маркировки в "./Store.js"

export function markTask(e) {

    if (e.target.tagName !== "INPUT") {

        return;

    } else {

        e.target.setAttribute("checked", e.target.checked);

        let taskType = e.target.nextElementSibling.parentElement.dataset;
        let taskTypeName = Object.keys(taskType)[0];


        if (taskTypeName === "notImportant") {

            changeStoreChecked(notImportantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("notImportantStore", notImportantStore);

        } else if (taskTypeName === "important") {

            changeStoreChecked(importantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("importantStore", importantStore);

        } else if (taskTypeName === "veryImportant") {

            changeStoreChecked(veryImportantStore, taskType, taskTypeName, e.target.checked);
            changeLocalStorage("veryImportantStore", veryImportantStore);
        }
    }
}


// сохранение статуса маркировки в "./Store.js"

function changeStoreChecked(store, type, name, checkedStatus) {

    const storeElementIndex = store.findIndex(el => el.id == type[name]);
    store[storeElementIndex].checked = checkedStatus;
}



// Удалить задачу кликом по иконке-"х", если статус задачи checked:

export function deleteTask(e) {

    if (e.target.classList.contains("delete") &&
        e.target.closest("li").firstElementChild.checked === true) {

        let taskType = e.target.parentElement.dataset;
        let taskTypeName = Object.keys(taskType)[0];

        e.target.closest("li").remove();

        if (taskTypeName === "notImportant") {

            notImportantStore.splice(e.target.parentElement.dataset.notImportant, 1);

            changeLocalStorage("notImportantStore", notImportantStore);
            culculateListAtributes(notImportantStore, "data-not-important");

        } else if (taskTypeName === "important") {

            importantStore.splice(e.target.parentElement.dataset.important, 1);

            culculateListAtributes(importantStore, "data-important");
            changeLocalStorage("importantStore", importantStore);

        } else if (taskTypeName === "veryImportant") {

            veryImportantStore.splice(e.target.parentElement.dataset.veryImportant, 1);

            culculateListAtributes(veryImportantStore, "data-very-important");
            changeLocalStorage("veryImportantStore", veryImportantStore);
        }
    } else return;

    closeForm(close_form);
}



// Переопределить data-attribute и id всех задач при удалении одной из них: 

function culculateListAtributes(store, attribute) {

    const list = document.querySelectorAll(`[${attribute}]`);

    for (let i in store) {
        store[i].id = i;
        list[i].setAttribute(attribute, i);
    }
}



// Блокировка ввода дублирующихся задач:

function findDublicateTask(name) {

    const notImportantDublecateIndex = notImportantStore.findIndex(el => el.name === name);
    const importantDublecateIndex = importantStore.findIndex(el => el.name === name);
    const veryImportantDublecateIndex = veryImportantStore.findIndex(el => el.name === name);

    if (notImportantDublecateIndex === -1 && importantDublecateIndex === -1 && veryImportantDublecateIndex === -1) {
        return false;
    } else {
        return true;
    }
}



// Сохранение изменений в LocalStorage при создании, маркировке и удалении задач;
function changeLocalStorage(name, store) {

    localStorage.setItem(name, JSON.stringify(store));

    console.log("store", store);
}



// Извлечение данных из localStorage при загрузке страницы:

export function reload() {


    if (localStorage.getItem("notImportantStore")) {

        notImportantStore.push(...JSON.parse(localStorage.getItem("notImportantStore")));

        for (let i in notImportantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-not-important", i);

            new Task(notImportantStore[i].name, notImportantStore[i].checked).create(li);

            const ul = document.querySelector(".not-important-task-col ul");
            ul.append(li);
        }
    }

    if (localStorage.getItem("importantStore")) {

        importantStore.push(...JSON.parse(localStorage.getItem("importantStore")));

        for (let i in importantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-important", i);

            new Task(importantStore[i].name, importantStore[i].checked).create(li);

            const ul = document.querySelector(".important-task-col ul");
            ul.append(li);
        }
    }

    if (localStorage.getItem("veryImportantStore")) {

        veryImportantStore.push(...JSON.parse(localStorage.getItem("veryImportantStore")));

        for (let i in veryImportantStore) {

            const li = document.createElement("li");
            li.setAttribute("data-very-important", i);

            new Task(veryImportantStore[i].name, veryImportantStore[i].checked).create(li);

            const ul = document.querySelector(".very-important-task-col ul");
            ul.append(li);
        }
    }
}
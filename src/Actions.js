import "./assets/styles/style.css";


// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":


export function openForm(addButton) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("close");
    addList.classList.add("open");

    addButton.hidden = true;
}



// Свернуть форму при клике на кнопку "x",
// показать кнопку "Создать задачу":


export function closeForm(close_form) {

    const addList = document.querySelector("#add-list");
    addList.classList.remove("open");
    addList.classList.add("close");

    const addButton = document.querySelector("button[data-action=add]");
    addButton.hidden = false;
}



export function submitTask(e) {

    e.preventDefault();
}
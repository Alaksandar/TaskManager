import { openForm, closeForm, submitTask } from "./Actions.js";

import "./assets/styles/style.css";

const addButton = document.querySelector("button[data-action=add]");
const close_form = document.querySelector(".close_form");
const form = document.querySelector("form");


// Раскрыть форму при клике на кнопку "Создать задачу",
// cкрыть кнопку "Создать задачу":

addButton.addEventListener("click", e => openForm(e.target));


// Свернуть форму при клике на кнопку "x",
// показать кнопку "Создать задачу":

close_form.addEventListener("click", e => closeForm(e.target));


// Создать задачу при клике на кнопку "Добавить":

form.addEventListener("submit", e => submitTask(e));
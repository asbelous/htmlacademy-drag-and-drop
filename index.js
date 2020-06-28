const taskListElement = document.querySelector(`.tasks__list`);
const taskElements = taskListElement.querySelectorAll(`.tasks__item`);

for (const task of taskElements) {
    task.draggable = true;
}

taskListElement.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
});

taskListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
});
const taskListElement = document.querySelector(`.tasks__list`);
const taskElements = taskListElement.querySelectorAll(`.tasks__item`);

for (const task of taskElements) {
    task.draggable = true;
}
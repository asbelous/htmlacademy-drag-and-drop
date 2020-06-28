// Разрешаем перетаскивание элементов
const taskListElement = document.querySelector(`.tasks__list`);
const taskElements = taskListElement.querySelectorAll(`.tasks__item`);
// Перебираем все элементы списка и присваиваем нужное значение
for (const task of taskElements) {
    task.draggable = true;
}
// Добавляем реакцию на начало перетаскивания
taskListElement.addEventListener(`dragstart`, (evt) => {
    evt.target.classList.add(`selected`);
});
// Добавляем реакцию на конец перетаскивания
taskListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
});
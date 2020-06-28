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

// Реализуем логику перетаскивания
taskListElement.addEventListener(`dragover`, (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    // Находим перемещаемый элемент
    const activeElement = taskListElement.querySelector(`.selected`);
    // Находим элемент, над которым в данный момент находится курсор
    const currentElement = evt.target;
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`tasks__item`);

    // Если нет, прерываем выполнение функции
    if (!isMoveable) {
        return;
    }

    // Находим элемент, перед которым будем вставлять
    const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;

    // Вставляем activeElement перед nextElement
    taskListElement.insertBefore(activeElement, nextElement);
});

// Учтём положение курсора относительно центра
const getNextElement = (cursorPosition, currentElement) => {
    // Получаем объект с размерами и координатами
    const currentElementCoord = currentElement.getBoundingClientRect();
    // Находим вертикальную координату центра текущего элемента
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    // Если курсор выше центра элемента, возвращаем текущий элемент
    // В ином случае - следующий DOM-элемент
    const nextElement = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;

    return nextElement;
};
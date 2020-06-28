# Туториал. Список задач с drag &amp; drop by HTMLAcademy

В этом туториале мы рассмотрим, как реализовать эффект drag & drop на ванильном JavaScript. Дословный перевод с английского — «потяни и брось» — отражает суть эффекта, это хорошо знакомое любому пользователю перетаскивание элементов интерфейса. Drag & drop может понадобиться в разных ситуациях — например, в таких:

  - Простое визуальное изменение положения элемента.
  - Сортировка элементов с помощью перетаскивания. Пример — сортировка карточек задач в таск-трекере.
  - Изменение контекста элемента. Пример — перенос задачи в таск трекере из одного списка в другой.
  - Перемещение локальных файлов в окно браузера.

Мы разберём drag & drop на примере сортировки. Для этого создадим интерактивный список задач.

## HTML Drag and Drop API

В [стандарте HTML5](https://html.spec.whatwg.org/multipage/dnd.html#dnd) есть API, который позволяет реализовать эффект drag & drop. Он даёт возможность с помощью специальных событий контролировать захват элемента на странице мышью и его перемещение в новое положение. Рассмотрим этот API подробнее.

По умолчанию перемещаться могут только ссылки, изображения и выделенные фрагменты. Если начать перетаскивать их, появится фантомная копия, которая будет следовать за курсором. Чтобы добавить возможность перетаскивания другим элементам, нужно задать атрибуту draggable значение true.

<div draggable="true">Draggable element</div>

Далее для реализации перемещения используется ряд событий, которые срабатывают на разных этапах. Полный список есть на MDN, а мы рассмотрим основные.

    drag — срабатывает каждые несколько сотен миллисекунд, пока элемент перетаскивается.
    dragstart — срабатывает в момент начала перетаскивания элемента.
    dragend — срабатывает в момент, когда перетаскивание элемента завершено.
    dragover — срабатывает каждые несколько сотен миллисекунд, пока перетаскиваемый элемент находится над зоной, в которую может быть сброшен.
    drop — срабатывает в тот момент, когда элемент будет брошен, если он может быть перемещён в текущую зону.

При успешном перемещении элемент должен оказаться на новом месте. Но по умолчанию большинство областей на странице недоступны для сброса. Чтобы создать область, в которую элементы могут быть сброшены, необходимо слушать событие dragover или drop на нужном элементе и отменять действие по умолчанию с помощью метода preventDefault. Тогда стандартное поведение будет переопределено — перетаскивание и сброс в эту область станут возможными. Рассмотрим на примере чуть позже.

Это далеко не все возможности API. Также в нём есть несколько интерфейсов, которые помогают получать доступ к данным перетаскиваемого элемента и изменять их. Например, существует объект DataTransfer, который кроме всего прочего хранит информацию о локальных файлах, если они перетаскиваются. В этом туториале нам не понадобится использовать эти возможности, но без DataTransfer не обойтись, если нужно, например, загружать файлы с компьютера и считывать данные, чтобы затем производить с ними какие-либо манипуляции. Подробно об этом на [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop).

Приступим к созданию нашего списка задач и рассмотрим на примере, как работать с HTML Drag and Drop API.

## Вёрстка и стилизация списка задач

Список будет состоять из нескольких задач и заголовка. Для начала создадим разметку. Здесь всё просто — если речь идёт о списке, значит нужен тег ul.

<section class="tasks">
  <h1 class="tasks__title">To do list</h1>

  <ul class="tasks__list">
    <li class="tasks__item">learn HTML</li>
    <li class="tasks__item">learn CSS</li>
    <li class="tasks__item">learn JavaScript</li>
    <li class="tasks__item">learn PHP</li>
    <li class="tasks__item">stay alive</li>
  </ul>
</section>

Теперь добавим элементам базовую стилизацию:

body {
  font-family: "Tahoma", sans-serif;
  font-size: 18px;
  line-height: 25px;
  color: #164a44;
  background-color: #b2d9d0;
}

.tasks__title {
    margin: 50px 0 20px 0;
    text-align: center;
    text-transform: uppercase;
 }

.tasks__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tasks__item {
  transition: background-color 0.5s;
  margin-bottom: 10px;
  padding: 5px;
  text-align: center;
  border: 2px dashed #b2d9d0;
  border-radius: 10px;
  cursor: move;
  background-color: #dff2ef;
  transition: background-color 0.5s;
}

.tasks__item:last-child {
  margin-bottom: 0;
}

.selected {
  opacity: 0.6;
}

Здесь стоит обратить внимание на тип курсора, который мы указали — move. Все элементы списка смогут перемещаться, а с помощью курсора move мы подсказываем пользователю, что есть такая возможность.

Также мы задали стилизацию для класса selected, который чуть позже будем добавлять программно при взаимодействии с элементом.

## Реализация drag & drop

### Шаг 1. Разрешим перетаскивание элементов

Переходим к JavaScript. В первую очередь присвоим элементам упомянутый ранее атрибут draggable со значением true, чтобы разрешить задачам перемещаться. Это можно сделать прямо в разметке или с помощью JavaScript.

const tasksListElement = document.querySelector(`.tasks__list`);

const taskElements = tasksListElement.querySelectorAll(`.tasks__item`);

// Перебираем все элементы списка и присваиваем нужное значение

for (const task of taskElements) {
  task.draggable = true;
}

Уже сейчас перетаскивание доступно для элементов, но пока это выражается только в появлении фантомной копии. Своего положения элементы не меняют, добавим перемещение чуть позже.

### Шаг 2. Добавим реакцию на начало и конец перетаскивания

Будем отслеживать события dragstart и dragend на всём списке. В начале перетаскивания будем добавлять класс selected элементу списка, на котором было вызвано событие. После окончания перетаскивания будем удалять этот класс.

tasksListElement.addEventListener(`dragstart`, (evt) => {
  evt.target.classList.add(`selected`);
})

tasksListElement.addEventListener(`dragend`, (evt) => {
  evt.target.classList.remove(`selected`);
});

### Шаг 3. Реализуем логику перетаскивания

Мы добрались до основной части — перетаскивания задач. Будем отслеживать местоположение перемещаемого элемента относительно других, подписавшись на событие dragover. Благодаря тому, что оно срабатывает очень часто, мы сможем на лету вставлять элемент в нужное место в зависимости от положения курсора. Для этого реализуем такую логику:

    Делаем всю область списка доступной для сброса.
    Находим выбранный элемент .selected и тот элемент, на котором сработало событие dragover.
    Проверяем, что событие dragover сработало не на выбранном элементе, потому что иначе перемещать элемент нет смысла — он уже на нужном месте.
    Также проверяем, что dragover сработало именно на одном из элементов списка. Это важно, потому что курсор может оказаться и на пустом пространстве между элементами, а оно нас не интересует.
    Находим элемент, перед которым нужно осуществить вставку. Сделаем это, сравнив положение выбранного элемента и текущего, на который наведён курсор.
    Вставляем выбранный элемент на новое место.

Напишем код:

tasksListElement.addEventListener(`dragover`, (evt) => {

  // Разрешаем сбрасывать элементы в эту область
  
  evt.preventDefault();

  // Находим перемещаемый элемент
  
  const activeElement = tasksListElement.querySelector(`.selected`);
  
  // Находим элемент, над которым в данный момент находится курсор
  
  const currentElement = evt.target;
  
  // Проверяем, что событие сработало:
  
  // 1. не на том элементе, который мы перемещаем,
  
  // 2. именно на элементе списка
  
  const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`tasks__item`);

  // Если нет, прерываем выполнение функции
  
  if (!isMoveable) {
    return;
  }

  // Находим элемент, перед которым будем вставлять
  
  const nextElement = (currentElement === activeElement.nextElementSibling) ?
      currentElement.nextElementSibling :
      currentElement;

  // Вставляем activeElement перед nextElement
  
  tasksListElement.insertBefore(activeElement, nextElement);
  
});

Для поиска nextElement мы использовали тернарный оператор. Если вы ещё с ним не знакомы, это можно исправить, прочитав [статью](https://htmlacademy.ru/blog/boost/frontend/ternary-operator).

В целом получившийся на этом этапе код — рабочий. Уже сейчас элементы можно сортировать так, как мы и планировали. Но при этом у варианта есть недостаток — перемещаемый элемент меняет положение в тот момент, когда курсор попадает на другой элемент. Такое поведение недостаточно оптимально и стабильно. С точки зрения пользователя логичнее ориентироваться на центр элемента. То есть мы должны осуществлять вставку только после того, как курсор пересечёт центральную ось, а не сразу после наведения на элемент. Чтобы реализовать это поведение, напишем функцию для получения nextElement другим способом.

### Шаг 4. Учтём положение курсора относительно центра

Функция должна принимать на вход вертикальную координату курсора и текущий элемент, на котором сработало событие dragover. Мы будем сравнивать текущее положение курсора с центральной осью элемента, над которым курсор находится в момент перетаскивания. Таким образом, если мы хотим поменять элементы местами, то вставка должна сработать в тот момент, когда курсор пересекает центральную ось. Значит нас интересуют вертикальные координаты курсора и центра элемента, над которым он находится.

Давайте создадим функцию getNextElement(). Мы уже знаем, что она должна возвращать тот элемент, перед которым нужно сделать вставку. В этом нам поможет координата курсора и текущий элемент, которые будут переданы в параметры.

Чтобы получить вертикальную координату текущего элемента, используем [метод](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) getBoundingClientRect(). Он вызывается на элементе и возвращает объект, в свойствах которого находится информация о размерах и координатах элемента относительно вьюпорта. Нам понадобится координата y, но также нужно будет учесть высоту элемента height, потому что у рассчитывается относительно верхнего левого угла элемента, а нам нужен центр.

const getNextElement = (cursorPosition, currentElement) => {

  // Получаем объект с размерами и координатами
  
  const currentElementCoord = currentElement.getBoundingClientRect();
  
  // Находим вертикальную координату центра текущего элемента
  
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

  // Если курсор выше центра элемента, возвращаем текущий элемент
  
  // В ином случае — следующий DOM-элемент
  
  const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

  return nextElement;
};

Давайте закрепим на примере. Допустим, мы хотим поменять два элемента местами — начинаем перемещать нижний элемент, наводим курсор на элемент перед ним. Пока мы не приблизились к центру элемента, ничего происходить не должно, потому что пока порядок элементов в DOM изменять не нужно. Но как только курсор пересечёт центральную ось, перемещаемый элемент будет вставлен перед тем элементом, на который мы навели курсор.

Всё почти готово, но нам нужно ещё учесть ситуацию, когда во время перемещения курсор был наведён на какой-то элемент и при этом центральную ось так и не пересёк. Для нас это значит, что порядок не изменился, и ничего делать не надо. Но программа пока об этом не знает и в таких ситуациях осуществляет вставку в DOM на то же самое место при каждом срабатывании события dragover. Как мы помним, оно срабатывает очень часто и каждый раз влечёт за собой ненужные операции с DOM. Мы изменим это поведение, добавив проверку.

tasksListElement.addEventListener(`dragover`, (evt) => {
  evt.preventDefault();

  const activeElement = tasksListElement.querySelector(`.selected`);
  
  const currentElement = evt.target;
  
  const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`tasks__item`);

  if (!isMoveable) {
    return;
  }

  // evt.clientY — вертикальная координата курсора в момент,
  
  // когда сработало событие
  
  const nextElement = getNextElement(evt.clientY, currentElement);

  // Проверяем, нужно ли менять элементы местами
  
  if (
    nextElement && 
    activeElement === nextElement.previousElementSibling ||
    activeElement === nextElement
  ) {
    // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
    return;
  }

  tasksListElement.insertBefore(activeElement, nextElement);
});

Теперь всё работает так, как нужно: мы отслеживаем положение курсора относительно центра, лишние операции в DOM исключили и, главное, элементы сортируются — задача выполнена! Полный код решения — в нашей [интерактивной демонстрации](https://htmlacademy.ru/demos/65).

## Полезности

    HTML Drag and Drop API на MDN. Вся основная информация об API.
    Native HTML5 Drag and Drop. Статья с описанием основных возможностей API и примером использования. Есть перевод на русский.
    How to make a Drag-and-Drop file uploader with vanilla JavaScript. Статья о том, как реализовать загрузку файлов с помощью drag & drop.
    Drag & drop с событиями мыши. Пример, как реализовать эффект без использования HTML Drag and Drop API. Это может понадобиться, например, из-за плохой поддержки API мобильными браузерами.
    10 Best Drag And Drop JavaScript Libraries. Список JavaScript-библиотек, с помощью которых можно усовершенствовать встроенный drag & drop.

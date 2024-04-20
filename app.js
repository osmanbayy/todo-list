//!Select all elements
const form = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('.list-group');
const firstCardBody = document.querySelectorAll('.card-body')[0];
const secondCardBody = document.querySelectorAll('.card-body')[1];
const filterInput = document.querySelector('#filter-input');
const clearButton = document.querySelector('#clear-todos');
const listItems = document.querySelectorAll('.list-group-item');

eventListeners();

function eventListeners() {
    form.addEventListener('submit', addTodoFunc);

    document.addEventListener('DOMContentLoaded', loadAllTodosToUI);

    secondCardBody.addEventListener('click', deleteTodoFunc);

    filterInput.addEventListener('keyup', filterTodoFunc);

    clearButton.addEventListener('click', clearAllTodosFunc);
}

function clearAllTodosFunc() {
    if (confirm('Bütün yapılacaklar silinecek. Emin misiniz?')) {

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");

        showAlert("success", "Tüm yapılacaklar silindi...");
    }
}

function addTodoFunc(event) {
    const newTodo = todoInput.value.trim();
    //!trim ile başındaki ve sonundaki olası boşlukları sildik
    if (newTodo === '') {
        showAlert("danger", "Bir değer girmelisiniz...");
    } else {
        addTodoToUI(newTodo);
    }

    event.preventDefault();
}

function deleteTodoFunc(event) {
    if (event.target.className === 'fa fa-remove') {
        event.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(event.target.parentElement.parentElement.textContent);
        showAlert("success", "Başarıyla silindi...");
    }
}

function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1); //!index'ten sonra 1 değer sil
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodoFunc(event) {
    const filterValue = event.target.value.toLowerCase();

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute('style', 'display: none !important');
        } else {
            listItem.setAttribute('style', 'display: block');
        }
    });
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    setTimeout(function () {
        alert.remove();
    }, 1500);
}

function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodoToUI(todo);
    });
}

function addTodoToUI(newTodo) {
    const todos = getTodosFromStorage();

    if(todos.includes(newTodo)){
        showAlert("danger","Zaten listenizde bulunuyor...");
        todoInput.value = '';
        return;
    }else{
        addTodoToStorage(newTodo);
    }

    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between';

    const link = document.createElement('a');
    link.setAttribute('href', '#');
    link.className = 'delete-item';
    link.innerHTML = '<i class = "fa fa-remove"></i>';

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);
    todoInput.value = '';

    showAlert("success", "Başarıyla eklendi...");
}
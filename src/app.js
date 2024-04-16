// global code
let filterValue = "all";
//selecting
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");

// items
class items {
  static addNewTodo(event) {
    ui.fixRefresh();
    if (!todoInput.value) return null;

    let mainTodoData = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      title: todoInput.value,
      isCompleted: false,
    };

    storage.saveTodo(mainTodoData);
    ui.filtersData();
  }
}

// show ui
class ui {
  static fixRefresh() {
    event.preventDefault();
  }

  static clearInput() {
    todoInput.value = "";
  }

  static showDOM(todosDOM) {
    let result = "";
    todosDOM.forEach((todo) => {
      result += `<li class="todo">
        <p class="todo__title ${todo.isCompleted && "completed"}">${
        todo.title
      }</p>
        <span class="todo__createdAt">${new Date(
          todo.createdAt
        ).toLocaleDateString("fa-IR")}</span>
        <button class="todo__check" data-todo-id=${
          todo.id
        } ><i class="far fa-check-square"></i></button>
        <button class="todo__remove" data-todo-id=${
          todo.id
        } ><i class="far fa-trash-alt"></i></button>
      </li>`;
    });
    todoList.innerHTML = result;
    ui.clearInput();

    ui.eventListenerRemove();
    ui.eventListenerCheck();
  }

  static filtersData() {
    const todos = storage.getAllData();

    switch (filterValue) {
      case "all": {
        ui.showDOM(todos);
        break;
      }
      case "completed": {
        const filterdTodos = todos.filter((todo) => todo.isCompleted);
        ui.showDOM(filterdTodos);
        break;
      }
      case "uncompleted": {
        const filterdTodos = todos.filter((todo) => !todo.isCompleted);
        ui.showDOM(filterdTodos);
        break;
      }
      default:
        ui.showDOM(todos);
    }
  }

  static eventListenerRemove() {
    const removeBtns = [...document.querySelectorAll(".todo__remove")];
    removeBtns.forEach((btn) => btn.addEventListener("click", ui.removeTodo));
  }

  static removeTodo(event) {
    let todos = storage.getAllData();
    const todoId = Number(event.target.dataset.todoId);
    todos = todos.filter((todo) => todo.id !== todoId);
    storage.saveAllTodos(todos);
    ui.filtersData();
  }

  static eventListenerCheck() {
    const checkBtns = [...document.querySelectorAll(".todo__check")];
    checkBtns.forEach((btn) => btn.addEventListener("click", ui.checkTodo));
  }

  static checkTodo(event) {
    let todos = storage.getAllData();
    const todoId = Number(event.target.dataset.todoId);
    const todo = todos.find((t) => t.id === todoId);
    todo.isCompleted = !todo.isCompleted;
    storage.saveAllTodos(todos);
    ui.filtersData();
  }
}
// localstorage
class storage {
  static getAllData() {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    return savedTodos;
  }

  static saveTodo(todo) {
    const savedTodos = storage.getAllData();
    savedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    return savedTodos;
  }

  static saveAllTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// eventListener
todoForm.addEventListener("submit", items.addNewTodo);

selectFilter.addEventListener("change", (event) => {
  filterValue = event.target.value;
  ui.filtersData();
});

document.addEventListener("DOMContentLoaded", (event) => {
  const todos = storage.getAllData();
  ui.showDOM(todos);
});

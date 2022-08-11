const form = document.getElementById("myform");
const addInput = document.getElementById("todo");
const editInput = document.getElementById("edit-input");
const todoContainer = document.getElementById("container");

let isEdited = false;
let editableItem = {};
const itemInLocalStorage = JSON.parse(localStorage.getItem("items")) || [];
const saveLocalStorage = (items) => {
  localStorage.setItem("items", JSON.stringify(items));
};
const filterLocalstorage = (editid) => {
  const filteredItem = itemInLocalStorage.filter(
    (items) => items.id === editid
  )[0];
  return filteredItem;
};

const createListElement = (item) => {
  const li = document.createElement("li");
  li.setAttribute("data-id", item.id);
  li.innerHTML = `
        <span>
            <span class="todo-text">${item.todo}</span>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </span>
        `;
  return li;
};


const renderElementOnRefresh = () => {
  itemInLocalStorage.forEach((item) => {
    const li = createListElement(item);
    todoContainer.appendChild(li);
  });
};


const saveEdited = (id, newvalue) => {
  const itemToEdit = itemInLocalStorage.filter((item) => item.id === id)[0];
  itemToEdit.todo = newvalue;
  saveLocalStorage(itemInLocalStorage);
  location.reload();
};


const addTodo = (e) => {
  e.preventDefault();
  if (!isEdited && addInput.value === "") {
    alert("Field cannot be empty");
    return;
  }

  if (isEdited) {
    if (editInput.value === "") {
      lert("Field cannot be empty");
      return;
    }
    saveEdited(editableItem, editInput.value);
    return;
  }

  const id = Math.floor(Math.random() * 100);
  const todoItem = {
    id,
    todo: addInput.value,
  };

  const li = createListElement(todoItem);
  todoContainer.appendChild(li);
  addInput.value = "";
  itemInLocalStorage.push(todoItem);
  saveLocalStorage(itemInLocalStorage);
};

const deleteItem = (id) => {
  const filteredItem = itemInLocalStorage.filter((items) => items.id !== id);
  saveLocalStorage(filteredItem);
  location.reload();
};

const deleteUpdate = (e) => {
  if (e.target.classList.contains("delete")) {
    const li = e.target.parentElement.parentElement;
    const id = parseInt(li.getAttribute("data-id"));
    deleteItem(id);
  } else if (e.target.classList.contains("edit")) {
    const li = e.target.parentElement.parentElement;
    const id = parseInt(li.getAttribute("data-id"));
    const filteredItem = filterLocalstorage(id);
    editInput.type = "text";
    addInput.type = "hidden";
    editInput.value = filteredItem.todo;
    isEdited = true;
    editableItem = id;
  } else {
    return;
  }
};

renderElementOnRefresh();
todoContainer.addEventListener("click", deleteUpdate);
form.addEventListener("submit", addTodo);
export function updateListEditorTitle(title) {
  const listEditorTitle = document.querySelector(".list-editor__title");
  listEditorTitle.innerText = title;
}

export function createTaskManagerContent(listId) {
  const addTaskBtn = document.createElement("button");
  addTaskBtn.classList.add("btn", "task-manager__add-task-btn");
  addTaskBtn.innerText = "Добавить задачу";

  const tasks = document.createElement("div");
  tasks.classList.add("task-manager__tasks");

  const taskManagerContent = document.createElement("div");
  taskManagerContent.classList.add("task-manager__content");
  taskManagerContent.dataset.listid = listId;
  taskManagerContent.append(addTaskBtn, tasks);

  return taskManagerContent;
}
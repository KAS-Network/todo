import {
  onPopupCancelBtnCLick,
  closePopup
} from "./popup.js";
import {SimpleBar} from "./simplebar.js";
import {
  dbAddNewTask,
  getAllTasksByListId,
  editTaskTextById,
  deleteTaskById
} from "./local-storage.js";

export function updateListEditorTitle(title) {
  const listEditorTitle = document.querySelector(".list-editor__title");
  listEditorTitle.innerText = title;
}

function onNewTaskPopupNameInput(input) {
  const popupInput = input.currentTarget;
  const popupWrapper = popupInput.closest(".new-task-popup__wrapper");
  const popupAddBtn = popupWrapper.querySelector(".new-task-popup__add-btn");
  if (popupInput.value.trim().length > 0) {
    popupAddBtn.disabled = false;
  } else {
    popupAddBtn.disabled = true;
  }
}

function onEditTaskPopupTextInput(input) {
  const popupInput = input.currentTarget;
  const popupWrapper = popupInput.closest(".edit-task-popup__wrapper");
  const popupSaveBtn = popupWrapper.querySelector(".edit-task-popup__save-btn");
  if (popupInput.value.trim().length > 0) {
    popupSaveBtn.disabled = false;
  } else {
    popupSaveBtn.disabled = true;
  }
}

function onEditTaskPopupSaveBtnClick(click) {
  const btn = click.currentTarget;
  const popupWrapper = btn.closest(".edit-task-popup__wrapper");
  const popup = popupWrapper.closest(".edit-task-popup");
  const taskId = popup.dataset.taskid;
  const popupInput = popupWrapper.querySelector(".edit-task-popup__input");
  const targetTask = document.querySelector(`.task-manager__task[data-id="${taskId}"]`);
  const taskContent = targetTask.querySelector(".task-manager__task-content");
  const taskText = popupInput.value.trim();
  taskContent.innerText = taskText;
  editTaskTextById(taskId, taskText);
  closePopup(popup);
}

function createEditTaskPopup(taskId, taskText) {
  const popupTitle = document.createElement("h2");
  popupTitle.classList.add("popup__title", "edit-task-popup__title");
  popupTitle.innerText = "Редактировать";

  const popupInput = document.createElement("input");
  popupInput.classList.add("input-text", "edit-task-popup__input");
  popupInput.type = "text";
  popupInput.value = taskText;
  popupInput.addEventListener("input", onEditTaskPopupTextInput);

  const popupCancelBtn = document.createElement("button");
  popupCancelBtn.classList.add("popup__btn", "popup__cancel-btn", "edit-task-popup__btn", "edit-task-popup__cancel-btn");
  popupCancelBtn.innerText = "Отмена";
  popupCancelBtn.addEventListener("click", onPopupCancelBtnCLick);

  const popupSaveBtn = document.createElement("button");
  popupSaveBtn.classList.add("popup__btn", "popup__save-btn", "edit-task-popup__btn", "edit-task-popup__save-btn");
  popupSaveBtn.innerText = "ОК";
  popupSaveBtn.addEventListener("click", onEditTaskPopupSaveBtnClick);

  const popupControl = document.createElement("div");
  popupControl.classList.add("popup__control", "edit-task-popup__control");
  popupControl.append(popupCancelBtn, popupSaveBtn);

  const popupWrapper = document.createElement("div");
  popupWrapper.classList.add("popup__wrapper", "edit-task-popup__wrapper");
  popupWrapper.append(popupTitle, popupInput, popupControl);

  const popup = document.createElement("div");
  popup.classList.add("popup", "edit-task-popup");
  popup.dataset.taskid = taskId;
  popup.append(popupWrapper);

  return popup;
}

function onTaskEditBtnClick(click) {
  click.stopPropagation();
  const btn = click.currentTarget;
  const task = btn.closest(".task-manager__task");
  const taskContent = task.querySelector(".task-manager__task-content");
  document.body.append(createEditTaskPopup(task.dataset.id, taskContent.innerText));
}

function onTaskDeleteBtnClick(click) {
  const btn = click.currentTarget;
  const taskItem = btn.closest(".task-manager__task");
  const taskId = taskItem.dataset.id;
  taskItem.classList.add("task-manager__task_fade-out");
  taskItem.addEventListener("animationend", animationend => {
    if (animationend.animationName === "task-fade-out") {
      taskItem.classList.add("task-manager__task_collapse");
    } else if (animationend.animationName === "task-collapse") {
      taskItem.remove();
    }
  });
  deleteTaskById(taskId);
}

function createTaskItem(taskId, taskText, taskStatus) {
  const taskDoneBtn = document.createElement("button");
  taskDoneBtn.classList.add("task-manager__task-done-btn");

  const taskContent = document.createElement("p");
  taskContent.classList.add("task-manager__task-content");
  taskContent.innerText = taskText;

  const taskEditBtn = document.createElement("button");
  taskEditBtn.classList.add("task-manager__task-edit-btn");
  taskEditBtn.addEventListener("click", onTaskEditBtnClick);

  const taskDeleteBtn = document.createElement("button");
  taskDeleteBtn.classList.add("task-manager__task-delete-btn");
  taskDeleteBtn.addEventListener("click", onTaskDeleteBtnClick);

  const taskControl = document.createElement("div");
  taskControl.classList.add("task-manager__task-control");
  taskControl.append(taskEditBtn, taskDeleteBtn);

  const taskWrapper = document.createElement("div");
  taskWrapper.classList.add("task-manager__task-wrapper");
  taskWrapper.append(taskDoneBtn, taskContent, taskControl);

  const taskItem = document.createElement("li");
  taskItem.classList.add("task-manager__task", "task-manager__unfulfilled-task");
  taskItem.dataset.id = taskId;
  taskItem.dataset.status = taskStatus;
  taskItem.append(taskWrapper);

  return taskItem;
}

function onNewTaskPopupAddBtnClick(click) {
  const btn = click.currentTarget;
  const popupWrapper = btn.closest(".new-task-popup__wrapper");
  const popup = popupWrapper.closest(".new-task-popup");
  const popupInput = popupWrapper.querySelector(".new-task-popup__input");
  const listId = popup.dataset.listid;
  const taskManagerContent = document.querySelector(`.task-manager__content[data-listid="${listId}"]`);
  const unfulfilledTaskList = taskManagerContent.querySelector(".task-manager__unfulfilled-tasks");
  const taskText = popupInput.value.trim();
  const newTaskId = dbAddNewTask(listId, taskText);
  unfulfilledTaskList.prepend(createTaskItem(newTaskId, taskText, "unfulfilled"));

  closePopup(popup);
}

function createNewTaskPopup(listId) {
  const popupTitle = document.createElement("h2");
  popupTitle.classList.add("popup__title", "new-task-popup__title");
  popupTitle.innerText = "Новая задача";

  const popupInput = document.createElement("input");
  popupInput.classList.add("input-text", "new-task-popup__input");
  popupInput.type = "text";
  popupInput.value = "Без содержания";
  popupInput.addEventListener("input", onNewTaskPopupNameInput);

  const popupCancelBtn = document.createElement("button");
  popupCancelBtn.classList.add("popup__btn", "popup__cancel-btn", "new-task-popup__btn", "new-task-popup__cancel-btn");
  popupCancelBtn.innerText = "Отмена";
  popupCancelBtn.addEventListener("click", onPopupCancelBtnCLick);

  const popupAddBtn = document.createElement("button");
  popupAddBtn.classList.add("popup__btn", "popup__add-btn", "new-task-popup__btn", "new-task-popup__add-btn");
  popupAddBtn.innerText = "Добавить";
  popupAddBtn.addEventListener("click", onNewTaskPopupAddBtnClick);

  const popupControl = document.createElement("div");
  popupControl.classList.add("popup__control", "new-task-popup__control");
  popupControl.append(popupCancelBtn, popupAddBtn);

  const popupWrapper = document.createElement("div");
  popupWrapper.classList.add("popup__wrapper", "new-task-popup__wrapper");
  popupWrapper.append(popupTitle, popupInput, popupControl);

  const popup = document.createElement("div");
  popup.classList.add("popup", "new-task-popup");
  popup.dataset.listid = listId;
  popup.append(popupWrapper);

  return popup;
}

function onAddTaskBtnClick(click) {
  const btn = click.currentTarget;
  const taskManagerContent = btn.closest(".task-manager__content");
  document.body.append(createNewTaskPopup(taskManagerContent.dataset.listid));
}

export function createTaskManagerContent(listId) {
  const addTaskBtn = document.createElement("button");
  addTaskBtn.classList.add("btn", "task-manager__add-task-btn");
  addTaskBtn.innerText = "Добавить задачу";
  addTaskBtn.addEventListener("click", onAddTaskBtnClick);

  const unfulfilledTasks = document.createElement("ul");
  unfulfilledTasks.classList.add("task-manager__unfulfilled-tasks");
  const taskList = getAllTasksByListId(listId);
  for (const task of taskList.filter(task => task.status === "unfulfilled")) {
    unfulfilledTasks.append(createTaskItem(task.id, task.text, task.status));
  }

  const tasks = document.createElement("div");
  tasks.classList.add("task-manager__tasks");
  tasks.append(unfulfilledTasks);
  new SimpleBar(tasks);
  
  const fulfilledTaskList = taskList.filter(task => task.status === "fulfilled");
  if (fulfilledTaskList.length > 0) {
    const fulfilledTasksOpenBtn = document.createElement("button");
    fulfilledTasksOpenBtn.classList.add("task-manager__fulfilled-tasks-open-btn");
    fulfilledTasksOpenBtn.innerText = "Выполненные задачи";

    const fulfilledTasks = document.createElement("ul");
    fulfilledTasks.classList.add("task-manager__fulfilled-tasks");

    for (const task of fulfilledTaskList) {
      fulfilledTasks.append(createTaskItem(task.id, task.text, task.status));
    }

    const fulfilledTasksWrapper = document.createElement("div");
    fulfilledTasksWrapper.classList.add("task-manager__fulfilled-tasks-wrapper");
    fulfilledTasksWrapper.append(fulfilledTasksOpenBtn, fulfilledTasks);
    
    tasks.append(fulfilledTasksWrapper);
  }
  
  const taskManagerContent = document.createElement("div");
  taskManagerContent.classList.add("task-manager__content");
  taskManagerContent.dataset.listid = listId;
  taskManagerContent.append(addTaskBtn, tasks);

  return taskManagerContent;
}

export function createTaskManagerPlug() {
  const plug = document.createElement("div");
  plug.classList.add("task-manager__plug");
  plug.innerText = "Откройте или создайте список задач";
  return plug;
}
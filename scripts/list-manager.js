import {
  onPopupCancelBtnCLick,
  closePopup
} from "./popup.js";
import {
  dbAddNewList,
  getAllLists,
  renameListById,
  deleteListById
} from "./local-storage.js";
import {
  updateListEditorTitle,
  createTaskManagerContent,
  createTaskManagerPlug
} from "./list-editor.js";

function onRenameListPopupNameInput(input) {
  const popupInput = input.currentTarget;
  const popupWrapper = popupInput.closest(".rename-list-popup__wrapper");
  const popupSaveBtn = popupWrapper.querySelector(".rename-list-popup__save-btn");
  if (popupInput.value.trim().length > 0) {
    popupSaveBtn.disabled = false;
  } else {
    popupSaveBtn.disabled = true;
  }
}

function onRenameListPopupSaveBtnClick(click) {
  const btn = click.currentTarget;
  const popupWrapper = btn.closest(".rename-list-popup__wrapper");
  const popup = popupWrapper.closest(".rename-list-popup");
  const popupInput = popupWrapper.querySelector(".rename-list-popup__input");
  const listOfLists = document.querySelector(".list-manager__list-of-lists");
  const listId = popup.dataset.listid;
  const targetUserList = listOfLists.querySelector(`.user-list[data-id="${listId}"]`);
  const userListName = targetUserList.querySelector(".user-list__name");
  const listName = popupInput.value.trim();
  userListName.innerText = listName;
  renameListById(listId, listName);
  closePopup(popup);
}

function createRenameListPopup(listId, listName) {
  const popupTitle = document.createElement("h2");
  popupTitle.classList.add("popup__title", "rename-list-popup__title");
  popupTitle.innerText = "Переименовать";

  const popupInput = document.createElement("input");
  popupInput.classList.add("input-text", "rename-list-popup__input");
  popupInput.type = "text";
  popupInput.value = listName;
  popupInput.addEventListener("input", onRenameListPopupNameInput);

  const popupCancelBtn = document.createElement("button");
  popupCancelBtn.classList.add("popup__btn", "popup__cancel-btn", "rename-list-popup__btn", "rename-list-popup__cancel-btn");
  popupCancelBtn.innerText = "Отмена";
  popupCancelBtn.addEventListener("click", onPopupCancelBtnCLick);

  const popupSaveBtn = document.createElement("button");
  popupSaveBtn.classList.add("popup__btn", "popup__save-btn", "rename-list-popup__btn", "rename-list-popup__save-btn");
  popupSaveBtn.innerText = "ОК";
  popupSaveBtn.addEventListener("click", onRenameListPopupSaveBtnClick);

  const popupControl = document.createElement("div");
  popupControl.classList.add("popup__control", "rename-list-popup__control");
  popupControl.append(popupCancelBtn, popupSaveBtn);

  const popupWrapper = document.createElement("div");
  popupWrapper.classList.add("popup__wrapper", "rename-list-popup__wrapper");
  popupWrapper.append(popupTitle, popupInput, popupControl);

  const popup = document.createElement("div");
  popup.classList.add("popup", "rename-list-popup");
  popup.dataset.listid = listId;
  popup.append(popupWrapper);

  return popup;
}

function onListRenameBtnClick(click) {
  click.stopPropagation();
  const btn = click.currentTarget;
  const userList = btn.closest(".user-list");
  const userListName = userList.querySelector(".user-list__name");
  document.body.append(createRenameListPopup(userList.dataset.id, userListName.innerText));
}

function onListDeleteBtnClick(click) {
  click.stopPropagation();
  const btn = click.currentTarget;
  const userList = btn.closest(".user-list");
  userList.classList.add("user-list_fade-out");
  userList.addEventListener("animationend", animationend => {
    if (animationend.animationName === "user-list-fade-out") {
      userList.classList.add("user-list_collapse");
    } else if (animationend.animationName === "user-list-collapse") {
      userList.remove();
    }
  });
  const taskManager = document.querySelector(".task-manager");
  taskManager.replaceChildren(createTaskManagerPlug());
  deleteListById(userList.dataset.id);
}

function onUserListClick(click) {
  const userList = click.currentTarget;
  const userListId = userList.dataset.id;
  const userListName = userList.querySelector(".user-list__name");
  const taskManager = document.querySelector(".task-manager");
  updateListEditorTitle(userListName.innerText);
  taskManager.replaceChildren(createTaskManagerContent(userListId));
}

function createUserListElement(listId, listName) {
  const listTitle = document.createElement("h3");
  listTitle.classList.add("user-list__name");
  listTitle.innerText = listName;

  const listRenameBtn = document.createElement("button");
  listRenameBtn.classList.add("user-list__btn", "user-list__rename-btn");
  listRenameBtn.addEventListener("click", onListRenameBtnClick);

  const listDeleteBtn = document.createElement("button");
  listDeleteBtn.classList.add("user-list__btn", "user-list__delete-btn");
  listDeleteBtn.addEventListener("click", onListDeleteBtnClick);

  const listControl = document.createElement("div");
  listControl.classList.add("user-list__control");
  listControl.append(listRenameBtn, listDeleteBtn);

  const listWrapper = document.createElement("div");
  listWrapper.classList.add("user-list__wrapper");
  listWrapper.append(listTitle, listControl);

  const list = document.createElement("li");
  list.classList.add("user-list", "list-manager__user-list");
  list.dataset.id = listId;
  list.append(listWrapper);
  list.addEventListener("click", onUserListClick);

  return list;
}

function onNewListPopupCreateBtnClick(click) {
  const btn = click.currentTarget;
  const popupWrapper = btn.closest(".new-list-popup__wrapper");
  const popup = popupWrapper.closest(".new-list-popup");
  const popupInput = popupWrapper.querySelector(".new-list-popup__input");
  const listOfLists = document.querySelector(".list-manager__list-of-lists");

  const listName = popupInput.value.trim();
  const listId = dbAddNewList(listName);
  listOfLists.prepend(createUserListElement(listId, listName));

  closePopup(popup);
}

function onNewListPopupNameInput(input) {
  const popupInput = input.currentTarget;
  const popupWrapper = popupInput.closest(".new-list-popup__wrapper");
  const popupCreateBtn = popupWrapper.querySelector(".new-list-popup__create-btn");
  if (popupInput.value.trim().length > 0) {
    popupCreateBtn.disabled = false;
  } else {
    popupCreateBtn.disabled = true;
  }
}

function createNewListPopup() {
  const popupTitle = document.createElement("h2");
  popupTitle.classList.add("popup__title", "new-list-popup__title");
  popupTitle.innerText = "Новый список";

  const popupInput = document.createElement("input");
  popupInput.classList.add("input-text", "new-list-popup__input");
  popupInput.type = "text";
  popupInput.value = "Без названия";
  popupInput.addEventListener("input", onNewListPopupNameInput);

  const popupCancelBtn = document.createElement("button");
  popupCancelBtn.classList.add("popup__btn", "popup__cancel-btn", "new-list-popup__btn", "new-list-popup__cancel-btn");
  popupCancelBtn.innerText = "Отмена";
  popupCancelBtn.addEventListener("click", onPopupCancelBtnCLick);

  const popupCreateBtn = document.createElement("button");
  popupCreateBtn.classList.add("popup__btn", "popup__create-btn", "new-list-popup__btn", "new-list-popup__create-btn");
  popupCreateBtn.innerText = "Создать";
  popupCreateBtn.addEventListener("click", onNewListPopupCreateBtnClick);

  const popupControl = document.createElement("div");
  popupControl.classList.add("popup__control", "new-list-popup__control");
  popupControl.append(popupCancelBtn, popupCreateBtn);

  const popupWrapper = document.createElement("div");
  popupWrapper.classList.add("popup__wrapper", "new-list-popup__wrapper");
  popupWrapper.append(popupTitle, popupInput, popupControl);

  const popup = document.createElement("div");
  popup.classList.add("popup", "new-list-popup");
  popup.append(popupWrapper);

  return popup;
}

export function onCreateListBtnClick(click) {
  document.body.append(createNewListPopup());
}

export function initListOfLists() {
  const lists = getAllLists();
  const listOfLists = document.querySelector(".list-manager__list-of-lists");
  for (const list of lists) {
    listOfLists.append(createUserListElement(list.id, list.name));
  }
}
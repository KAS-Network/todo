import {dbInit} from "./local-storage.js";
import {
  onCreateListBtnClick,
  initListOfLists
} from "./list-manager.js";
import {createTaskManagerPlug} from "./list-editor.js";

dbInit();
initListOfLists();

const taskManager = document.querySelector(".task-manager");
taskManager.append(createTaskManagerPlug());

const createListBtn = document.querySelector(".list-manager__create-list-btn");
createListBtn.addEventListener("click", onCreateListBtnClick);
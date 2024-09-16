import {dbInit} from "./local-storage.js";
import {
  onCreateListBtnClick,
  initListOfLists
} from "./list-manager.js";

dbInit();
initListOfLists();

const createListBtn = document.querySelector(".list-manager__create-list-btn");
createListBtn.addEventListener("click", onCreateListBtnClick);
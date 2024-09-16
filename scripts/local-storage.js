export function dbInit() {
  if (!localStorage.getItem("lists")) {
    localStorage.setItem("lists", JSON.stringify([]));
  }
}

export function getAllLists() {
  return JSON.parse(localStorage.getItem("lists"));
}

export function getListById(listId) {
  const lists = getAllLists();
  return lists.find(list => list.id === listId);
}

export function dbAddNewList(listName) {
  const lists = getAllLists();
  const newListId = Date.now().toString();
  lists.splice(0, 0, {
    id: newListId,
    name: listName
  });
  localStorage.setItem("lists", JSON.stringify(lists));
  return newListId;
}

export function renameListById(listId, listName) {
  const lists = getAllLists();
  const targetList = lists.find(list => list.id === listId);
  if (targetList) {
    targetList.name = listName;
    localStorage.setItem("lists", JSON.stringify(lists));
  }
}

export function deleteListById(listId) {
  const lists = getAllLists();
  const targetListIndex = lists.findIndex(list => list.id === listId);
  if (targetListIndex !== -1) {
    lists.splice(targetListIndex, 1);
    localStorage.setItem("lists", JSON.stringify(lists));
  }
}
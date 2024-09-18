export function dbInit() {
  if (!localStorage.getItem("lists")) {
    localStorage.setItem("lists", JSON.stringify([]));
  }
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
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
    const tasks = getAllTasks().filter(task => task.listId !== listId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

export function getAllTasks() {
  return JSON.parse(localStorage.getItem("tasks"));
}

export function getAllTasksByListId(listId) {
  return JSON.parse(localStorage.getItem("tasks")).filter(task => task.listId === listId);
}

export function dbAddNewTask(listId, taskText) {
  if (getListById(listId)) {
    const tasks = getAllTasks();
    const newTaskId = Date.now().toString();
    tasks.splice(0, 0, {
      id: newTaskId,
      listId,
      text: taskText,
      status: "unfulfilled"
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return newTaskId;
  }
}

export function editTaskTextById(taskId, taskText) {
  const tasks = getAllTasks();
  const targetTask = tasks.find(task => task.id === taskId);
  if (targetTask) {
    targetTask.text = taskText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

export function deleteTaskById(taskId) {
  const tasks = getAllTasks();
  const targetTaskIndex = tasks.findIndex(task => task.id === taskId);
  if (targetTaskIndex !== -1) {
    tasks.splice(targetTaskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}
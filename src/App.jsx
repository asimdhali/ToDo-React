import React, { useState, useEffect } from 'react';

const TaskApp = () => {
  const [taskList, setTaskList] = useState([]);
  const [archiveList, setArchiveList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    const storedTaskList = localStorage.getItem("taskList");
    if (storedTaskList) {
      const parsedTaskList = JSON.parse(storedTaskList);
      setTaskList(parsedTaskList);
    }

    const storedArchiveList = localStorage.getItem("archiveList");
    if (storedArchiveList) {
      const parsedArchiveList = JSON.parse(storedArchiveList);
      setArchiveList(parsedArchiveList);
    }
  }, []);

  const addTask = (newTask) => {
    if (newTask.trim() === "") {
      alert("Write something");
      return;
    }

    const updatedTaskList = [...taskList, newTask];
    setTaskList(updatedTaskList);
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
  };

  const deleteTask = (index) => {
    const deletedTask = taskList[index];

    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
    setEditIndex(null);

    const updatedArchiveList = [...archiveList, deletedTask];
    setArchiveList(updatedArchiveList);
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
    localStorage.setItem("archiveList", JSON.stringify(updatedArchiveList));
  };

  const restoreTask = (index) => {
    const restoredTask = archiveList[index];

    const updatedArchiveList = [...archiveList];
    updatedArchiveList.splice(index, 1);
    setArchiveList(updatedArchiveList);
    localStorage.setItem("archiveList", JSON.stringify(updatedArchiveList));

    const updatedTaskList = [...taskList, restoredTask];
    setTaskList(updatedTaskList);
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
  };

  const deleteForever = (index) => {
    const updatedArchiveList = [...archiveList];
    updatedArchiveList.splice(index, 1);
    setArchiveList(updatedArchiveList);
    localStorage.setItem("archiveList", JSON.stringify(updatedArchiveList));
  };

  const startEditing = (index, text) => {
    setEditIndex(index);
    setEditedText(text);
  };

  const finishEditing = (index) => {
    updateTask(index, editedText);
    setEditIndex(null);
  };

  const updateTask = (index, updatedText) => {
    const updatedTaskList = [...taskList];
    updatedTaskList[index] = updatedText;
    setTaskList(updatedTaskList);
    localStorage.setItem("taskList", JSON.stringify(updatedTaskList));
  };

  return (
    <div>
      <h1>Task Management App</h1>

      {/* Render the list of tasks with delete, edit, and archive buttons */}
      <ul>
        {taskList.map((task, index) => (
          <li key={index}>
            {editIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => finishEditing(index)}>Done</button>
              </div>
            ) : (
              <div>
                {task}
                <button onClick={() => startEditing(index, task)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Render the archive list with restore and delete forever buttons */}
      <div>
        <h2>Archive</h2>
        <ul>
          {archiveList.map((archivedTask, index) => (
            <li key={index}>
              {archivedTask}
              <button onClick={() => restoreTask(index)}>Restore</button>
              <button onClick={() => deleteForever(index)}>Delete Forever</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Form to add a new task */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newTask = e.target.elements.task.value;
          addTask(newTask);
          e.target.reset();
        }}
      >
        <input type="text" name="task" placeholder="Add a new task" />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskApp;

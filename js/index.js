// Initialize TaskManager
const taskManager = new TaskManager(0);
taskManager.load();
taskManager.render();

// Display current time and date
function printTime() {
  const d = new Date();
  const hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
  const mins = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  const secs = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
  const month = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ][d.getMonth()];
  const date = d.getDate();
  const year = d.getFullYear();
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';

  document.getElementById("time-display").textContent = `${hours}:${mins}:${secs} ${ampm}`;
  document.getElementById("date-display").textContent = `${day}, ${date} ${month} ${year}`;
}
printTime();
setInterval(printTime, 1000);

// Block out previous dates on calendar
const today = new Date().toISOString().split('T')[0];
document.getElementById("newTaskDuedate").setAttribute("min", today);
  

const newTaskForm = document.querySelector('#newTaskForm');

newTaskForm.addEventListener('submit', (event) => {

    let validateName = document.querySelector("#newTaskName");
    let validateDescription = document.querySelector("#newTaskDescription");
    let validateAssignedTo = document.querySelector("#newTaskAssignedTo");
    let validateDueDate = document.querySelector("#newTaskDuedate");
    let validateStatus = document.querySelector("#newTaskStatus");
    let validationFail = 0;

    event.preventDefault();
    event.stopPropagation();

    console.log("Task Name :" + validateName.value.length);
    console.log("Task Description :" + validateDescription.value.length);
    console.log("Task Assigned To :" + validateAssignedTo.value.length);
    console.log("Task Due Date :" + validateDueDate.value);
    console.log("Task Status:" + validateStatus.value);

  // Call this to clear all the form fields after the submission
  const clearFormFields = () => {
    validateName.value = "";
    validateDescription.value = "";
    validateAssignedTo.value = "";
    validateStatus.value = "";
    validateDueDate.value = "";
    validateName.classList.remove("is-valid");
    validateDescription.classList.remove("is-valid");
    validateAssignedTo.classList.remove("is-valid");
    validateStatus.classList.remove("is-valid");
    validateDueDate.classList.remove("is-valid");
  };

  let todaysDate = new Date(Date.now())
          .toLocaleString()
          .split(",")[0]
          .split("/");
        let day = todaysDate[0];
        let month = todaysDate[1];
        let year = todaysDate[2];
        // taskDueDate is in yyyy-mm-dd format
        let taskDueDate = validateDueDate.value.split("-");
  
  
  // Form validation for Task Name Field for min length 5
  if ((validateName.value.length > 5) && (validateName.value !==null && validateName.value !=="")) {
    validateName.classList.add("is-valid");
    validateName.classList.remove("is-invalid");
  } else {
    validateName.classList.add("is-invalid");
    validateName.classList.remove("is-valid");
    validationFail++;
  }

  // Form validation for Task Description Field for min length 5
  if ((validateDescription.value.length > 5) && (validateDescription.value !==null && validateDescription.value !=="")) {
    validateDescription.classList.add("is-valid");
    validateDescription.classList.remove("is-invalid");
  } else {
    validateDescription.classList.add("is-invalid");
    validateDescription.classList.remove("is-valid");
    validationFail++;
  }

  // Form validation for Task Assigned Field for min length 5
  if ((validateAssignedTo.value.length > 5) && (validateAssignedTo.value !==null && validateAssignedTo.value !=="")) {
    validateAssignedTo.classList.add("is-valid");
    validateAssignedTo.classList.remove("is-invalid");
  } else {
    validateAssignedTo.classList.add("is-invalid");
    validateAssignedTo.classList.remove("is-valid");
    validationFail++;
  }
  console.log(
    `taskDueDate[2]:${taskDueDate[2]} day:${day} taskDueDate[1]:${taskDueDate[1]} month:${month} taskDueDate[0]:${taskDueDate[0]} year:${year}`
  );

  if  (validateStatus.value !==null && validateStatus.value !=="") {
    validateDueDate.classList.add("is-valid");
    validateDueDate.classList.remove("is-invalid");
  } else {
    validateDueDate.classList.add("is-invalid");
    validateDueDate.classList.remove("is-valid");
    validationFail++;
  }
  // Form validation for Task Status Field for not empty
  if (validateStatus.value !==null && validateStatus.value !=="") {
    validateStatus.classList.add("is-valid");
    validateStatus.classList.remove("is-invalid");
  } else {
    validateStatus.classList.add("is-invalid");
    validateStatus.classList.remove("is-valid");
    validationFail++;
  }
  // If validation fails then function will not proceed further and
  // will return. The value of validationFail will also needed to be
  // reset to 0.
  // ----------------------------------------------------------------------------------
  if (validationFail > 0) {
    return;
  } else {
    // Push the valid input into our tasks array
    taskManager.addTask(
      validateName.value,
      validateDescription.value,
      validateAssignedTo.value,
      validateDueDate.value,
      validateStatus.value
    );
    clearFormFields();
    taskManager.save();
    taskManager.render();
    $('#reg-modal').modal('hide')
  }
});

const allTasksLists = [
  document.querySelector('#tasksList'),
  document.querySelector('#inProgressTasksList'),
  document.querySelector('#reviewTasksList'),
  document.querySelector('#doneTasksList')
];

allTasksLists.forEach(list => {
    list.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            const parentTask = event.target.parentElement.parentElement;
            const taskId = Number(parentTask.dataset.taskId);
            const task = taskManager.getTaskById(taskId);

            // Populate modal fields with the current task details
            document.getElementById('editTaskId').value = taskId;
            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editTaskDescription').value = task.description;
            document.getElementById('editTaskAssignedTo').value = task.assignedTo;
            document.getElementById('editTaskDuedate').value = task.dueDate;
            document.getElementById('editTaskStatus').value = task.status;

            // Show the edit modal
            $('#editModal').modal('show');
        }

        if (event.target.classList.contains('delete-button')) {
          // Get the parent Task
          const parentTask = event.target.parentElement.parentElement;

          // Get the taskId of the parent Task.
          const taskId = Number(parentTask.dataset.taskId);

          // Delete the task
          taskManager.deleteTask(taskId);

          // Save the tasks to localStorage
          taskManager.save();

          // Render the tasks
          taskManager.render();
      }
    });
});

// Define the click event handler function
function handleEditButtonClick(event) {
  // Inside the handleEditButtonClick function
  if (event.target.id === 'saveEditButton') {
    const taskId = Number(document.getElementById('editTaskId').value);
    const updatedTask = {
        name: document.getElementById('editTaskName').value,
        description: document.getElementById('editTaskDescription').value,
        assignedTo: document.getElementById('editTaskAssignedTo').value,
        dueDate: document.getElementById('editTaskDuedate').value,
        status: document.getElementById('editTaskStatus').value,
    };

    taskManager.editTask(taskId, updatedTask);
    taskManager.save();
    taskManager.render();

    // Close the edit modal
    $('#editModal').modal('hide');

    // Clear the modal fields
    document.getElementById('editTaskId').value = '';
    document.getElementById('editTaskName').value = '';
    document.getElementById('editTaskDescription').value = '';
    document.getElementById('editTaskAssignedTo').value = '';
    document.getElementById('editTaskDuedate').value = '';
    document.getElementById('editTaskStatus').value = '';
  }

}

// Attach the click event to the document and use event delegation
$(document).on('click', '#saveEditButton', handleEditButtonClick);

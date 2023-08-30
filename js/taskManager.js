const createTaskHtml = (id, name, description, assignedTo, dueDate, status) => `
    <li class="list-group-item card m-1" id="task" draggable="true" ondragstart="drag(event)" data-task-id=${id} data-status="${status}">
        <div class="d-flex mt-2 justify-content-between align-items-center">
            <small style="font-size:16px; font-weight: 600;">${name}</small>
            <span class="badge ${status === 'To-do' ? 'badge-danger' : 'badge-success'} ${status === 'In Progress' ? 'badge-info' : 'badge-success'} ${status === 'Review' ? 'badge-warning' : 'badge-success'}" style="border: 1px solid var(--light); color: var(--light);">${status}</span>
        </div>
        <div class="d-flex mb-4 justify-content-between">
            <small>${assignedTo}</small>
            <small>${dueDate}</small>
        </div>
        <small>${description}</small>
        <div class="d-flex justify-content-start"> 
        
        </div>
        <div class="d-flex justify-content-end">
        <button class="btn btn-outline-primary edit-button mr-1" data-task-id="${id}" data-toggle="modal" data-target="#editModal">Edit</button>
        <button class="btn btn-outline-danger delete-button">Delete</button>
        </div>
    </li>
`;


class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }


    addTask(name, description, assignedTo, dueDate, status) {
        const task = {
            id: this.currentId++,
            name: name,
            description: description,
            assignedTo: assignedTo,
            dueDate: dueDate,
            status: status
        };

        this.tasks.push(task);
    }

    editTask(taskId, updatedTask) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
        }
    }

    deleteTask(taskId) {
        const newTasks = [];
        for (const element of this.tasks) {
            const task = element;

            if (task.id !== taskId) {

                newTasks.push(task);
            }
        }
        this.tasks = newTasks;
    }

    getTaskById(taskId) {
        let foundTask;

        for (const element of this.tasks) {
            const task = element;

            if (task.id === taskId) {
                foundTask = task;
            }
        }

        return foundTask;
    }

    render() {
        const tasksHtmlList = [];
        const inProgressTasksHtmlList = [];
        const reviewTasksHtmlList = [];
        const doneTasksHtmlList = [];
    
        for (const element of this.tasks) {
            const task = element;
            const date = new Date(task.dueDate);
            const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            const taskHtml = createTaskHtml(
                task.id, 
                task.name, 
                task.description, 
                task.assignedTo, 
                formattedDate, 
                task.status
                );
                
                if (task.status === "To-do") {
                    tasksHtmlList.push(taskHtml);
                  } else if (task.status === "In Progress") {
                    inProgressTasksHtmlList.push(taskHtml);
                  } else if (task.status === "Review") {
                    reviewTasksHtmlList.push(taskHtml);
                  } else {
                    doneTasksHtmlList.push(taskHtml);
                  } 
        }

        const tasksHtml = tasksHtmlList.join('\n');
        document.querySelector('#tasksList').innerHTML = tasksHtml;
        const inProgressTaskHtml = inProgressTasksHtmlList.join('\n');
        document.querySelector('#inProgressTasksList').innerHTML = inProgressTaskHtml;
        const reviewTaskHtml = reviewTasksHtmlList.join('\n');
        document.querySelector('#reviewTasksList').innerHTML = reviewTaskHtml;
        const doneTaskHtml = doneTasksHtmlList.join('\n');
        document.querySelector('#doneTasksList').innerHTML = doneTaskHtml;
        
    }

    save() {
        const tasksJson = JSON.stringify(this.tasks);

        localStorage.setItem('tasks', tasksJson);

        const currentId = String(this.currentId);

        localStorage.setItem('currentId', currentId);
    }

    load() {
        if (localStorage.getItem('tasks')) {
            const tasksJson = localStorage.getItem('tasks');

            this.tasks = JSON.parse(tasksJson);
        }

        if (localStorage.getItem('currentId')) {
            const currentId = localStorage.getItem('currentId');

            this.currentId = Number(currentId);
        }
    }
}




// Hamburger animation for the navigation bar 
  
  const hamburger = document.querySelector('.hamburger');
  
  hamburger.addEventListener('click', function () {
  this.classList.toggle('is-active');
  });
  

// Search bar functionality to search tasks by title
function search(value) {
    let filter,
        i, li,
        txtValue;
    filter = value.toUpperCase();
    li = $("li");
    for (i = 0; i < li.length; i++) {
        txtValue = $(li[i]).find("small").text();
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

$("#search-input").keyup(function (e) {
    let searching;
    searching = e.target.value
    search(searching);
});


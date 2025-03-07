import { tasksObject } from './variables.js';
import { saveTasks } from './primaryfunctions.js';

//Función secundaria: Reproducir tareas en el DOM.
export function renderTasks(task) {
    const pendingTaskContainer = document.getElementById('pendingTaskContainer');
    const finalizedTaskContainer = document.getElementById('finalizedTaskContainer');
    const taskDiv = document.createElement('div');
    taskDiv.setAttribute('dataId', task.id);
    taskDiv.classList.add('singleTask');
    
    if (task.status === 'Pendiente') {
        taskDiv.classList.add('pendingTask');
        taskDiv.innerHTML = `
        <div class="divTitle">
            <span>Tarea:</span>
            <span>${task.title}</span>
        </div>
        <div class="divCreationDate">
            <span>Fecha de Creación:</span>
            <span>${task.creationDate}</span>
        </div>
        <div class="divDueDate">
            <span>Fecha Límite</span>
            <span>${task.dueDate}</span>
        </div>
        <div class="divStatus">
            <span>Estado:</span>
            <span class="spanStatus">${task.status}</span>
        </div>
        <div class="divTaskButtons">
            <button class="editBtn"><img src="files/edit.svg" alt="Editar" title="Editar Tarea"></button>
            <button class="finalizeBtn"><img src="files/finalize.svg" alt="Finalizar" title="Finalizar Tarea"></button>
            <button class="deleteBtn"><img src="files/delete.svg" alt="Eliminar" title="Eliminar Tarea"></button>
        </div>
        `;
        pendingTaskContainer.appendChild(taskDiv);
    } else {
        taskDiv.classList.add('finalizedTask');
        taskDiv.innerHTML = `
        <div class="divTitle">
            <span>Tarea:</span>
            <span>${task.title}</span>
        </div>
        <div class="divCreationDate">
            <span>Fecha de Creación:</span>
            <span>${task.creationDate}</span>
        </div>
        <div class="divDueDate">
            <span>Fecha Límite</span>
            <span>${task.dueDate}</span>
        </div>
        <div class="divStatus">
            <span>Estado:</span>
            <span>${task.status}</span>
        </div>
        `;
        finalizedTaskContainer.appendChild(taskDiv);
    };

    const editButton = taskDiv.querySelector('.editBtn');
    
    if (editButton) {
        editButton.addEventListener('click', (event) => {
        const taskDiv = event.target.closest('.singleTask');
        const taskId = parseInt(taskDiv.getAttribute('dataId'));
        editTasks(taskDiv, taskId);
        });
    };

    const deleteButton = taskDiv.querySelector('.deleteBtn');
    
    if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
            const taskDiv = event.target.closest('.singleTask');
            const taskId = parseInt(taskDiv.getAttribute('dataId'));
            deleteTasks(taskDiv, taskId);
        });
    };

    const finalizeButton = taskDiv.querySelector('.finalizeBtn');
    
    if (finalizeButton) {
        finalizeButton.addEventListener('click', (event) => {
            const taskDiv = event.target.closest('.singleTask');
            const taskId = parseInt(taskDiv.getAttribute('dataId'));
            const taskToFinalize = tasksObject.tasks.find((task) => task.id === taskId);
            taskToFinalize.status = 'Finalizada';
            const spanToUpdate = taskDiv.querySelector('.spanStatus');
            spanToUpdate.innerText = 'Finalizada';
            taskDiv.classList.remove('pendingTask');
            taskDiv.classList.add('finalizedTask');
            saveTasks();
            editButton.remove();
            finalizeButton.remove();
            deleteButton.remove();
            taskDiv.remove();
            finalizedTaskContainer.appendChild(taskDiv);
        });
    };
};

//Función secundaria: Editar tareas.
function editTasks(taskDiv, taskId) {

    const editButton = taskDiv.querySelector('.editBtn');
    const deleteButton = taskDiv.querySelector('.deleteBtn');
    const finalizeButton = taskDiv.querySelector('.finalizeBtn');
    const saveButton = document.createElement('button');

    editButton.style.display = 'none';
    deleteButton.style.display = 'none';
    finalizeButton.style.display = 'none';
    saveButton.classList = 'saveBtn';

    saveButton.innerHTML = `<img src="files/save.svg" alt="Guardar" title="Guardar Edición">`;

    taskDiv.querySelector('.divTaskButtons').appendChild(saveButton);
    
    const taskToUpdate = tasksObject.tasks.find((task) => task.id == taskId);
    const divTitle = taskDiv.querySelector('.divTitle');
    const divDueDate = taskDiv.querySelector('.divDueDate');

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.value = taskToUpdate.title;

    const titleAlert = document.createElement('span');
    titleAlert.classList.add('alert');
    
    divTitle.innerHTML = '<span>Tarea:</span>';
    divTitle.appendChild(inputTitle);
    divTitle.appendChild(titleAlert);

    const [month, day, year] = taskToUpdate.dueDate.split('/');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const inputDueDate = document.createElement('input');
    inputDueDate.value = formattedDate;
    inputDueDate.type = 'date';
    
    const dueDateAlert = document.createElement('span');
    dueDateAlert.classList.add('alert');

    divDueDate.innerHTML = '<span>Fecha Límite:</span>';
    divDueDate.appendChild(inputDueDate);
    divDueDate.appendChild(dueDateAlert);

    saveButton.addEventListener('click', () => {
        const newTitle = inputTitle.value.trim();
        const newDueDate = inputDueDate.value;

        if (!newTitle && !newDueDate) {
            titleAlert.textContent = 'Debes añadir el título de la tarea';
            dueDateAlert.textContent = 'Debes añadir la fecha límite de la tarea';
            return;
        } else if (!newTitle) {
            titleAlert.textContent = 'Debes añadir el título de la tarea';
            dueDateAlert.textContent = '';
            return;
        } else if (!newDueDate) {
            titleAlert.textContent = '';
            dueDateAlert.textContent = 'Debes añadir la fecha límite de la tarea';
            return;
        };

        taskToUpdate.title = newTitle;
        taskToUpdate.dueDate = new Date(newDueDate + "T00:00:00").toLocaleDateString();

        const newTaskTitle = document.createElement('span');
        const newTaskDueDate = document.createElement('span');

        divTitle.appendChild(newTaskTitle);
        divDueDate.appendChild(newTaskDueDate);
        
        newTaskTitle.innerText = newTitle;
        newTaskDueDate.innerText = new Date(newDueDate + "T00:00:00").toLocaleDateString();

        titleAlert.remove();
        dueDateAlert.remove();
        inputTitle.remove();
        inputDueDate.remove();

        saveButton.remove();
        editButton.style.display = 'inline-flex';
        deleteButton.style.display = 'inline-flex';
        finalizeButton.style.display = 'inline-flex';;
        
        saveTasks();
    });
};

//Función secundaria: Eliminar tareas.
function deleteTasks(taskDiv, taskId) {
    tasksObject.tasks = tasksObject.tasks.filter((task) => task.id !== taskId);
    taskDiv.remove();
    saveTasks();
};
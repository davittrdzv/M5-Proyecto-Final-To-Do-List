let tasks = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    await loadTasks();

    // Manejo de Formularios: Evento de formulario único que evita el comportamiento predeterminado.
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional y que éste se envíe y se dé tratamiento en el backend.
        await addTasks();
        saveTasks();
    });

    async function addTasks() {

        const taskTitle = document.getElementById('taskTitle');
        const taskDueDate = document.getElementById('taskDueDate');

        if (!taskTitle.value.trim()) {
            alert('Debes añadir el título de la tarea');
            return;
        };

        if (!taskDueDate.value) {
            alert('Debes añadir la fecha límite de la tarea');
            return;
        };

        const newTask = {
            id: Date.now(),
            title: taskTitle.value.trim(),
            creationDate: new Date().toLocaleDateString(),
            dueDate: new Date(taskDueDate.value + "T00:00:00").toLocaleDateString(),
            status: 'Pendiente',
        };

        tasks.push(newTask);

        renderTasks(newTask);

        taskTitle.value = '';
        taskDueDate.value = '';

        return newTask; // Retorna nuestro texto de la tarea para que la usemos en nuestra promesa.
    };
    
    function renderTasks(task) {
        const taskContainer = document.getElementById('taskContainer');
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
                const taskToFinalize = tasks.find((task) => task.id === taskId);
                taskToFinalize.status = 'Finalizada';
                const spanToUpdate = taskDiv.querySelector('.spanStatus');
                spanToUpdate.innerText = 'Finalizada';
                taskDiv.classList.remove('pendingTask');
                taskDiv.classList.add('finalizedTask');
                saveTasks();
                editButton.remove();
                finalizeButton.remove();
                deleteButton.remove();
            });
        };
        
        taskContainer.appendChild(taskDiv);
    };

    function deleteTasks(taskDiv, taskId) {
        tasks = tasks.filter((task) => task.id !== taskId);
        taskDiv.remove();
        saveTasks();
    };

    async function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Se guarda en JSON en local.
    };

    async function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // JSON y manejo de datos locales guardados.
        setTimeout(() => {
            tasks = savedTasks;
            savedTasks.forEach(task => renderTasks(task));    
        }, 2000);
    };

    function editTasks(taskDiv, taskId) {

        const editButton = taskDiv.querySelector('.editBtn');
        const deleteButton = taskDiv.querySelector('.deleteBtn');
        const finalizeButton = taskDiv.querySelector('.finalizeBtn');
        const saveButton = document.createElement('button');

        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
        finalizeButton.style.display = 'none';
        saveButton.classList = 'saveBtn';

        saveButton.innerHTML = `
        <img src="files/save.svg" alt="Guardar" title="Guardar Edición">`;

        taskDiv.querySelector('.divTaskButtons').appendChild(saveButton);
        
        const taskToUpdate = tasks.find((task) => task.id == taskId);
        const divTitle = taskDiv.querySelector('.divTitle');
        const divDueDate = taskDiv.querySelector('.divDueDate');

        const inputTitle = document.createElement('input');
        inputTitle.type = 'text';
        inputTitle.value = taskToUpdate.title;
        
        divTitle.innerHTML = '<span>Tarea:</span>';
        divTitle.appendChild(inputTitle);

        const [month, day, year] = taskToUpdate.dueDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const inputDueDate = document.createElement('input');
        inputDueDate.value = formattedDate;
        inputDueDate.type = 'date';

        divDueDate.innerHTML = '<span>Fecha Límite:</span>';
        divDueDate.appendChild(inputDueDate);

        saveButton.addEventListener('click', () => {
            const newTitle = inputTitle.value.trim();
            const newDueDate = inputDueDate.value;

            if (!newTitle) {
                alert('Debes añadir el título de la tarea');
                return;
            };

            if (!newDueDate) {
                alert('Debes añadir la fecha límite de la tarea');
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

            inputTitle.remove();
            inputDueDate.remove();

            saveButton.style.display = 'none';
            editButton.style.display = 'inline-flex';
            deleteButton.style.display = 'inline-flex';
            finalizeButton.style.display = 'inline-flex';;
            
            saveTasks();
        });
    };
});
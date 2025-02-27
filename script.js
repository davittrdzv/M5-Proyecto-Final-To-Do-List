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
        const table = document.getElementById('taskTable');
        const taskRow = document.createElement('tr');
        taskRow.setAttribute('data-id', task.id);
        
        if (task.status === 'Pendiente') {
            taskRow.innerHTML = `
            <td class="task-title">${task.title}</td>
            <td class="task-creationDate">${task.creationDate}</td>
            <td class="task-dueDate">${task.dueDate}</td>
            <td class="task-status">${task.status}</td>
            <td class="third">
                <button class="edit-btn"><img src="files/edit.svg" alt="Editar" title="Editar Tarea" width="20"></button>
                <button class="finalize-btn"><img src="files/finalize.svg" alt="Finalizar" title="Finalizar Tarea" width="20"></button>
                <button class="delete-btn"><img src="files/delete.svg" alt="Eliminar" title="Eliminar Tarea" width="20"></button>
            </td>
            `;
        } else {
            taskRow.innerHTML = `
            <td class="task-title">${task.title}</td>
            <td class="task-creationDate">${task.creationDate}</td>
            <td class="task-dueDate">${task.dueDate}</td>
            <td class="task-status">${task.status}</td>
            `;
        };

        const editButton = taskRow.querySelector('.edit-btn');
        
        if (editButton) {
            editButton.addEventListener('click', (event) => {
            const taskRow = event.target.closest('tr');
            const taskId = parseInt(taskRow.getAttribute('data-id'));
            editTasks(taskRow, taskId);
            });
        };

        const deleteButton = taskRow.querySelector('.delete-btn');
        
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                const taskRow = event.target.closest('tr');
                const taskId = parseInt(taskRow.getAttribute('data-id'));
                deleteTasks(taskRow, taskId);
            });
        };

        const finalizeButton = taskRow.querySelector('.finalize-btn');
        
        if (finalizeButton) {
            finalizeButton.addEventListener('click', (event) => {
                const taskRow = event.target.closest('tr');
                const taskId = parseInt(taskRow.getAttribute('data-id'));
                const taskToFinalize = tasks.find((task) => task.id === taskId);
                taskToFinalize.status = 'Finalizada';
                const trToUpdate = taskRow.querySelector('.task-status');
                trToUpdate.innerText = 'Finalizada';
                saveTasks();
                editButton.remove();
                finalizeButton.remove();
                deleteButton.remove();
            });
        };
        
        table.appendChild(taskRow);
    };

    function deleteTasks(taskRow, taskId) {
        tasks = tasks.filter((task) => task.id !== taskId);
        taskRow.remove();
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

    function editTasks(taskRow, taskId) {

        const editButton = taskRow.querySelector('.edit-btn');
        const deleteButton = taskRow.querySelector('.delete-btn');
        const finalizeButton = taskRow.querySelector('.finalize-btn');
        const saveButton = document.createElement('button');

        editButton.style.display = 'none';
        deleteButton.style.display = 'none';
        finalizeButton.style.display = 'none';
        saveButton.classList = 'save-btn';

        saveButton.innerHTML = `
        <img src="save.svg" alt="Guardar" title="Guardar Edición" width="20">`;

        taskRow.querySelector('.third').appendChild(saveButton);
        
        const taskToUpdate = tasks.find((task) => task.id == taskId);
        const titleCell = taskRow.querySelector('.task-title');
        const dueDateCell = taskRow.querySelector('.task-dueDate');

        const inputTitle = document.createElement('input');
        inputTitle.type = 'text';
        inputTitle.value = taskToUpdate.title;
        inputTitle.classList.add('edit-title');
        
        titleCell.innerHTML = '';
        titleCell.appendChild(inputTitle);

        const [month, day, year] = taskToUpdate.dueDate.split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const inputDueDate = document.createElement('input');
        inputDueDate.value = formattedDate;
        inputDueDate.type = 'date';
        inputDueDate.classList.add('edit-dueDate');

        dueDateCell.innerHTML = '';
        dueDateCell.appendChild(inputDueDate);

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
            
            titleCell.innerText = newTitle;
            dueDateCell.innerText = new Date(newDueDate + "T00:00:00").toLocaleDateString();

            saveButton.style.display = 'none';
            editButton.style.display = 'inline-flex';
            deleteButton.style.display = 'inline-flex';
            finalizeButton.style.display = 'inline-flex';;
            
            saveTasks();
        });
    };
});

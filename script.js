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
            <td>
                <button class="btn btn-success finalize-btn">Finalizar</button>
                <button class="btn btn-danger delete-btn">Eliminar</button>
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

        const deleteButton = taskRow.querySelector('.delete-btn');
        console.log('delete button', deleteButton);
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                const taskRow = event.target.closest('tr');
                const taskId = parseInt(taskRow.getAttribute('data-id'));
                deleteTasks(taskRow, taskId);
            });
        };

        const finalizeButton = taskRow.querySelector('.finalize-btn');
        console.log('finalize button', finalizeButton);
        if (finalizeButton) {
            finalizeButton.addEventListener('click', (event) => {
                const taskRow = event.target.closest('tr');
                const taskId = parseInt(taskRow.getAttribute('data-id'));
                const taskToFinalize = tasks.find((task) => task.id === taskId);
                taskToFinalize.status = 'Finalizada';
                const trToUpdate = taskRow.querySelector('.task-status');
                trToUpdate.innerText = 'Finalizada';
                saveTasks();
                // console.log(tasks);
                deleteButton.remove();
                finalizeButton.remove();
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

    // console.log(tasks);
});

// console.log(tasks);
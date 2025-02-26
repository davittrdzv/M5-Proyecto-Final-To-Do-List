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
            status: 'En Proceso',
        };

        tasks.push(newTask);

        renderTasks(newTask);

        taskTitle.value = '';
        taskDueDate.value = '';

        return newTask; // Retorna nuestro texto de la tarea para que la usemos en nuestra promesa.
    };
    
    function renderTasks(task) {
        const taskTableBody = document.getElementById('taskTableBody');
        const taskRow = document.createElement('tr');
        taskRow.setAttribute('data-id', task.id);
        
        taskRow.innerHTML = `
        <td class="task-content">${task.title}</td>
        <td>${task.creationDate}</td>
        <td>${task.dueDate}</td>
        <td>${task.status}</td>
        <td>
            <button class="btn btn-danger delete-btn">Eliminar</button>
        </td>
        `;

        const deleteButton = taskRow.querySelector('.delete-btn');
        deleteButton.addEventListener('click', (event) => {
            const taskRow = event.target.closest('tr');
            const taskId = parseInt(taskRow.getAttribute('data-id'));
            deleteTasks(taskRow, taskId);
        });
        
        taskTableBody.appendChild(taskRow);
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
        tasks = savedTasks;
        savedTasks.forEach(task => renderTasks(task));
    };

    console.log(tasks);
});

console.log(tasks);
document.addEventListener('DOMContentLoaded', async (params) => {
    const addTaskButton = document.getElementById('addTaskButton');
    const newTaskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');

    await loadTasks();

    addTaskButton.addEventListener('click', () => {
        addTasks().then(saveTasks); // Promesa y async/await
    });

    // Manejo de Formularios: Evento de formulario único que evita el comportamiento predeterminado.
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de manera tradicional y que éste se envíe y se dé tratamiento en el backend.
        await addTasks();
        saveTasks();
    });

    async function addTasks() {
        const taskText = newTaskInput.value.trim();
        const taskElement = document.createElement('div');
        taskElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        taskElement.innerHTML = `
        <span class="task-content">${taskText}</span>
        <button class="btn btn-danger delete-btn">Eliminar</button>
        `;

        const deleteButton = taskElement.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {taskElement.remove()});

        taskElement.addEventListener('click', () => {
            taskElement.classList.toggle('completed');
        });

        taskList.appendChild(taskElement);

        newTaskInput.value = '';

        return taskText; // Retorna nuestro texto de la tarea para que la usemos en nuestra promesa.
    };

    async function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-content').forEach(task => tasks.push(task.textContent));
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Se guarda en JSON en local.
    };

    async function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')); // JSON y manejo de datos locales guardados.
        if (tasks) {
            tasks.forEach(taskText => {
                const taskElement = document.createElement('div');
                taskElement.className = 'list-group-item d-flex justify-content-between align-items-center';
                taskElement.innerHTML = `
                <span class="task-content">${taskText}</span>
                <button class="btn btn-danger delete-btn">Eliminar</button>
                `;
                const deleteButton = taskElement.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => {taskElement.remove()})

                taskElement.addEventListener('click', () => {
                    taskElement.classList.toggle('completed');
                });

                taskList.appendChild(taskElement);
            });
        };
    };
});
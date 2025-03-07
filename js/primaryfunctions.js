import { tasksObject } from './variables.js';
import { renderTasks } from './secondaryfunctions.js';

//Función primaria: Cargar tareas.
export async function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []; // JSON y manejo de datos locales guardados.
    setTimeout(() => {
        tasksObject.tasks = savedTasks;
        savedTasks.forEach(task => renderTasks(task));
        console.log(tasksObject.tasks); // Este console.log es solo para efectos de testeo y validación backend.
    }, 2000);
};

//Función primaria: Agregar tareas.
export async function addTasks() {

    const taskTitle = document.getElementById('taskTitle');
    const taskDueDate = document.getElementById('taskDueDate');
    const alertTitle = document.getElementById('alertTitle');
    const alertDueDate = document.getElementById('alertDueDate');

    if (!taskTitle.value.trim() && !taskDueDate.value) {
        alertTitle.textContent = 'Debes añadir el título de la tarea';
        alertDueDate.textContent = 'Debes añadir la fecha límite de la tarea';
        return;
    } else if (!taskTitle.value.trim()) {
        alertTitle.textContent = 'Debes añadir el título de la tarea';
        alertDueDate.textContent = '';
        return;
    } else if (!taskDueDate.value) {
        alertTitle.textContent = '';
        alertDueDate.textContent = 'Debes añadir la fecha límite de la tarea';
        return;
    };

    const newTask = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        creationDate: new Date().toLocaleDateString(),
        dueDate: new Date(taskDueDate.value + "T00:00:00").toLocaleDateString(),
        status: 'Pendiente',
    };

    tasksObject.tasks.push(newTask);

    renderTasks(newTask);

    taskTitle.value = '';
    taskDueDate.value = '';
    alertTitle.textContent = '';
    alertDueDate.textContent = '';
};

//Función primaria: Guardar tareas.
export async function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasksObject.tasks)); // Se guarda en JSON en local.
};
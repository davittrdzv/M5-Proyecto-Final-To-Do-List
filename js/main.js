import { addTasks, saveTasks, loadTasks} from './primaryfunctions.js';

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();
        await addTasks();
        saveTasks();
    });
});
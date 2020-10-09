
const editTask = (task, taskRelated, callback) => {
    // Task id of task being edited
    const taskId = task.id;

    // Data related to task that needs to be updated
    const taskRelatedData = taskRelated ? taskRelated : {};

    fetch('api/tasks/' + taskId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            taskId: taskId,
            task: task, 
            taskRelated: taskRelatedData 
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success editing task ", data);
        callback(data);
    })
    .catch(error => {
        console.log("Error occurred trying to edit task " + taskId);
        console.log(error)
    })
}


const addTask = (task, columnId, callback) => {
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task: task,
            columnId: columnId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success: ', data);
        callback(data);
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}


export { addTask, editTask };
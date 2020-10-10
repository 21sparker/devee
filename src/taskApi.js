


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

const editGrouping = (grouping, callback) => {
    const groupingId = grouping.id;
    fetch('/api/groupings/' + groupingId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            grouping: grouping, 
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success editing grouping ", grouping);
        callback(data);
    })
    .catch(error => {
        console.log("Error occurred trying to edit grouping " + groupingId);
        console.log(error);
    })
}

const editColumn = (column, groupingId, callback) => {
    const columnId = column.id;
    fetch('/api/groupings/' + groupingId + '/columns/' + columnId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            column: column, 
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success editing column ", columnId);
        callback(data);
    })
    .catch(error => {
        console.log("Error occurred trying to edit column " + columnId);
        console.log(error);
    })
}

export { addTask, editTask, editGrouping, editColumn };
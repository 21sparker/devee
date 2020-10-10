

const editTask = (task, callback) => {
    const taskId = task.id;
    fetch('api/tasks/' + taskId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: task }),
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

const editAndMoveTask = (task, groupingId, prevColumn, nextColumn, callback) => {
    Promise.all([
        fetch('/api/tasks/' + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task }),
        }),
        fetch('/api/groupings/' + groupingId + '/columns/' + prevColumn.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column: prevColumn }),
        }),
        fetch('/api/groupings/' + groupingId + '/columns/' + nextColumn.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column: nextColumn }),
        })
    ])
    .then(responses => {
        return Promise.all(responses.map(response => response.json()));
    })
    .then(data => {
        console.log("Success editing and moving task " + task.id);
        callback(data);
    })
    .catch(error => {
        console.log("Error occurred trying to edit and move task " + task.id);
        console.log(error);
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

export { addTask, editTask, editGrouping, editColumn, editAndMoveTask };
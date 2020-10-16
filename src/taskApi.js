
/**
 * Sends a task object to the API. The task with the corresponding
 * id in the backend will reflect all the values in the task object sent.
 * The callback allows the caller to receive the data and run a function against it.
 * 
 * @param {Task obj} task
 * @param {function} callback
 */
const editTask = (task, callback) => {
    const taskId = task.id;
    console.log(task)
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


/**
 * Batches a group of related updates in regards to updating a tasks' attributes
 * and updating the column it belongs to.
 * The callback allows the caller to receive the data and run a function against it.
 * 
 * @param {Task obj} task
 * @param {string} groupingId
 * @param {Column obj} prevColumn
 * @param {Column obj} nextColumn
 * @param {function} callback
 */
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


/**
 * Sends a new task object to be added to the database to the API. The grouping and 
 * column id's are required to add the task to the appropriate column.
 * The callback allows the caller to receive the data and run a function against it.
 * 
 * @param {Task obj} task
 * @param {string} columnId
 * @param {string} groupingId
 * @param {function} callback
 */
const addTask = (task, columnId, groupingId, callback) => {
    console.log(task, columnId, groupingId)
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task: task,
            groupingId: groupingId,
            columnId: columnId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success adding task: ', data);
        callback(data);
    })
    .catch(error => {
        console.log('Error adding task: ', error);
    })
}


/**
 * Sends a grouping object to the API. The grouping object with the corresponding id in the backend 
 * will reflect all the values in the new grouping object sent.
 * The callback allows the caller to receive the data and run a function against it.
 * 
 * @param {Grouping obj} grouping
 * @param {function} callback
 */
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

/**
 * Sends a column object to the API. The column object with the corresponding id in the backend 
 * will reflect all the values in the new column object sent.
 * The callback allows the caller to receive the data and run a function against it.
 * 
 * @param {Column obj} column
 * @param {string} groupingId
 * @param {function} callback
 */
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
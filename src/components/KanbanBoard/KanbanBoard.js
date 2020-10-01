import React, {Component} from 'react';
import './KanbanBoard.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import "@reach/dialog/styles.css";
import { ColumnWrapper } from '../Column/Column';
import CardDialog from '../CardDialog/CardDialog';

// Dialog Library Documentation
// https://reach.tech/dialog/#dialog-ondismiss

class KanbanBoard extends Component {

    state = {
        tasks: {},
        columns: {},
        columnOrder: [],
        showCardDialog: false,
        taskIdSelected: null,
    };

    componentDidMount() {
        this.renderMyData();
    }

    cleanTask = task => {
        task["dueDate"] = new Date(task["dueDate"]);
        task["createdDate"] = new Date(task["createdDate"]);
        task["isEditable"] = false;
        
        return task;
    }

    renderMyData(){
        fetch('/api/tasks')
            .then((response) => response.json())
            .then((responseJson) => {
                const tasks = responseJson["tasks"];
                Object.keys(tasks).forEach(key => {
                    this.cleanTask(tasks[key])
                })
                this.setState(responseJson)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    onDragEnd = results => {
        const { destination, source, draggableId, type } = results;

        // Dropped outside droppable area
        if (!destination) {
            return;
        }

        // Dropped exactly where it was before
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Column was dragged to new position
        if (type === 'column'){
            const newColumnOrder = Array.from(this.state.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            this.setState({columnOrder: newColumnOrder});
            return;
        }

        
        const start = this.state.columns[source.droppableId]
        const finish = this.state.columns[destination.droppableId]

        // If moving within the same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        // Moving card from one column to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        }

        this.setState(newState);
    }

    openCardDialog = (taskId) => {
        console.log(taskId);
        this.setState({ taskIdSelected: taskId, showCardDialog: true })
    }

    closeCardDialog = (changes) => {
        const task = this.state.tasks[this.state.taskIdSelected];

        // Update task in DB if task was changed
        if (changes.description !== task.description ||
            changes.dueDate !== task.dueDate) 
            {
            const callback = data => {
                const newState = {
                    ...this.state,
                    taskIdSelected: null,
                    showCardDialog: false,
                    tasks: {
                        ...this.state.tasks,
                        [data.id]: this.cleanTask(data),
                    },
                }
                this.setState(newState);
            }

            this.editTask({
                ...task,
                ...changes,
            }, callback)
        } else {
            this.setState({
                taskIdSelected: null,
                showCardDialog: false
            });
        }
    }

    editTask = (task, callback) => {
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

    addTask = (task, columnId, callback) => {
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

    addNewTask = (task, columnId) => {
        const callback = data => {
            this.setState({
                tasks: {
                    ...this.state.tasks,
                    [data.id]: data,
                },
                columns: {
                    ...this.state.columns,
                    [columnId]: {
                        ...this.state.columns[columnId],
                        taskIds: this.state.columns[columnId].taskIds.concat(data.id),
                    }
                }
            })
        }
        console.log(typeof callback)
        this.addTask({}, columnId, callback);
    }


    render() {
        const columnsList = this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            return (
                <ColumnWrapper
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}
                    openCardDialog={this.openCardDialog}
                    addTask={this.addNewTask}/>
            )
        });

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {provided => (
                        <KanbanStyleBoard
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}>
                            
                            {columnsList}
                            {provided.placeholder}
                        </KanbanStyleBoard>
                    )}
                </Droppable>
                <CardDialog 
                    showCardDialog={this.state.showCardDialog} 
                    closeCardDialog={this.closeCardDialog}
                    task={this.state.tasks[this.state.taskIdSelected]}
                    />
            </DragDropContext>

        );
    }
}



function KanbanStyleBoard(props) {
    const { innerRef, children, ...rest } = props;

    return (
        <div className="kanban-style-board" ref={innerRef} {...rest}>
            {children}
        </div>
    );
}

export default KanbanBoard;
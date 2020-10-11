import React, {Component} from 'react';
import './KanbanBoard.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import "@reach/dialog/styles.css";
import { ColumnWrapper } from '../Column/Column';
import CardDialog from '../CardDialog/CardDialog';
import { editTask, addTask, editGrouping, editColumn, editAndMoveTask } from '../../taskApi';

// Dialog Library Documentation
// https://reach.tech/dialog/#dialog-ondismiss

class KanbanBoard extends Component {

    state = {
        tasks: {},
        groupings: null,
        currentGrouping: null,

        currentDialog: null,
        cardDialogTask: null,
        cardDialogStatusId: null,
        cardDialogStatusOptions: null,

        proposedChanges: null,
    };

    componentDidMount() {
        this.renderMyData();
    }

    cleanTask = task => {
        task["dueDate"] = task["dueDate"] ? new Date(task["dueDate"]) : null;
        task["createdDate"] = task["createdDate"] ? new Date(task["createdDate"]) : null;
        task["isEditable"] = false;

        return task;
    }

    renderMyData() {
        Promise.all([
            fetch('/api/tasks'),
            fetch('/api/groupings')
        ]).then((responses) => {
            // Get a JSON object from each of the reponses
            return Promise.all(responses.map((response) => response.json()));
        }).then((data) => {
            console.log("Initial data loaded successfully: ", data);

            // Clean up tasks
            const tasks = data[0]["tasks"];
            Object.keys(tasks).forEach(key => {
                this.cleanTask(tasks[key])
            })

            const groupings = data[1]["groupings"]
            const stateUpdate = {
                tasks: tasks,
                groupings: groupings,
                currentGrouping: "status",
            }
            this.setState(stateUpdate)

        })
    }

    onDragEnd = results => {
        const { destination, source, draggableId, type } = results;

        const grouping = this.state.groupings[this.state.currentGrouping];
        const columns = grouping["columns"];
        const columnOrder = grouping["columnOrder"];

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
            const newColumnOrder = Array.from(columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newGrouping = {
                ...grouping,
                columnOrder: newColumnOrder,
            }

            editGrouping(newGrouping, () => {})

            this.setState({
                groupings: {
                    ...this.state.groupings,
                    [grouping.id]: newGrouping
                }
            });
            return;
        }
        
        const start = columns[source.droppableId]
        const finish = columns[destination.droppableId]

        // If moving within the same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };
            
            editColumn(newColumn, grouping.id, () => {})

            this.setState({
                groupings: {
                    ...this.state.groupings,
                    [grouping.id]: {
                        ...grouping,
                        columns: {
                            ...columns,
                            [start.id]: newColumn,
                        }
                    }
                }
            });
            return;
        }

        // Moving card from one column to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
            ...start,
            taskIds: startTaskIds,
        }
        editColumn(newStartColumn, grouping.id, () => {})

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
            ...finish,
            taskIds: finishTaskIds,
        };
        editColumn(newFinishColumn, grouping.id, () => {})

        this.setState({
            groupings: {
                ...this.state.groupings,
                [grouping.id]: {
                    ...grouping,
                    columns: {
                        ...columns,
                        [start.id]: newStartColumn, 
                        [finish.id]: newFinishColumn,
                    }
                }
            }
        });
    }

    openCardDialog = (taskId, colId) => {
        const columns = this.state.groupings[this.state.currentGrouping]["columns"]
        this.setState({ 
            currentDialog: "EDIT_TASK",
            cardDialogTask: this.state.tasks[taskId],
            cardDialogStatusId: colId,
            cardDialogStatusOptions: Object.entries(columns).map(([id, col]) => 
                ({ id: id, name: col.title})
            ),
        })
    }

    closeCardDialog = (changes) => {
        const task = this.state.cardDialogTask;
        const statusId = this.state.cardDialogStatusId;

        // Update task in DB if task was changed
        const descriptionChanged = changes.description !== task.description;
        const dueDateChanged = (changes.dueDate ? changes.dueDate.getTime() : null) !== (task.dueDate ? task.dueDate.getTime() : null)
        const statusChanged = changes.statusId !== statusId;
        if (descriptionChanged || dueDateChanged || statusChanged) {
            const newTask = {
                ...task,
                description: changes.description,
                dueDate: changes.dueDate,
            }

            // Update status columns if the card has changed status
            if (statusChanged) {
                const grouping = this.state.groupings[this.state.currentGrouping];
                const statusColumns = this.state.groupings[this.state.currentGrouping].columns;

                // Update taskIds order for previous status column
                const prevColumnTaskIds = Array.from(statusColumns[statusId].taskIds);
                prevColumnTaskIds.splice(prevColumnTaskIds.indexOf(task.id), 1);
                const previousStatusColumn = {
                    ...statusColumns[statusId],
                    taskIds: prevColumnTaskIds,
                }

                // Update taskIds order for next status column
                const nextColumnTaskIds = Array.from(statusColumns[changes.statusId].taskIds);
                nextColumnTaskIds.push(task.id);
                const nextStatusColumn = {
                    ...statusColumns[changes.statusId],
                    taskIds: nextColumnTaskIds,
                }

                // Callback to update the state once the api returns a successful task edit and
                // column change
                const callback = data => {
                    const dataTask = data[0].task;
                    const prevColumn = data[1].column;
                    const nextColumn = data[2].column;
    
                    // TODO: By the time this callback is called, the grouping might have changed,
                    // so the column changes will fail if they have changed. Need to fix this to 
                    // capture the grouping along with the column changes
                    this.setState({
                        // Hide card dialog
                        currentDialog: null,
                        cardDialogTask: null,
                        proposedChanges: null,
                        // Update task with changes                
                        tasks: {
                            ...this.state.tasks,
                            [dataTask.id]: this.cleanTask(dataTask),
                        },
                        // Update columns
                        groupings: {
                            ...this.state.groupings,
                            [grouping.id]: {
                                ...grouping,
                                columns: {
                                    ...grouping.columns,
                                    [prevColumn.id]: prevColumn,
                                    [nextColumn.id]: nextColumn,
                                }
                            }
    
                        }
                    });
                }

                editAndMoveTask(newTask, 
                    grouping.id, 
                    previousStatusColumn, 
                    nextStatusColumn,
                    callback)
            } else {
                // Callback to update the state once the api returns a successful task edit
                const callback = data => {
                    const dataTask = data.task;

                    this.setState({
                        // Hide card dialog
                        currentDialog: null,
                        cardDialogTask: null,
                        proposedChanges: null,
                        // Update task with changes                
                        tasks: {
                            ...this.state.tasks,
                            [dataTask.id]: this.cleanTask(dataTask),
                        }
                    });
                }                
                editTask(newTask, callback)
            }           
        } else {
            this.setState({
                currentDialog: null,
                cardDialogTask: null,
                proposedChanges: null,
            });
        }
    }

    addNewTask = (task, columnId) => {
        const grouping = this.state.groupings[this.state.currentGrouping];
        const callback = data => {

            this.setState({
                tasks: {
                    ...this.state.tasks,
                    [data.id]: this.cleanTask(data),
                },
                groupings: {
                    ...this.state.groupings,
                    [grouping.id]: {
                        ...grouping,
                        columns: {
                            ...grouping.columns,
                            [columnId]: {
                                ...grouping.columns[columnId],
                                taskIds: [data.id].concat(grouping.columns[columnId].taskIds),
                            }
                        }
                    }
                }
            })
        }
        addTask(task, columnId, grouping.id, callback);
    }

    render() {        
        let columnsList;
        if (this.state.groupings) {
            const currentGroup = this.state.groupings[this.state.currentGrouping];
            columnsList = currentGroup.columnOrder.map((columnId, index) => {
                const column = currentGroup.columns[columnId];
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
        } else {
            columnsList = null
        }

        const dialog = () => {
            switch(this.state.currentDialog){
                case "EDIT_TASK":
                    return (
                        <CardDialog
                            closeCardDialog={this.closeCardDialog}
                            task={this.state.cardDialogTask}
                            statusId={this.state.cardDialogStatusId}
                            statusOptions={this.state.cardDialogStatusOptions} />
                    )
                default:
                    return null
            }
        }

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
                {dialog()}
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
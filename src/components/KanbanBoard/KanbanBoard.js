import React, {Component} from 'react';
import './KanbanBoard.css';
import { Droppable } from 'react-beautiful-dnd';
import { ColumnWrapper } from '../Column/Column';


class KanbanBoard extends Component {

    state = {
        tasks: {},
        columns: {},
        columnOrder: [],
    };

    componentDidMount() {
        this.renderMyData();
    }

    renderMyData(){
        fetch('/api/tasks')
            .then((response) => response.json())
            .then((responseJson) => {
                const tasks = responseJson["tasks"];
                Object.entries(tasks).forEach(([key, value]) => {
                    tasks[key]["dueDate"] = new Date(value["dueDate"]);
                    tasks[key]["createdDate"] = new Date(value["createdDate"]);
                })
                this.setState(responseJson)
                console.log(this.state);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    onDragEnd = results => {
        //TODO
    }

    render() {
        const columns = this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            return (
                <ColumnWrapper
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}/>
            )
        });

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {provided => (
                        <KanbanStyleBoard
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}>

                            {provided.placeholder}
                        </KanbanStyleBoard>
                    )}
                </Droppable>
            </DragDropContext>

        );
    }
}



function KanbanStyleBoard(props) {
    return (
        <div className="kanban-style-board">
            {props.children}
        </div>
    );
}

export default KanbanBoard;
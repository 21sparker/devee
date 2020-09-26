import React, {Component} from 'react';
import Card from './components/Card';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default class App extends Component {

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

    render() {
        const columns = this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            return (
                <InnerColumnList
                    key={column.id}
                    column={column}
                    taskMap={this.state.tasks}
                    index={index}/>
            )
        });

        return (
            <div>
                {this.state.data ?
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <KanbanBoard>
                            {columns}
                        </KanbanBoard>
                    </DragDropContext>    
                : <p>Loading data....</p>}
            </div>
        );
    }
}



class KanbanBoard extends Component {

    onDragEnd = result => {
        // TODO:
    }

    render() {
        const columns = this.props.columns.map((col) =>
            <Column key={col.title} title={col.title} items={col.items} />
        );

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="kanban-board">
                    {columns}
                </div>
            </DragDropContext>

        );
    }
}


class Column extends Component {
    render() {
        const cards = this.props.items.map((item, index) => 
            <Card key={item.id} item={item} index={index} />
        );

        return (
            <div className="column">
                <div className="header">
                    <h3>{this.props.title}</h3>
                </div>
                <Droppable droppableId={this.props.title}>
                    {provided => (
                    <TaskList ref={provided.innerRef}
                    {...provided.droppableProps}>
                        {cards}
                        {provided.placeholder}
                    </TaskList>
                    )}
                </Droppable>
           
            </div>
        )
    }
}

class TaskList extends Component {
    render() {
        return (
            <div className="container">
                <ul>
                    {this.props.children}
                </ul>
            </div>
        )
    }
}


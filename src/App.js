import React, {Component} from 'react';
import Card from './components/Card';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default class App extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            currentGroupMethod: "status"
        };

        this.groupMethods = {
            "status": ["Not Started", "In Progress", "Complete"]
        }
    }

    componentWillMount() {
        this.renderMyData();
    }

    renderMyData(){
        fetch('/api/tasks')
            .then((response) => response.json())
            .then((responseJson) => {
                responseJson["tasks"].forEach(i => i.dueDate = new Date(i.dueDate));
                console.log(responseJson["items"])
                this.setState({ data: responseJson["items"] })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    groupData() {
        const columnTitles = this.groupMethods[this.state.currentGroupMethod];

        const columns = [];
        columnTitles.forEach((columnTitle) => {
            const data = this.state.data.filter((item) => item[this.state.currentGroupMethod] === columnTitle);

            columns.push({
                "title": columnTitle,
                "items": data
            })
        });

        return columns;
    }

    render() {
        return (
            <div>
                {this.state.data ? <KanbanBoard columns={this.groupData()} /> : <p>Loading data....</p>}
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


import React, {Component} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import KanbanBoard, { ColumnWrapper } from './components/KanbanBoard/KanbanBoard';


export default class App extends Component {

    render() {
        return (
            <div class="app-container">
                {/* <Navbar/>
                <SidePanel/> */}
                <KanbanBoard/>
            </div>
        );
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


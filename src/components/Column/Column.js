import React, {Component} from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


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

class ColumnWrapper extends Component{
    shouldComponentUpdate(nextProps){
        //TODO: only update when items are updated

        return true;
    }

    render() {

    }

}

export default Column;
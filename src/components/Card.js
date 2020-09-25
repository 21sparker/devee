import React, {Component} from 'react';
import './Card.css';
import { Draggable } from 'react-beautiful-dnd';

class Card extends Component {
    render() {
        const item = this.props.item;
        return (
            <Draggable draggableId={this.props.item.id} index={this.props.index}>
            {(provided) => (
                <Container
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                <p className="title">{item.title}</p>
                <div className="indicator-row">
                    {item.dueDate ? <DueDateIndicator day={item.dueDate.getDate()} 
                    month={item.dueDate.toLocaleString('en-us', { month: 'short' })} /> : null}
                </div>
            </Container>)}
            </Draggable>
        )
    }
}

class Container extends Component {
    render() { 
        return (
            <li className="card">
                {this.props.children}
            </li>
        )
    }
}

function DueDateIndicator(props){
    return (
        <div className="indicator due-date">
            {props.month} {props.day.toString().padStart(2, "0")}
        </div>
    )
}

export default Card;
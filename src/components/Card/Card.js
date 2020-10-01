import React, {Component} from 'react';
import './Card.css';
import { Draggable } from 'react-beautiful-dnd';


function Title(props) {

    return (
        <div className="card-title">
            {props.description}
        </div>
    )
}


class Card extends Component {
    render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                index={this.props.index}>
                    {(provided, snapshot) => (
                        <Container
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            innerRef={provided.innerRef}
                            isDragging={snapshot.isDragging}
                            openCardDialog={this.props.openCardDialog}
                            taskId={this.props.task.id}>
                                <Title description={this.props.task.description}/>
                                <div className="indicator-section">
                                    {this.props.task.dueDate ? <DueDateIndicator date={this.props.task.dueDate} /> : null}
                                </div>
                        </Container>
                    )}
            </Draggable>
        )
    }
}

export class Container extends Component {
    render() {
        const { innerRef, isDragging, children, openCardDialog, taskId, isEditable, ...rest } = this.props;

        if (isEditable) {
            return (
                <div className="card" ref={innerRef} {...rest}>
                    {children}
                </div>
            )
        }
        return (
            <div className="card" ref={innerRef} {...rest} onClick={(e) => openCardDialog(taskId)}>
                {children}
            </div>
        )
    }
}


function DueDateIndicator(props){
    return (
        <div className="indicator due-date">
            {props.date.toLocaleString('en', { month: 'short'})} {props.date.getDate().toString().padStart(2, "0")}
        </div>
    )
}

export default Card;
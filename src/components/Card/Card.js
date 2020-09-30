import React, {Component} from 'react';
import './Card.css';
import { Draggable } from 'react-beautiful-dnd';


// function Title(props) {

//     return (
//         <div className="card-title">
//             {props.description}
//         </div>
//     )
// }


class Title extends Component {
    state = {
        description: this.props.description,
        isEditable: this.props.isEditable,
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState === this.state &&
            nextProps === this.props){
            return false;
        } else if(nextProps !== this.props){
            this.setState({
                description: nextProps.description,
            });
        }
        return true;
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.innerText;
        // const name = target.name;

        this.setState({
            description: value
        });        
    }

    saveInputChange = event => {
        const target = event.target;
        const value = target.innerText;

        console.log("Saved: " + value);
    }

    render() {
        return (
            <div 
                className="card-title" 
                contentEditable={this.state.isEditable}
                onChange={this.handleInputChange}
                onBlur={this.saveInputChange}
                >
                {this.props.description}
            </div>
        )
    }    

}

class EditableTitle extends Component {
    state = {
        description: null,
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState === this.state &&
            nextProps === this.props){
            return false;
        } else if(nextProps !== this.props){
            this.setState({
                description: nextProps.description,
            });
        }
        return true;
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });        
    }

    render() {
        return (
            <div 
                className="card-title" 
                contentEditable="true" 
                onChange={this.handleInputChange}
                onBlur={() => {}}>
                {this.props.description}
            </div>
        )
    }
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
                            taskId={this.props.task.id}
                            isEditable={this.props.task.isEditable}>
                                <Title description={this.props.task.description} isEditable={this.props.task.isEditable}/>
                                <div className="indicator-section">
                                    {this.props.task.dueDate ? <DueDateIndicator date={this.props.task.dueDate} /> : null}
                                </div>
                        </Container>
                    )}
            </Draggable>
        )
    }
}

class Container extends Component {
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
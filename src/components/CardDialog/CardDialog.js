import React, {Component} from 'react';
import './CardDialog.css';
import { DialogOverlay, DialogContent } from '@reach/dialog';

class CardDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: null,
            dueDateString: null,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState === this.state &&
            nextProps === this.props){
            return false;
        } else if(nextProps !== this.props && nextProps.showCardDialog){
            this.setState({
                description: nextProps.task.description,
                dueDateString: convertToInputDateString(nextProps.task.dueDate),
            });
            console.log("edit")
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

    closeDialog(task){
        const newTask = {
            ...task,
            description: this.state.description,
            dueDate: new Date(this.state.dueDateString),
        }

        this.props.closeCardDialog(newTask)
    }

    render() {
        const { showCardDialog, task } = this.props;

        return (
            <DialogOverlay isOpen={showCardDialog} onDismiss={() => this.closeDialog(task)}>
                <DialogContent aria-labelledby="description">
                    {task ? (
                        <div>
                            <input
                                id="description"
                                name="description"
                                type="text" 
                                value={this.state.description} 
                                onChange={this.handleInputChange}/>
                            <input 
                                name="dueDateString" 
                                type="date" 
                                value={this.state.dueDateString} 
                                onChange={this.handleInputChange}/>
                        </div>
                    )
                    : null}
                </DialogContent>
            </DialogOverlay>
        )

    }
}


function convertToInputDateString(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
}

export default CardDialog;
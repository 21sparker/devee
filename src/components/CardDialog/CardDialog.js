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

    // shouldComponentUpdate = (nextProps, nextState) => {
    //     if (nextState === this.state &&
    //         nextProps === this.props){
    //         return false;
    //     } else if(nextProps !== this.props && nextProps.showCardDialog){
    //         this.setState({
    //             description: nextProps.task.description,
    //             dueDateString: nextProps.task.dueDate
    //                             ? convertToInputDateString(nextProps.task.dueDate)
    //                             : undefined,
    //         });
    //     }
    //     return true;
    // }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    closeDialog(task){
        const changes = {
            description: this.state.description,
            dueDate: new Date(this.state.dueDateString),
        }

        // Reset state when dialog is closed
        this.setState({
            description: null,
            dueDateString: null,
        })

        this.props.closeCardDialog(changes)
    }

    render() {
        const { showCardDialog, task } = this.props;

        return (
            <DialogOverlay isOpen={showCardDialog} onDismiss={() => this.closeDialog(task)}>
                <DialogContent aria-labelledby="description">
                    {task ? (
                        // <div>
                        //     <input
                        //         id="description"
                        //         name="description"
                        //         type="text" 
                        //         value={this.state.description} 
                        //         onChange={this.handleInputChange}/>
                        //     <input 
                        //         name="dueDateString" 
                        //         type="date" 
                        //         value={this.state.dueDateString} 
                        //         onChange={this.handleInputChange}/>
                        // </div>
                        <ControlledInput 
                            description={this.state.description}
                            dueDateString={this.state.dueDateString} />
                    )
                    : null}
                </DialogContent>
            </DialogOverlay>
        )

    }
}

// TODO: We need to replace shouldcomponentupdate with the "Fully controlled component" pattern
// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component

function ControlledInput(props) {
    return (
        <div>
            <input
                id="description"
                name="description"
                type="text" 
                value={props.description} 
                onChange={props.handleInputChange}/>
            <input 
                name="dueDateString" 
                type="date" 
                value={props.dueDateString} 
                onChange={props.handleInputChange}/>
        </div>
    )
}


function convertToInputDateString(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
}

export default CardDialog;
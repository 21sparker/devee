import React, {Component} from 'react';
import './CardDialog.css';
import { DialogOverlay, DialogContent } from '@reach/dialog';

class CardDialog extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            description: props.task.description ? props.task.description : "",
            dueDateString: props.task.dueDate
                            ? convertToInputDateString(props.task.dueDate)
                            : "",
            dialogOpen: true,
        };

    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    closeDialog(){
        const changes = {
            description: this.state.description,
            dueDate: new Date(this.state.dueDateString),
        }

        this.setState({
            dialogOpen: false,
        })

        this.props.closeCardDialog(changes)
    }

    render() {
        return (
            <DialogOverlay 
                isOpen={this.state.dialogOpen}
                onDismiss={() => this.closeDialog()}>
                <DialogContent 
                aria-labelledby="description"
                style={{ width: "38vw"}}>
                    <ControlledInput 
                        description={this.state.description}
                        dueDateString={this.state.dueDateString}
                        handleInputChange={this.handleInputChange} />
                </DialogContent>
            </DialogOverlay>
        )

    }
}

// TODO: We need to replace shouldcomponentupdate with the "Fully controlled component" pattern
// https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component

function ControlledInput(props) {
    return (
        <div className="card-dialog-content">
            <div className="card-dialog-header">
                <input
                    id="description"
                    name="description"
                    type="text" 
                    value={props.description} 
                    onChange={props.handleInputChange}/>
            </div>
            <div className="card-dialog-body">
                <input 
                    name="dueDateString" 
                    type="date" 
                    value={props.dueDateString} 
                    onChange={props.handleInputChange}/>
            </div>
        </div>
    )
}


function convertToInputDateString(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
}

export default CardDialog;
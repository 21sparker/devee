import React, {Component} from 'react';
import './CardDialog.css';
import ContentEditable from 'react-contenteditable';
import { DialogOverlay, DialogContent } from '@reach/dialog';

class CardDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.task.description ? props.task.description : "",
            dueDateString: props.task.dueDate
                            ? convertToInputDateString(props.task.dueDate)
                            : "",
            statusId: props.statusId,
            dialogOpen: true,
        };

        this.descriptionRef = React.createRef();
    }

    handleInputChange = change => {
        this.setState({
            ...change
        });
    }

    closeDialog(){
        const changes = {
            description: this.state.description,
            dueDate: this.state.dueDateString !== ""
                        ? new Date(this.state.dueDateString.replace("-", "/"))
                        : null,
            statusId: this.state.statusId,
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
                    <CardDialogContainer>
                        <DescriptionInput
                            description={this.state.description}
                            handleInputChange={this.handleInputChange}
                        />
                        <NameAndInput name="Created Date">
                            <div>
                                {this.props.task.createdDate.toLocaleString('en', { month: 'long'}) + " " + 
                                this.props.task.createdDate.getDate().toString() + ", " + 
                                this.props.task.createdDate.getFullYear().toString()}
                            </div>
                        </NameAndInput>
                        <NameAndInput name="Due Date">
                            <DueDateInput
                                dueDateString={this.state.dueDateString}
                                handleInputChange={this.handleInputChange}
                            />
                        </NameAndInput>
                        <NameAndInput name="Status">
                            <StatusInput
                                statusOptions={this.props.statusOptions}
                                selectedStatusId={this.state.statusId}
                                handleInputChange={this.handleInputChange}
                            />
                        </NameAndInput>
                    </CardDialogContainer>
                </DialogContent>
            </DialogOverlay>
        )

    }
}


function CardDialogContainer(props) {
    return (
        <div className="card-dialog-content">
            {props.children}
        </div>
    )
}


class DescriptionInput extends Component {
    constructor(props){
        super()
        this.contentEditable = React.createRef();
    }

    handleChange = event => {
        const update = {
            description: event.target.value,
        }
        this.props.handleInputChange(update);
    }

    handleKeyPress = event => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    render = () => {
        return <ContentEditable
                    innerRef={this.contentEditable}
                    html={this.props.description}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    className="card-dialog-header"
                />
    }
}


class DueDateInput extends Component {
    handleChange = event => {
        const update = {
            dueDateString: event.target.value,
        }
        this.props.handleInputChange(update);
    }

    render = () => {
        return (
                <input 
                    id="dueDateString"
                    type="date" 
                    value={this.props.dueDateString} 
                    onChange={this.handleChange}
                />
        )
    }
}

class StatusInput extends Component {
    handleChange = event => {
        const update = {
            statusId: event.target.value,
        }
        this.props.handleInputChange(update);
    }

    render = () => {
        return (
            <select value={this.props.selectedStatusId} onChange={this.handleChange}>
                {this.props.statusOptions.map(status => 
                    <option key={status.id} value={status.id}>{status.name}</option>
                )}
            </select>
        )
    }
}

function NameAndInput(props){
    return (
        <div className="card-dialog-input-row">
            <span>{props.name}</span>
            {props.children}
        </div>
    )
}


function convertToInputDateString(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
}

export default CardDialog;
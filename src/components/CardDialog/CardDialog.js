import React, {Component} from 'react';
import './CardDialog.css';
import ContentEditable from 'react-contenteditable';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { Container } from '../Card/Card';

class CardDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: props.task.description ? props.task.description : "",
            dueDateString: props.task.dueDate
                            ? convertToInputDateString(props.task.dueDate)
                            : "",
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
                        : null
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
                        <DueDateInput
                            dueDateString={this.state.dueDateString}
                            handleInputChange={this.handleInputChange}
                        />
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
        return <input 
                    id="dueDateString"
                    type="date" 
                    value={this.props.dueDateString} 
                    onChange={this.handleChange}
                />
    }
}

function convertToInputDateString(dateObj) {
    return new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
}

export default CardDialog;
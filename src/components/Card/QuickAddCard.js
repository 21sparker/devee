import React, {Component} from 'react';
import { Container } from './Card';
import './Card.css';

export default class QuickAddCard extends Component {
    constructor(props){
        super(props);

        this.innerRef = React.createRef();
    }

    render() {
        return (
            <Container
                innerRef={this.innerRef}
                openCardDialog={() => {}}>
                    <QuickAddCardTitle handleAddNewTask={this.props.handleAddNewTask}/>
            </Container>
        )
    }
}

class QuickAddCardTitle extends Component {
    state = {
        description: "",
    }

    titleInput = React.createRef();

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
        this.setState({
            description: event.target.innerText
        });        
    }

    handleLoseFocus = event => {
        this.props.handleAddNewTask({
            description: event.target.innerText,
        })
    }

    handleKeyPress = event => {
        if (event.key === 'Enter') {
            this.titleInput.current.blur();
        }
    }

    componentDidMount() {
        this.titleInput.current.focus();
    }

    render() {
        return (
            <div 
                className="card-title" 
                contentEditable="true"
                onChange={this.handleInputChange}
                onBlur={this.handleLoseFocus}
                onKeyPress={this.handleKeyPress}
                ref={this.titleInput}
                suppressContentEditableWarning="true"
                >
                {this.props.description}
            </div>
        )
    }    

}


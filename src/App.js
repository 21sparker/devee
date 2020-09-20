import React, {Component} from 'react';

export default class App extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            currentGroupMethod: "status"
        };

        this.groupMethods = {
            "status": ["Not Started", "In Progress", "Complete"]
        }
    }

    componentWillMount() {
        this.renderMyData();
    }

    renderMyData(){
        fetch('/api/items')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson["items"])
                this.setState({ data: responseJson["items"] })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    groupData() {
        const columnTitles = this.groupMethods[this.state.currentGroupMethod];

        const columns = [];
        columnTitles.forEach((columnTitle) => {
            const data = this.state.data.filter((item) => item[this.state.currentGroupMethod] === columnTitle);

            columns.push({
                "title": columnTitle,
                "items": data
            })
        });

        return columns;
    }

    render() {
        return (
            <div>
                {this.state.data ? <KanbanBoard columns={this.groupData()} /> : <p>Loading data....</p>}
            </div>
        );
    }
}



class KanbanBoard extends Component {

    render() {
        const columns = this.props.columns.map((col) =>
            <Column key={col.title} title={col.title} items={col.items} />
        );

        return (
            <div>
                <ul style={{display: "inline-flex", listStyleType: "none"}}>
                    {columns}
                </ul>
            </div>
        );
    }
}


class Column extends Component {
    render() {
        const cards = this.props.items.map((item) => 
            <Card key={item.id} item={item} />
        );

        return (
            <li>
                <h3>{this.props.title}</h3>
                <ul style={{listStyleType: "none"}}>{cards}</ul>
            </li>
        )
    }
}

class Card extends Component {
    render() {
        const item = this.props.item;

        return (
            <li>
                <p><b>{item.title}</b> {item.description}</p>
            </li>
        )
    }
}
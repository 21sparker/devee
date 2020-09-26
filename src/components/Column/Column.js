import React, {Component} from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';


function Container(props) {
    return <div className="container">{props.children}</div>
}

function Title(props) {
    return <h3 className="title">{props.children}</h3>
}

function CardListWrapper(props) {
    return <ul className="card-list"></ul>
}

class CardList extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.tasks === this.props.tasks){
            return false;
        }
    }

    render() {
        return this.props.tasks.map((task, index) => 
            <Card key={task.id} task={task} index={index} />
        )
    }

}


class Column extends Component {
    render() {
        const cards = this.props.items.map((item, index) => 
            <Card key={item.id} item={item} index={index} />
        );

        // return (
        //     <div className="column">
        //         <div className="header">
        //             <h3>{this.props.title}</h3>
        //         </div>
        //         <Droppable droppableId={this.props.title}>
        //             {provided => (
        //             <TaskList ref={provided.innerRef}
        //             {...provided.droppableProps}>
        //                 {cards}
        //                 {provided.placeholder}
        //             </TaskList>
        //             )}
        //         </Droppable>
           
        //     </div>
        // )

        return (
            <Draggable draggableId={this.props.column.id} index={this.props.index}>
                {provided => (
                    <Container
                        {...provided.draggableProps}
                        innerRef={provided.innerRef}>
                        
                        <Title {...provided.dragHandleProps}>
                            {this.props.column.title}
                        </Title>

                        <Droppable droppableId={this.props.column.id} type="task">
                            {(provided, snapshot) => (
                                <CardListWrapper
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}
                                    innerRef={provided.innerRef}>
                                        
                                    <CardList tasks={this.props.tasks} />
                                </CardListWrapper>
                            )}
                        </Droppable>
                        <CardList></CardList>
                    </Container>
                )}

            </Draggable>
        )
    }
}



class ColumnWrapper extends Component{
    shouldComponentUpdate(nextProps){
        //TODO: only update when items are updated

        return true;
    }

    render() {

    }

}

export default Column;
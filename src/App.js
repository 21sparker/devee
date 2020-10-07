import React, {Component} from 'react';
import './App.css'
import KanbanBoard from './components/KanbanBoard/KanbanBoard';


export default class App extends Component {

    render() {
        return (
            <div className="app-container">
                {/* <Navbar/>
                <SidePanel/> */}
                <KanbanBoard/>
            </div>
        );
    }
}



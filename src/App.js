import React, {Component} from 'react';
import './App.css'
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Navbar from './components/Navbar/Navbar';


export default class App extends Component {
    render() {
        return (
            <div className="app-container">
                <Navbar />
                <KanbanBoard />
            </div>
        );
    }
}
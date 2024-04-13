// App.js

import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Tables from './Tables';
import LeagueResults from "./LeagueResults";
import TopScorers from "./TopScorers";
import GeneralStatistics from "./GeneralStatistics";
import './App.css'

class App extends Component {
    state = {
        leagues: [],
        selectedLeague: '',
        teams: []
    };


    render() {
        return (
            <div >
                <h1>Minus one</h1>
                <BrowserRouter>
                    <div className={"menu"}>
                        <Link className={"menu-link"} to="/tables">Tables </Link>
                        <Link className={"menu-link"} to="/leagueresults"> League Results</Link>
                        <Link className={"menu-link"} to="/TopScorers"> Top Scorers</Link>
                        <Link className={"menu-link"} to="/GeneralStatistics"> General Statistics</Link>
                    </div>
                    <Routes>
                        <Route path="/tables" element={<Tables/>} />
                        <Route path="/leagueresults" element={<LeagueResults/>}/>
                        <Route path="/TopScorers" element={<TopScorers/>}/>
                        <Route path="/GeneralStatistics" element={<GeneralStatistics/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;

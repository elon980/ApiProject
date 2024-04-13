import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeagueResults() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [startRound, setStartRound] = useState(1);
    const [endRound, setEndRound] = useState(1);
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get('https://app.seker.live/fm1/leagues')
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
            });
    }, []);
    const fetchResultsHistory = () => {
        if (!selectedLeague) return;

        axios.get(`https://app.seker.live/fm1/history/${selectedLeague}`)
            .then(response => {
                setResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching results history:', error);
            });
    };

    useEffect(() => {
        fetchResultsHistory();
    }, [selectedLeague]);

    const handleLeagueChange = (event) => {
        setSelectedLeague(event.target.value);
    };

    const handleStartRoundChange = (event) => {
        setStartRound(parseInt(event.target.value));
    };

    const handleEndRoundChange = (event) => {
        setEndRound(parseInt(event.target.value));
    };

    const filterResultsByRoundRange = () => {
        return results.filter(result => {
            const round = parseInt(result.round);
            return round >= startRound && round <= endRound;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchResultsHistory();
    };

    const countGoals = (result,team) =>{
        const goals = result.goals
        let countHome =0
        let countAway =0
        goals.forEach(goal =>{
            if (goal.home)
                countHome++
            else if (!goal.home)
                countAway++
        })
        if (result.homeTeam.name === team)
            return countHome
        else if (result.awayTeam.name === team)
            return countAway
    }

    return (
        <div>
            <h1>League Results</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="league">Select League:</label>
                    <select id="league" value={selectedLeague} onChange={handleLeagueChange}>
                        <option value="">Select League</option>
                        {leagues.map(league => (
                            <option key={league.id} value={league.id}>{league.name}</option>
                        ))}
                    </select>
                </div>
                {selectedLeague&& <div>
                    <h4>Select the rounds range you want to see:</h4>
                    <div>
                        <label htmlFor="startRound">Start Round:</label>
                        <input id="startRound" type="number" value={startRound} onChange={handleStartRoundChange}/>
                    </div>
                    <div>
                        <label htmlFor="endRound">End Round:</label>
                        <input id="endRound" type="number" value={endRound} onChange={handleEndRoundChange}/>
                    </div>
                </div>}

            </form>
            <ul>
                {filterResultsByRoundRange().map((result, index, array) => {
                    const currentRound = result.round;
                    const previousRound = index > 0 ? array[index - 1].round : null;
                    return (
                        <div key={index}>
                            {currentRound !== previousRound && <h2>Round {currentRound}</h2>}
                            <ul>
                            <li>{`${result.homeTeam.name} ${countGoals(result, result.homeTeam.name)}
                                 - 
                                 ${countGoals(result, result.awayTeam.name)} ${result.awayTeam.name}`}</li>
                            </ul>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}

export default LeagueResults;

import React, {useState, useEffect} from 'react';
import axios from 'axios';

function TopScorers() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [topScorers, setTopScorers] = useState([]);

    useEffect(() => {
        axios.get('https://app.seker.live/fm1/leagues')
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
            });
    }, []);

    useEffect(() => {
        if (!selectedLeague) return;

        axios.get(`https://app.seker.live/fm1/history/${selectedLeague}`)
            .then(response => {
                const matches = response.data;

                const goalCounts = {};
                matches.forEach(match => {
                    match.goals.forEach(goal => {
                        const scorer = goal.scorer.firstName + " " + goal.scorer.lastName;
                        if (goalCounts[scorer]) {
                            goalCounts[scorer]++;
                        } else {
                            goalCounts[scorer] = 1;
                        }
                    });
                });
                const sortedScorers = Object.entries(goalCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);
                setTopScorers(sortedScorers);
            })
            .catch(error => {
                console.error('Error fetching match history:', error);
            });
    }, [selectedLeague]);

    const handleLeagueChange = (event) => {
        setSelectedLeague(event.target.value);
    };

    return (
        <div>
            <h1>Top Scorers</h1>
            <div>
                <label htmlFor="league">Select League:</label>
                <select id="league" value={selectedLeague} onChange={handleLeagueChange}>
                    <option value="">Select League</option>
                    {leagues.map(league => (
                        <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                </select>
            </div>

            {selectedLeague&& (
                <div>
                    <h2>Three Top Scorers:</h2>
                    <ul>
                        {topScorers.map((scorer, index) => (
                            <li key={index}>{`${scorer[0]} - ${scorer[1]} goals`}</li>
                        ))}
                    </ul>
                </div>

            )
            }

        </div>
    )
        ;
}

export default TopScorers;

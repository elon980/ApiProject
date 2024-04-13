import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GeneralStatistics() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [firstHalfGoals, setFirstHalfGoals] = useState(0);
    const [secondHalfGoals, setSecondHalfGoals] = useState(0);
    const [earliestGoal, setEarliestGoal] = useState(null);
    const [latestGoal, setLatestGoal] = useState(null);
    const [highestScoringRound, setHighestScoringRound] = useState(null);
    const [lowestScoringRound, setLowestScoringRound] = useState(null);

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
        if (selectedLeague) {
            axios.get(`https://app.seker.live/fm1/history/${selectedLeague}`)
                .then(response => {
                    const matches = response.data;
                    let totalFirstHalfGoals = 0;
                    let totalSecondHalfGoals = 0;
                    let earliestGoalTime = Number.MAX_VALUE;
                    let latestGoalTime = Number.MIN_VALUE;
                    let maxGoalsRound = 0;
                    let minGoalsRound = Number.MAX_VALUE;

                    matches.forEach(match => {
                        match.goals.forEach(goal => {
                            const minute = parseInt(goal.minute);
                            if (minute <= 45) {
                                totalFirstHalfGoals++;
                            } else {
                                totalSecondHalfGoals++;
                            }

                            if (minute < earliestGoalTime) {
                                earliestGoalTime = minute;
                                setEarliestGoal(`${goal.scorer.firstName} ${goal.scorer.lastName}, ${minute}'`);
                            }

                            if (minute > latestGoalTime) {
                                latestGoalTime = minute;
                                setLatestGoal(`${goal.scorer.firstName} ${goal.scorer.lastName}, ${minute}'`);
                            }
                        });

                        const totalGoals = match.goals.length;
                        if (totalGoals > maxGoalsRound) {
                            maxGoalsRound = totalGoals;
                            setHighestScoringRound(match.round);
                        }

                        if (totalGoals < minGoalsRound) {
                            minGoalsRound = totalGoals;
                            setLowestScoringRound(match.round);
                        }
                    });

                    setFirstHalfGoals(totalFirstHalfGoals);
                    setSecondHalfGoals(totalSecondHalfGoals);
                })
                .catch(error => {
                    console.error('Error fetching general statistics:', error);
                });
        }
    }, [selectedLeague]);

    const handleLeagueChange = (event) => {
        setSelectedLeague(event.target.value);
    };

    return (
        <div>
            <h2>General Statistics</h2>
            <div>
                <label htmlFor="league">Select League:</label>
                <select id="league" value={selectedLeague} onChange={handleLeagueChange}>
                    <option value="">Select League</option>
                    {leagues.map(league => (
                        <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                </select>
            </div>
            {selectedLeague && (
                <div>
                    <p>First Half Goals: {firstHalfGoals}</p>
                    <p>Second Half Goals: {secondHalfGoals}</p>
                    <p>Earliest Goal: {earliestGoal}</p>
                    <p>Latest Goal: {latestGoal}</p>
                    <p>Highest Scoring Was In Round: {highestScoringRound}</p>
                    <p>Lowest Scoring Was In Round: {lowestScoringRound}</p>
                </div>
            )}
        </div>
    );
}

export default GeneralStatistics;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeagueTable() {
    const [leagues, setLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [leagueTable, setLeagueTable] = useState([]);
    const [teamInfo, setTeamInfo] = useState([]);
    const [squadInfo, setSquadInfo] = useState(null);

    useEffect(() => {
        axios.get('https://app.seker.live/fm1/leagues')
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
            });
    }, []);

    const fetchLeagueTable = (leagueId) => {
        axios.get(`https://app.seker.live/fm1/history/${leagueId}`)
            .then(response => {
                const matches = response.data;
                const teamStats = {};
                matches.forEach(match => {
                    const goals = match.goals;
                    let homeGoals = 0;
                    let awayGoals = 0;
                    goals.forEach(goal =>{
                        if (goal.home)
                            homeGoals++;
                        else if (!goal.home)
                            awayGoals++;
                    })
                    updateTeamStats(teamStats, match.homeTeam, match.awayTeam, homeGoals, awayGoals);
                    updateTeamStats(teamStats, match.awayTeam, match.homeTeam, awayGoals, homeGoals);
                });

                // Convert teamStats to array
                const tableData = Object.keys(teamStats).map(teamName => ({
                    team: teamName,
                    points: teamStats[teamName].points,
                    goalDifference: teamStats[teamName].goalsFor - teamStats[teamName].goalsAgainst,
                    id: teamStats[teamName].id // Assuming you have team id in teamStats
                }));

                tableData.sort((a, b) => {
                    if (a.points !== b.points) {
                        return b.points - a.points; // Sort by points descending
                    } else {
                        return b.goalDifference - a.goalDifference; // If points are equal, sort by goal difference descending
                    }
                });

                setLeagueTable(tableData);
            })
            .catch(error => {
                console.error('Error fetching league table:', error);
            });
    };

    const updateTeamStats = (teamStats, team, opponent, goalsFor, goalsAgainst) => {
        if (!teamStats[team.name]) {
            teamStats[team.name] = { points: 0, goalsFor: 0, goalsAgainst: 0, id: team.id };
        }

        if (goalsFor > goalsAgainst) {
            teamStats[team.name].points += 3; // Win
        } else if (goalsFor === goalsAgainst) {
            teamStats[team.name].points += 1; // Draw
        }

        // Update goals
        teamStats[team.name].goalsFor += goalsFor;
        teamStats[team.name].goalsAgainst += goalsAgainst;
    };

    const handleLeagueChange = (event) => {
        const selectedId = event.target.value;
        setSelectedLeague(selectedId);
        if (selectedId) {
            fetchLeagueTable(selectedId);
        }
    };

    const fetchTeamInfo = (teamId) => {
        axios.get(`https://app.seker.live/fm1/history/${selectedLeague}/${teamId}`)
            .then(response => {
                const matches = response.data;
                let homeTeamName = ""
                let awayTeamName = ""
                const info = []
                matches.forEach(match => {
                    awayTeamName = match.awayTeam.name
                    homeTeamName = match.homeTeam.name
                    let homeGoal = 0;
                    let awayGoal = 0;
                    match.goals.forEach(goal => {
                        if (goal.home)
                            homeGoal++;
                        else if (!goal.home)
                            awayGoal++
                    })
                    info.push(homeTeamName + " " + homeGoal + "-" + awayGoal + " " + awayTeamName)
                })
                setTeamInfo(info)

            })
            .catch(error => {
                console.error('Error fetching team info:', error);
            });
    };


    const handleTeamClick = (teamId) => {
        axios.get(`https://app.seker.live/fm1/squad/${selectedLeague}/${teamId}`)
            .then(response => {
                const squad = response.data;
                let name = "";
                const players = [];
                squad.forEach(player =>{
                    name = player.firstName+ " " + player.lastName;
                    players.push(name);
                })
                setSquadInfo(players);

            })
        fetchTeamInfo(teamId); // Add this line here

    };

    return (
        <div>
            <h1>League Table</h1>
            <div>
                <select value={selectedLeague} onChange={handleLeagueChange}>
                    <option value="">Select League</option>
                    {leagues.map(league => (
                        <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                </select>
            </div>
            {leagueTable.length>0&& (
                 <h4>Please click on team to see list player and history games</h4>
            )}
            {leagueTable.length>0&& (
                        <table>
                            <thead>
                            <tr>
                                <th>Team</th>
                                <th>Points</th>
                                <th>Goal Difference</th>
                            </tr>
                            </thead>
                            <tbody>
                            {leagueTable.map((teamData, index) => (
                                <tr key={index}
                                    style={{color: index === 0 ? 'blue' : index >= leagueTable.length - 3 ? 'red' : 'black'}}
                                    onClick={() => {
                                        handleTeamClick(teamData.id);
                                    }}>
                                    <td>{teamData.team}</td>
                                    <td>{teamData.points}</td>
                                    <td>{teamData.goalDifference}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        )}
                        {squadInfo && (
                            <div>
                                <h2>Players:</h2>
                                <ul>
                                    {squadInfo.map((player, index) => (
                                        <li key={index}>{player}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {teamInfo.length>0&&(

                            <div>
                                <h2>The history of games:</h2>
                                <ul>
                                    {teamInfo.map((game, index) => (
                                        <li key={index}>{game}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
        </div>
    );
}


export default LeagueTable;

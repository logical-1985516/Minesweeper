import React from 'react';

export default function UserStatistics(props) {
    const userStatistics = props.userStatistics

    return (
        <div className="user-statistics--container">
            <h2>User Statistics</h2>
            {props.userData.username ? 
            <div>
                <div><button>Refresh</button></div>
                {userStatistics ? (
                    <div>
                        <div>Username: {userStatistics.username}</div>
                        <div>Games Played: {userStatistics.games_played}</div>
                        <div>Wins: {userStatistics.wins}</div>
                    </div>
                ) : (
                    <div>Loading user statistics...</div>
                )}
            </div>
            : <p>Log in to track your statistics!</p>
            }
        </div>
    )
}
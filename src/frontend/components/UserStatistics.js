import React from 'react';

export default function UserStatistics(props) {
    return (
        <div className="user-statistics--container">
            <h2>User Statistics</h2>
            {props.userData.username ? 
            <p>
                <div><button>Refresh</button></div>
                Feature under development. Coming soon!
            </p>
            : <p>Log in to track your statistics!</p>
            }
        </div>
    )
}
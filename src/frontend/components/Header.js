import React from "react"

export default function Header(props) {
    return (
        <nav className="header--container">
            <div className="header--mine-counter">Mines left: {props.minesLeft}</div>
            <div className="header--middle">
                {props.gameStatus === "lose" 
                    ? <div className="header--loss">You Lost!</div>
                    : props.gameStatus === "win" && <div className="header--win">You Won!</div>
                }
                <button className="header--game-button" onClick={props.resetBoard}>
                    {props.gameStatus ? "New game" : "Start game"}
                </button>
            </div>
            <div className="header--stopwatch">Time: {props.time}</div>
        </nav>
    )
}
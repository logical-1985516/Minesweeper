import React from "react"

export default function Header(props) {
    return (
        <nav className="app--nav">
            <div className="app--mine-counter">Mines left: {props.minesLeft}</div>
            <div className="app--nav-middle">
                {props.gameStatus === "lose" 
                    ? <div className="app--outcome">You Lost!</div>
                    : props.gameStatus === "win" && <div className="app--outcome">You Won!</div>
                }
                <button className="app--game-button" onClick={props.resetBoard}>
                    {props.gameStatus ? "New game" : "Start game"}
                </button>
            </div>
            <div className="app--stopwatch">Time: {props.time}</div>
        </nav>
    )
}
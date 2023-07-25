import React from "react"

export default function GameResult(props) {
    return (
        <div className="gameResult--container">
            <div>
                Time: {`${props.time}s`}
            </div>
            <div>
                3BV: {props.threeBV}
            </div>
        </div>

    )
}
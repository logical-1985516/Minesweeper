import React from "react"

export default function GameResult(props) {
    const efficiency = 100 * props.current3BV / (props.usefulClicks + props.wastedClicks)
    const threeBVPerSecond = props.current3BV / props.time
    return (
        <div className="gameResult--container">
            <div>
                Time: {`${props.time}s`}
            </div>
            <div>
                3BV: {props.threeBV}
            </div>
            <div>
                Current 3BV: {props.current3BV}
            </div>
            <div>
                3BV/s: {Math.round(100 * threeBVPerSecond) / 100}
            </div>
            <div>
                Useful Clicks: {props.usefulClicks}
            </div>
            <div>
                Wasted Clicks: {props.wastedClicks}
            </div>
            <div>
                Efficiency: {`${Math.round(efficiency)}%`}
            </div>
        </div>

    )
}
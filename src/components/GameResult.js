import React from "react"

export default function GameResult(props) {
    // const efficiency = 100 * (props.usefulClicks + props.wastedClicks) / props.threeBV
    // const threeBVPerSecond = Math.round(props.threeBV / props.time)
    return (
        <div className="gameResult--container">
            <div>
                Time: {`${props.time}s`}
            </div>
            <div>
                3BV: {props.threeBV}
            </div>
            {/* <div>3BV/s: {props.threeBV / props.time}</div> */}
            <div>
                Useful Clicks: {props.usefulClicks}
            </div>
            <div>
                Wasted Clicks: {props.wastedClicks}
            </div>
            <div>
                {/* Efficiency: {`${Math.round(efficiency)}%`} */}
            </div>
        </div>

    )
}
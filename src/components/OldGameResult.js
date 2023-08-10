import React from "react"

export default function OldGameResult(props) {
    const showMetricsData = props.showMetricsData
    const width = props.width
    const height = props.width
    const newBoard = props.board
    const mines = props.mines
    const threeBV = props.threeBV
    const current3BV = props.current3BV
    const correctFlags = props.correctFlags

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    const gameProgress = current3BV / threeBV
    const usefulClicks = props.usefulLeftClicks + props.usefulRightClicks + props.usefulChords
    const wastedClicks = props.wastedLeftClicks + props.wastedRightClicks + props.wastedChords
    const totalClicks = usefulClicks + wastedClicks
    const threeBVPerSecond = current3BV / props.time
    const RQP = props.time / threeBVPerSecond
    const IOS = Math.log(threeBVPerSecond) / Math.log(props.time)
    const clicksPerSecond = totalClicks / props.time
    const usefulClicksPerSecond = usefulClicks / props.time
    const efficiency = current3BV / totalClicks
    const throughput = current3BV / usefulClicks
    const correctness = usefulClicks / totalClicks
    const date = new Date(props.date)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", 
        "September", "October", "November", "December"];
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

    return (
        <tr>
            <td>
                <button onClick={() => retrieveGameData(newBoard, props.difficulty,
                        height, width, mines, correctFlags, props.time, threeBV, current3BV, 
                        props.usefulLeftClicks, props.usefulRightClicks, props.usefulChords, 
                        props.wastedLeftClicks, props.wastedRightClicks, props.wastedChords)}>
                    View
                </button>
            </td>
            <td>{current3BV === threeBV ? "Win" : "Loss"}</td>
            <td>{props.gameMode}</td>
            <td>{props.difficulty}</td>
            <td>{height}x{width}/{mines}</td>
            <td>{props.time}s</td>
            <td>{Math.round(1000 * props.time * threeBV / current3BV) / 1000}s</td>
            <td>{current3BV}/{threeBV} ({Math.round(100 * gameProgress)}%)</td>
            <td>{usefulClicks} ({props.usefulLeftClicks} + {props.usefulRightClicks} + {
                props.usefulChords})</td>
            <td>{wastedClicks} (
                {props.wastedLeftClicks} + {props.wastedRightClicks} + {props.wastedChords})</td>
            <td>{totalClicks}</td>
            <td>{Math.round(1000 * threeBVPerSecond) / 1000}</td>
            {showMetricsData.showRQP && <td>{Math.round(1000 * RQP) / 1000}</td>}
            {showMetricsData.showIOS && <td>{Math.round(1000 * IOS) / 1000}</td>}
            {showMetricsData.showClicksPerSecond && 
                <td>{Math.round(1000 * clicksPerSecond) / 1000}</td>}
            {showMetricsData.showUsefulClicksPerSecond && 
                <td>{Math.round(1000 * usefulClicksPerSecond) / 1000}</td>}
            <td>{Math.round(100 * efficiency)}%</td>
            {showMetricsData.showThroughput && <td>{Math.round(100 * throughput)}%</td>}
            {showMetricsData.showCorrectness && <td>{Math.round(100 * correctness)}%</td>}
            <td>{`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()
                } ${date.getHours()}:${minutes}:${seconds}`}</td>
        </tr>
    )
}
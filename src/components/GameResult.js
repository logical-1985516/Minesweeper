import React from "react"
import { resultsCollection } from "../firebase"
import { addDoc } from "firebase/firestore"

export default function GameResult(props) {
    const showMetricsData = props.showMetricsData
    const gameProgress = props.current3BV / props.threeBV
    const estimatedTime = props.time / gameProgress
    const threeBVPerSecond = props.current3BV / props.time
    const usefulClicks = props.usefulLeftClicks + props.usefulRightClicks + props.usefulChords
    const wastedClicks = props.wastedLeftClicks + props.wastedRightClicks + props.wastedChords
    const totalClicks = usefulClicks + wastedClicks
    const RQP = props.time / threeBVPerSecond
    const IOS = Math.log(threeBVPerSecond) / Math.log(props.time)
    const usefulClicksPerSecond = usefulClicks / props.time
    const clicksPerSecond = totalClicks / props.time
    const efficiency = props.current3BV / totalClicks
    const throughput = props.current3BV / usefulClicks
    const correctness = usefulClicks / totalClicks
    const boardData = props.board.map(row => row.map(tile => ({
        key: tile.id,
        value: tile.value,
        isRevealed: tile.isRevealed,
        isFlagged: tile.isFlagged
    })))

    async function addGameResult() {
        addDoc(resultsCollection, {
            time: props.time,
            threeBV: props.threeBV,
            current3BV: props.current3BV,
            usefulLeftClicks: props.usefulLeftClicks,
            usefulRightClicks: props.usefulRightClicks,
            usefulChords: props.usefulChords,
            wastedLeftClicks: props.wastedLeftClicks,
            wastedRightClicks: props.wastedRightClicks,
            wastedChords: props.wastedChords
        })
    }

    React.useEffect(() => {
        addGameResult()
    }, [])

    return (
        <div className="gameResult--container">
            <div className="gameResult--stats">
                <div>Statistics</div>
                <div className="gameResult--time-stats">
                    <div className="gameResult--title">Time</div>
                    <div>
                        Time: {`${props.time}s`}
                    </div>
                    <div>
                        Estimated Time: {`${Math.round(1000 * estimatedTime) / 1000}s`}
                    </div>
                </div>
                <div className="gameResult--3BV-stats">
                    <div className="gameResult--title">Progress</div>
                    <div>
                        3BV: {props.threeBV}
                    </div>
                    <div>
                        Current 3BV: {props.current3BV}
                    </div>
                    <div>Game Progress: {`${Math.round(100 * gameProgress)}%`}</div>
                </div>
                <div className="gameResult--click-stats">
                    <div className="gameResult--title">Clicks</div>
                    <div>
                        Useful Clicks: {usefulClicks}
                    </div>
                    <div>
                        Wasted Clicks: {wastedClicks}
                    </div>
                    <div>
                        Total Clicks: {totalClicks}
                    </div>
                </div>
                <div className="gameResult--usefulClick-stats">
                    <div className="gameResult--title">Useful Clicks</div>
                    <div>
                        Left Clicks: {props.usefulLeftClicks}
                    </div>
                    <div>
                        Right Clicks: {props.usefulRightClicks}
                    </div>
                    <div>
                        Chords: {props.usefulChords}
                    </div>
                </div>
                <div className="gameResult--wastedClick-stats">
                    <div className="gameResult--title">Wasted Clicks</div>
                    <div>
                        Left Clicks: {props.wastedLeftClicks}
                    </div>
                    <div>
                        Right Clicks: {props.wastedRightClicks}
                    </div>
                    <div>
                        Chords: {props.wastedChords}
                    </div>
                </div>
            </div>
            <div className="gameResult--metrics">
                <div>Performance</div>
                <div className="gameResult--speed-metric">
                    <div className="gameResult--title">Speed</div>
                    <div>
                        3BV/s: {Math.round(1000 * threeBVPerSecond) / 1000}
                    </div>
                    {showMetricsData.showRQP && 
                    <div>
                        RQP: {Math.round(1000 * RQP) / 1000}
                    </div>}
                    {showMetricsData.showIOS && 
                    <div>
                        IOS: {Math.round(1000 * IOS) / 1000}
                    </div>}
                </div>
                {(showMetricsData.showClicksPerSecond || 
                showMetricsData.showUsefulClicksPerSecond) && 
                <div className="gameResult--clicks-metric">
                    <div className="gameResult--title">Clicking speed</div>
                    {showMetricsData.showClicksPerSecond && 
                    <div>
                        Clicks/s: {Math.round(1000 * clicksPerSecond) / 1000}
                    </div>}
                    {showMetricsData.showUsefulClicksPerSecond 
                        && 
                    <div>
                        Useful Clicks/s: {Math.round(1000 * usefulClicksPerSecond) / 1000}
                    </div>}
                </div>}
                <div className="gameResult--efficiency-metric">
                    <div className="gameResult--title">Efficiency</div>
                    <div>
                        Efficiency: {`${Math.round(100 * efficiency)}%`}
                    </div>
                    {showMetricsData.showThroughput && 
                    <div>
                        Throughput: {`${Math.round(100 * throughput)}%`}
                    </div>}
                    {showMetricsData.showCorrectness && 
                    <div>
                        Correctness: {`${Math.round(100 * correctness)}%`}
                    </div>}
                </div>
            </div>
        </div>
    )
}
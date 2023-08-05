import React from "react"
import { resultsCollection } from "../firebase"
import { onSnapshot } from "firebase/firestore"

export default function AllGamesPlayed(props) {
    const showMetricsData = props.showMetricsData
    const [gamesResults, setGamesResults] = React.useState("")

    React.useEffect(() => {
        const unsubscribe = onSnapshot(resultsCollection, snapshot => {
            const resultsArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setGamesResults(resultsArr)
        })
        return unsubscribe
    }, [])

    function retrieveBoardData(board) {
        console.log(board)
        //return props.retrieveBoardData(board)
    }

    const showBoardElements = gamesResults && gamesResults.map(gameResults => {
        const height = gameResults.board.length / gameResults.width
        const newBoard = []
        let curr = 0
        for (let i = 0; i < height; i++) {
            newBoard.push([])
            for (let j = 0; j < gameResults.width; j++) {
                newBoard[i].push(gameResults.board[curr])
                curr++
            }
        }
        return (
            <div>
                <button 
                    onClick={() => retrieveBoardData(newBoard)}
                >
                    Show board
                </button>
            </div>
        )
    })

    function getResults(stat) {
        return gamesResults && (stat === "time"
            ? gamesResults.map(gameResults => <div>{gameResults[stat]}s</div>)
            : gamesResults.map(gameResults => <div>{gameResults[stat]}</div>)
        )
    }

    const estimatedTimeElements = gamesResults && gamesResults.map(gameResults => {
        const estimatedTime = gameResults.time * gameResults.threeBV / gameResults.current3BV
        return (
            <div>{Math.round(1000 * estimatedTime) / 1000}s</div>
        )
    })

    const gameProgressElements = gamesResults && gamesResults.map(gameResult => {
        const gameProgress = gameResult.current3BV / gameResult.threeBV
        return (
            <div>{Math.round(100 * gameProgress)}%</div>
        )
    })

    const totalClicksElements = gamesResults && gamesResults.map(gameResults => {
        return (
            <div>{gameResults.usefulClicks + gameResults.wastedClicks}</div>
        )
    })

    const threeBVPerSecondElements = gamesResults && gamesResults.map(gameResults => {
        const threeBVPerSecond = gameResults.current3BV / gameResults.time
        return (
            <div>{Math.round(1000 * threeBVPerSecond) / 1000}</div>
        )
    })

    const RQPElements = gamesResults && gamesResults.map(gameResults => {
        const RQP = gameResults.time * gameResults.time / gameResults.current3BV
        return (
            <div>{Math.round(1000 * RQP) / 1000}</div>
        )
    })

    const IOSElements = gamesResults && gamesResults.map(gameResults => {
        const IOS = Math.log(gameResults.current3BV) / Math.log(gameResults.time)
        return (
            <div>{Math.round(1000 * IOS) / 1000}</div>
        )
    })

    const clicksPerSecondElements = gamesResults && gamesResults.map(gameResults => {
        const clicksPerSecond = (gameResults.usefulClicks + 
            gameResults.wastedClicks) / gameResults.time
        return (
            <div>{Math.round(1000 * clicksPerSecond) / 1000}</div>
        )
    })

    const usefulClicksPerSecondElements = gamesResults && gamesResults.map(gameResults => {
        const usefulClicksPerSecond = gameResults.usefulClicks / gameResults.time
        return (
            <div>{Math.round(1000 * usefulClicksPerSecond) / 1000}</div>
        )
    })

    const efficiencyElements = gamesResults && gamesResults.map(gameResults => {
        const efficiency = gameResults.current3BV / (gameResults.usefulClicks +
            gameResults.wastedClicks)
        return (
            <div>{Math.round(100 * efficiency)}%</div>
        )
    })

    const throughputElements = gamesResults && gamesResults.map(gameResults => {
        const throughput = gameResults.current3BV / gameResults.usefulClicks
        return (
            <div>{Math.round(100 * throughput)}%</div>
        )
    })

    const correctnessElements = gamesResults && gamesResults.map(gameResults => {
        const correctness = gameResults.usefulClicks / (gameResults.usefulClicks +
            gameResults.wastedClicks)
        return (
            <div>{Math.round(100 * correctness)}%</div>
        )
    })

    return (
        <div className="allGamesPlayed--container">
            <span>
                {showBoardElements}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Time</div>
                {getResults("time")}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Estimated Time</div>
                {estimatedTimeElements}
            </span>
            <span className="allGamesPlayed--stats">
                <div>3BV</div>
                {getResults("threeBV")}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Current 3BV</div>
                {getResults("current3BV")}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Game Progress</div>
                {gameProgressElements}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Useful Clicks</div>
                {getResults("usefulClicks")}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Wasted Clicks</div>
                {getResults("wastedClicks")}
            </span>
            <span className="allGamesPlayed--stats">
                <div>Total Clicks</div>
                {totalClicksElements}
            </span>
            <span className="allGamesPlayed--stats">
                <div>3BV/s</div>
                {threeBVPerSecondElements}
            </span>
            {showMetricsData.showRQP &&
            <span className="allGamesPlayed--stats">
                <div>RQP</div>
                {RQPElements}
            </span>}
            {showMetricsData.showIOS &&
            <span className="allGamesPlayed--stats">
                <div>IOS</div>
                {IOSElements}
            </span>}
            {showMetricsData.showClicksPerSecond && 
            <span className="allGamesPlayed--stats">
                <div>CL/s</div>
                {clicksPerSecondElements}
            </span>}
            {showMetricsData.showUsefulClicksPerSecond &&
            <span className="allGamesPlayed--stats">
                <div>Useful CL/s</div>
                {usefulClicksPerSecondElements}
            </span>}
            <span className="allGamesPlayed--stats">
                <div>Efficiency</div>
                {efficiencyElements}
            </span>
            {showMetricsData.showThroughput &&
            <span className="allGamesPlayed--stats">
                <div>Throughput</div>
                {throughputElements}
            </span>}
            {showMetricsData.showCorrectness &&
            <span className="allGamesPlayed--stats">
                <div>Correctness</div>
                {correctnessElements}
            </span>}
        </div>
    )
}
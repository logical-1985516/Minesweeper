import React from "react"
import OldGameResult from "./OldGameResult"
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

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    const oldGameResultElements = gamesResults && gamesResults.map(gameResult => 
        <OldGameResult 
            key={gameResult.id}
            gameResult={gameResult}
            showMetricsData={showMetricsData}
            retrieveGameData={retrieveGameData}
        />
    )

    return (
        <table>
            <th>View</th>
            <th>Difficulty</th>
            <th>Board</th>
            <th>Time</th>
            <th>Est Time</th>
            <th>3BV</th>
            <th>Useful Clicks</th>
            <th>Wasted Clicks</th>
            <th>Clicks</th>
            <th>3BV/s</th>
            {showMetricsData.showRQP &&<th>RQP</th>}
            {showMetricsData.showIOS && <th>IOS</th>}
            {showMetricsData.showClicksPerSecond && <th>CL/s</th>}
            {showMetricsData.showUsefulClicksPerSecond && <th>UCL/s</th>}
            <th>Eff</th>
            {showMetricsData.showThroughput && <th>Thrp</th>}
            {showMetricsData.showCorrectness && <th>Corr</th>}
            <th>Date</th>
            {oldGameResultElements}
        </table>
    )
}
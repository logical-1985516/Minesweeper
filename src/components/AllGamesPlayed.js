import React from "react"
import OldGameResult from "./OldGameResult"
import { nanoid } from "nanoid"
import { resultsCollection } from "../firebase"
import { onSnapshot } from "firebase/firestore"

export default function AllGamesPlayed(props) {
    const showMetricsData = props.showMetricsData
    const [gamesResults, setGamesResults] = React.useState("")
    const [oldGamesFontSize, setOldGamesFontSize] = React.useState(
        JSON.parse(localStorage.getItem("oldGamesFontSize")) || 16
    )
    const [showFontSizeDropdown, setShowFontSizeDropdown] = React.useState(false)

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

    function toggleFontSizeDropdown() {
        setShowFontSizeDropdown(oldShowFontSizeDropdown => !oldShowFontSizeDropdown)
    }

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords)
    }

    const fontSizes = [10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24]

    React.useEffect(() => {
        localStorage.setItem("oldGamesFontSize")
    }, [oldGamesFontSize])

    const changeFontSizeElements = fontSizes.map(fontsize =>
        <div key={nanoid()}
            onClick={() => setOldGamesFontSize(fontsize)}
            style={{backgroundColor: fontsize === oldGamesFontSize ? "lightblue" : "none"}}
            className="settings--tile-size">{fontsize}</div>)

    const oldGameResultElements = gamesResults && gamesResults.map(gameResult => 
        <OldGameResult 
            key={gameResult.id}
            gameResult={gameResult}
            showMetricsData={showMetricsData}
            retrieveGameData={retrieveGameData}
        />
    )

    const styles = {
        fontSize: `${oldGamesFontSize}px`
    }

    return (
        <div>
            <div style={{marginBottom: "10px"}}>
                <div className="settings--tile-container">
                    <span>Font Size: {oldGamesFontSize}</span>
                    <div>
                        <button onClick={toggleFontSizeDropdown}>Select</button>
                        {showFontSizeDropdown && <div className="settings--tile-sizes-container">
                            {changeFontSizeElements}
                        </div>}
                    </div>
                </div>
            </div>
            <table style={styles}>
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
        </div>
    )
}
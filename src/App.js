import React from "react"
import Navbar from "./components/Navbar"
import GameBoard from "./components/GameBoard"
import Footer from "./components/Footer"
import "./style.css"

export default function App() {
    const [boardProperties, setBoardProperties] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")) || {
            difficulty: "Beginner",
            height: 9,
            width: 9,
            initialMines: 10
    })
    
    const [showMetricsData, setShowMetricsData] = React.useState(
        JSON.parse(localStorage.getItem("advancedMetrics")) || {
        showRQP: false,
        showIOS: false,
        showClicksPerSecond: false,
        showUsefulClicksPerSecond: false,
        showThroughput: false,
        showCorrectness: false
    })

    const [tileSize, setTileSize] = React.useState(
        JSON.parse(localStorage.getItem("tileSize")) || 24
    )

    const [numberSize, setNumberSize] = React.useState(
        JSON.parse(localStorage.getItem("numberSize")) || 2 / 3
    )

    const [oldGameData, setOldGameData] = React.useState(
        JSON.parse(localStorage.getItem("oldGameData"))
    )

    function changeBoardProperties(boardProperties) {
        setBoardProperties(boardProperties)
    }

    function changeShowMetricsData(formData) {
        setShowMetricsData(formData)
    }

    function changeTileSize(newTileSize) {
        setTileSize(newTileSize)
    }

    function changeNumberSize(newNumberSize) {
        setNumberSize(newNumberSize)
    }

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords) {
        setBoardProperties({
            difficulty: difficulty,
            height: height,
            width: width,
            initialMines: mines
        })
        setOldGameData({
            board: newBoard,
            correctFlags: correctFlags,
            time: time,
            threeBV: threeBV,
            current3BV: current3BV,
            usefulLeftClicks: usefulLeftClicks,
            usefulRightClicks: usefulRightClicks,
            usefulChords: usefulChords,
            wastedLeftClicks: wastedLeftClicks,
            wastedRightClicks: wastedRightClicks,
            wastedChords: wastedChords
        })
    }

    return (
        <div className="app--container">
            <Navbar 
                changeBoardProperties={changeBoardProperties}
                boardProperties={boardProperties}
                changeShowMetricsData={changeShowMetricsData}
                showMetricsData={showMetricsData}
                changeTileSize={changeTileSize}
                changeNumberSize={changeNumberSize}
                retrieveGameData={retrieveGameData}
            />
            <GameBoard 
                boardProperties={boardProperties}
                showMetricsData={showMetricsData}
                tileSize={tileSize}
                numberSize={numberSize}
                oldGameData={oldGameData}
            />
            <Footer />
        </div>
    )
}
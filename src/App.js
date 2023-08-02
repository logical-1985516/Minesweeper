import React from "react"
import Navbar from "./components/Navbar"
import GameBoard from "./components/GameBoard"
import Footer from "./components/Footer"
import "./style.css"

export default function App() {
    const [boardProperties, setBoardProperties] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")) || {
            difficulty: "Beginner",
            height: 8,
            width: 8,
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

    function changeBoardProperties(boardProperties) {
        setBoardProperties(boardProperties)
    }

    function changeShowMetricsData(formData) {
        setShowMetricsData(formData)
    }

    return (
        <div className="app--container">
            <Navbar 
                changeBoardProperties={changeBoardProperties}
                changeShowMetricsData={changeShowMetricsData}
                showMetricsData={showMetricsData}
            />
            <GameBoard 
                boardProperties={boardProperties}
                showMetricsData={showMetricsData}
            />
            <Footer />
        </div>
    )
}
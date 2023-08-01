import React from "react"
import Navbar from "./components/Navbar"
import GameBoard from "./components/GameBoard"
import Footer from "./components/Footer"
import "./style.css"

export default function App() {
    const [height, setHeight] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")).height || 8)
    const [width, setWidth] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")).width || 8)
    const [initialMines, setInitialMines] = React.useState(
        JSON.parse(localStorage.getItem("currentBoard")).mines || 8)
    const [showMetricsData, setShowMetricsData] = React.useState(
        JSON.parse(localStorage.getItem("advancedMetrics")) || {
        showRQP: false,
        showIOS: false,
        showClicksPerSecond: false,
        showUsefulClicksPerSecond: false,
        showThroughput: false,
        showCorrectness: false
    })

    function changeBoardProperties(height, width, mines) {
        setHeight(height)
        setWidth(width)
        setInitialMines(mines)
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
                height={height}
                width={width}
                mines={initialMines}
                showMetricsData={showMetricsData}
            />
            <Footer />
        </div>
    )
}
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

    function changeBoardProperties(height, width, mines) {
        setHeight(height)
        setWidth(width)
        setInitialMines(mines)
    }

    return (
        <div>
            <Navbar 
                changeBoardProperties={changeBoardProperties}
            />
            <GameBoard 
                height={height}
                width={width}
                mines={initialMines}
                updateBoard
            />
            <Footer />
        </div>
    )
}
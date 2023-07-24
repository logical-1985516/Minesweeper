import React from "react"
import Navbar from "./components/Navbar"
import GameBoard from "./components/GameBoard"
import Footer from "./components/Footer"
import "./style.css"

export default function App() {
    const [height, setHeight] = React.useState(8)
    const [width, setWidth] = React.useState(8)
    const [initialMines, setInitialMines] = React.useState(10)

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
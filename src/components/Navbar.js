import React from "react"
import ChangeBoard from "./ChangeBoard"
import Settings from "./Settings"
import AllGamesPlayed from "./AllGamesPlayed"

export default function Navbar(props) {
    const [itemOpen, setItemOpen] = React.useState("")

    function toggleShow(name) {
        itemOpen === name
            ? setItemOpen("")
            : setItemOpen(name)
    }

    function changeBoardProperties(boardProperties) {
       props.changeBoardProperties(boardProperties)
    }

    function changeShowMetricsData(formData) {
        props.changeShowMetricsData(formData)
    }

    function changeTileSize(newTileSize) {
        props.changeTileSize(newTileSize)
    }

    function changeNumberSize(newNumberSize) {
        props.changeNumberSize(newNumberSize)
    }

    function retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time, 
        threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, wastedLeftClicks, 
        wastedRightClicks, wastedChords, id) {
        props.retrieveGameData(newBoard, difficulty, height, width, mines, correctFlags, time,
            threeBV, current3BV, usefulLeftClicks, usefulRightClicks, usefulChords, 
            wastedLeftClicks, wastedRightClicks, wastedChords, id)
    }

    const styles = {
        borderBottom: itemOpen
            ? "2px solid black"
            : "none"
    }
    return (
        <nav className="navbar--container" style={styles}>
            <div className="navbar--title">
                <span>Minesweeper</span>
                <button onClick={() => toggleShow("changeBoard")} className="navbar--button">
                    Change Board
                </button>
                <button onClick={() => toggleShow("settings")} className="navbar--button">
                    Settings
                </button>
                <button onClick={() => toggleShow("allGamesPlayed")} className="navbar--button">
                    All Games
                </button>
            </div>
            {itemOpen &&
            <div className="navbar--item">
            {itemOpen === "changeBoard" && 
            <ChangeBoard 
                changeBoardProperties={changeBoardProperties}
                boardProperties={props.boardProperties}
            />}
            {itemOpen === "settings" && 
            <Settings 
                changeShowMetricsData={changeShowMetricsData}
                changeTileSize={changeTileSize}
                changeNumberSize={changeNumberSize}
            />
            }
            {itemOpen === "allGamesPlayed" &&
            <AllGamesPlayed 
                showMetricsData={props.showMetricsData}
                retrieveGameData={retrieveGameData}
                selectedGameId={props.selectedGameId}
            />}
            </div>}
        </nav>
    )
}
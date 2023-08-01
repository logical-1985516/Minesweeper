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

    function changeBoardProperties(height, width, mines) {
       props.changeBoardProperties(height, width, mines)
    }

    function changeShowMetricsData(formData) {
        props.changeShowMetricsData(formData)
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
            />}
            {itemOpen === "settings" && 
            <Settings 
                changeShowMetricsData={changeShowMetricsData}
            />
            }
            {itemOpen === "allGamesPlayed" &&
            <AllGamesPlayed 
                showMetricsData={props.showMetricsData}
            />}
            </div>}
        </nav>
    )
}
import React from "react"
import ChangeBoard from "./ChangeBoard"
import Settings from "./Settings"

export default function Navbar(props) {
    const [itemOpen, setItemOpen] = React.useState("")

    function toggleShowChangeBoard() {
        itemOpen === "changeBoard"
            ? setItemOpen("")
            : setItemOpen("changeBoard")
    }

    function changeBoardProperties(height, width, mines) {
       props.changeBoardProperties(height, width, mines)
    }

    function changeShowMetricsData(formData) {
        props.changeShowMetricsData(formData)
    }

    function toggleShowSettings() {
        itemOpen === "settings"
            ? setItemOpen("")
            : setItemOpen("settings")
    }
    return (
        <nav className="navbar--container">
            <div className="navbar--title">
                <span>Minesweeper</span>
                <button onClick={toggleShowChangeBoard} className="navbar--button">
                    Change Board
                </button>
                <button onClick={toggleShowSettings} className="navbar--button">
                    Settings
                </button>
            </div>
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
            </div>
        </nav>
    )
}
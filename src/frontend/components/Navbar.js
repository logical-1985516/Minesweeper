import React from "react"
import ChangeBoard from "./ChangeBoard"
import Settings from "./Settings"
import AllGamesPlayed from "./AllGamesPlayed"
import NavbarButton from "./NavbarButton"
import Authentication from "./Authentication"
import UserStatistics from "./UserStatistics"

export default function Navbar(props) {
    const [userData, setUserData] = React.useState(props.userData)
    const [itemOpen, setItemOpen] = React.useState("")
    const [userStatistics, setUserStatistics] = React.useState(null)

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

    function changeUserData(newUserData) {
        setUserData(newUserData)
    }
    
    async function retrieveUserStatistics() {
        const response = await fetch(`http://localhost:8000/user_statistics/${userData.username}`)
        const data = await response.json()
        console.log(data)
        setUserStatistics(data)
    }

    const styles = {
        borderBottom: itemOpen
            ? "2px solid black"
            : "none"
    }
    return (
        <nav className="navbar--container" style={styles}>
            <div className="navbar--title">
                <div className="navbar--title-left">
                    <span>Minesweeper</span>
                    <NavbarButton label="Change Board" isActive={itemOpen === "changeBoard"} 
                        onClick={() => toggleShow("changeBoard")} />
                    <NavbarButton label="Settings" isActive={itemOpen === "settings"} 
                        onClick={() => toggleShow("settings")} />
                    <NavbarButton label="All Games" isActive={itemOpen === "allGamesPlayed"} 
                        onClick={() => toggleShow("allGamesPlayed")} />
                    <NavbarButton label="User Statistics" isActive={itemOpen === "userStatistics"} 
                        onClick={() => {
                            if (userData.username && itemOpen !== "userStatistics") {
                                retrieveUserStatistics()
                            }
                            toggleShow("userStatistics")
                        }} />
                    <NavbarButton label="Close" 
                        onClick={() => toggleShow("")} />
                </div>
                <div className="navbar--title-right">
                    <NavbarButton label={userData.username} />
                    <NavbarButton label={userData.username ? "Log out" : "Sign up/Log in"}
                        isActive={itemOpen === "authentication"} 
                        onClick={userData.username ? () => {setUserData({username: "", password: ""})
                            localStorage.setItem("userData", JSON.stringify({username: "", password: ""}))
                            setItemOpen("")} : 
                            () => toggleShow("authentication")} />
                </div>
            </div>
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
            />}
            {itemOpen === "allGamesPlayed" &&
            <AllGamesPlayed 
                showMetricsData={props.showMetricsData}
                retrieveGameData={retrieveGameData}
                selectedGameId={props.selectedGameId}
            />}
            {itemOpen === "authentication" &&
            <Authentication 
                changeUserData={changeUserData}
                userData={userData}
                changeItemOpen={setItemOpen}
            />}
            {itemOpen === "userStatistics" &&
            <UserStatistics 
                userData={userData}
                userStatistics={userStatistics}
            />}
            </div>
        </nav>
    )
}
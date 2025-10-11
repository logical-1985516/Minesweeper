import React from "react"

export default function Authentication(props) {
    const [isSignUp, setIsSignUp] = React.useState(false)
    const [usernameError, setUsernameError] = React.useState("")
    const [passwordError, setPasswordError] = React.useState("")
    const [userData, setUserData] = React.useState(props.userData || {
        username: "",
        password: ""
    })

    function handleChange(event) {
        const {name, value} = event.target
        setUserData(oldUserData => {
            return {...oldUserData, [name]: value}
        })
    }

    function handleSubmit(event) {
        event.preventDefault()
        validateFormData(userData)
    }

    function validateFormData(data) {
        setUserData({
            username: "",
            password: ""
        })
        let hasError = false
        if (data.username.length < 3) {
            setUsernameError("Username must be at least 3 characters long.")
            hasError = true
        }
        if (data.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.")
            hasError = true
        }
        if (hasError) {
            return
        }
        setUserData(data)
        props.changeUserData(data)
        props.changeItemOpen("")
        setUsernameError("")
        setPasswordError("")
    }

    React.useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData))
    }, [userData])

    return (
        <div className="login--container">
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit} className="login--form">
                <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" onChange={handleChange} required />
                    {usernameError && <span className="error">{usernameError}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" onChange={handleChange} required />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
            </form>
            <div onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </div>
        </div>
    );
}
import React from "react"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

export default function Authentication(props) {
    const [isSignUp, setIsSignUp] = React.useState(false)
    const [usernameError, setUsernameError] = React.useState("")
    const [emailError, setEmailError] = React.useState("")
    const [passwordError, setPasswordError] = React.useState("")
    const [userData, setUserData] = React.useState(props.userData || null)

    function handleChange(event) {
        const {name, value} = event.target
        setUserData(oldUserData => {
            return {...oldUserData, [name]: value}
        })
    }

    async function handleSubmit(event) {
        setUsernameError("")
        setEmailError("")
        setPasswordError("")
        event.preventDefault()
        let data = userData
        // console.log(data)
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, data.email, data.password)
            } else {
                await signInWithEmailAndPassword(auth, data.email, data.password)
            }
        } catch (error) {
            const errorCode = error.code
            const errorMessage = error.message
            if (errorCode === 'auth/email-already-in-use') {
                setEmailError("Email is already in use.")
            } else if (errorCode === 'auth/weak-password') {
                setPasswordError("Password must have at least 6 characters.")
            } else if (errorCode === 'auth/user-not-found') {
                setEmailError("User not found.")
            } else if (errorCode === 'auth/wrong-password') {
                setPasswordError("Invalid password.")
            } else if (errorCode === 'auth/too-many-requests') {
                setEmailError("Too many unsuccessful login attempts. Please try again later.")
            } else if (errorCode === 'auth/network-request-failed') {
                setEmailError("Network error. Please try again.")
            } else {
                setEmailError("An unknown error occurred. Please try again.")
            }
            console.error("Error code:", errorCode, "Error message:", errorMessage)
            // console.log(data.email)
            // console.log(data.password)
            return
        }
        setUserData(data)
        props.changeUserData(data)
        props.changeItemOpen("")
        setUsernameError("")
        setEmailError("")
        setPasswordError("")
    }

    // function validateFormData(data) {
    //     setUserData({
    //         username: "",
    //         password: ""
    //     })
    //     let hasError = false
    //     if (data.username.length < 3) {
    //         setUsernameError("Username must be at least 3 characters long.")
    //         hasError = true
    //     }
    //     if (data.password.length < 6) {
    //         setPasswordError("Password must be at least 6 characters long.")
    //         hasError = true
    //     }
    //     if (hasError) {
    //         return
    //     }
    //     setUserData(data)
    //     props.changeUserData(data)
    //     props.changeItemOpen("")
    //     setUsernameError("")
    //     setPasswordError("")
    // }

    React.useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData))
    }, [userData])

    return (
        <div className="login--container">
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            <div className="login--form">
                {isSignUp && <div>
                    <label htmlFor="username">Username: </label>
                    <input type="text" id="username" name="username" onChange={handleChange} required />
                    {usernameError && <span className="error">{usernameError}</span>}
                </div>}
                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" name="email" onChange={handleChange} required />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password" id="password" name="password" onChange={handleChange} required />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <button type="button" onClick={handleSubmit}>{isSignUp ? "Sign Up" : "Login"}</button>
            </div>
            <div onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </div>
        </div>
    );
}
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './signin.css'

function SignInUp() {
    const navigate = useNavigate()
    const signUpnameRef = useRef()
    const signUpasswordRef = useRef()
    const signInnameRef = useRef()
    const signInpasswordRef = useRef()
    const [signIn, setSignIn] = useState(true);


    const signinclkd = (event) => {
     event.preventDefault();
        const userInfo = {
            username: signInnameRef.current.value,
            password: signInpasswordRef.current.value
        }
        localStorage.setItem('username', userInfo.username)

        const login = async () => {
            const res = await fetch('https://travel-guide-backend-pfri.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInfo)
            })
            const data = await res.json()
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Logged in successfully!')
                navigate('/')
            } else {
                alert(data.message);
            }
        }
        login()
        
    }
    const signupclkd = (event) => {
      event.preventDefault();
      const userInfo = {
          username: signUpnameRef.current.value,
          password: signUpasswordRef.current.value
      }
      console.log(userInfo,'userinfo');
      
      localStorage.setItem('username', userInfo.username);

      const signup = async () => {
          const res = await fetch('https://travel-guide-backend-pfri.onrender.com/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userInfo)
          })
          const data = await res.json()
          console.log(data, 'signup success');

          if (data.token) {
              localStorage.setItem('token', data.token);
              navigate('/')
          } else {
              alert(data.message || 'Signup failed');
          }
      }
      signup()
  }
    return (
      <div className='body-container'>
        <div className="sign-container">
        <div className={`sign-up-container ${!signIn ? 'active' : ''}`}>
          <form className="sign-form">
            <h1 className="title">Create Account</h1>
            <input className="sign-input" type="text" placeholder="Name" ref={signUpnameRef} />
            <input className="sign-input" type="email" placeholder="Email" />
            <input className="sign-input" type="password" placeholder="Password" ref={signUpasswordRef} />
            <button className="button" onClick={signupclkd}>Sign Up</button>
          </form>
        </div>
  
        <div className={`sign-in-container ${signIn ? 'active' : ''}`}>
          <form className="sign-form">
            <h1 className="title">Sign in</h1>
            <input className="sign-input" type="text" placeholder="Username" ref={signInnameRef} />
            <input className="sign-input" type="password" placeholder="Password" ref={signInpasswordRef} />
            <button className="button" onClick={signinclkd }>Sign In</button>
          </form>
        </div>
  
        <div className={`overlay-container ${!signIn ? 'move-left' : ''}`}>
          <div className={`overlay ${!signIn ? 'move-right' : ''}`}>
            <div className={`overlay-panel left-panel ${signIn ? 'active' : ''}`}>
              <h1 className="title">Welcome Back!</h1>
              <p className="paragraph">
                To keep connected with us please login with your personal info
              </p>
              <button className="button ghost" onClick={() => setSignIn(true)}>Sign In</button>
            </div>
  
            <div className={`overlay-panel right-panel ${!signIn ? 'active' : ''}`}>
              <h1 className="title">Hello, Friend!</h1>
              <p className="paragraph">
                Enter Your personal details and start journey with us
              </p>
              <button className="button ghost" onClick={() => setSignIn(false)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
}

export default SignInUp

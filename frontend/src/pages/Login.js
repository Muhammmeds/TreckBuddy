import './Login.css'
const Login = () =>{
    return(
        
        <div className="container3">
            <div className="container4">
                <p className='header'>Login</p>
                <p>Enter your account details</p>
                <input type="text" placeholder="Username" /> <br></br>
                <input type="password" placeholder="Password"  /> <br></br>
                <button>Login</button>
            </div>
        </div>
    
    )
}
export default Login
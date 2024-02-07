import './Signup.css'

const Signup = () =>{
    return(
        <div className="container1">
            <div className="container2">
                <p className='header'>Sign Up</p>
                <p>Enter your account details</p>
                <input type="text" placeholder="Username" /> <br></br>
                <input type="number" placeholder="Age" /> <br></br>
                <div className='select'>
                <label>Gender:</label>
                <select>
                    <option selected disabled></option>
                    <option value='Male'>Male</option>
                    <option value = 'Female'>Female</option>
                    <option value='Non-Binary'>Non-Binary</option>
                </select>
                </div>
                <input type="password" placeholder="Password" /> <br></br>
                <p className='already'>Already have an account? <a href='/login'>Login</a></p>
                <button>Get Started</button>
            </div>
        </div>
    )
}
export default Signup
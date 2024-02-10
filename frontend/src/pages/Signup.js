import './Signup.css'
import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'


const Signup = () =>{
    const [username , setUsername] = useState('')
    const [age , setAge] = useState('')
    const [gender , setGender] = useState('')
    const [password , setPassword] = useState('') 
    const [error , setError] = useState(false)

    const navigate = useNavigate()

    const Submit = (e) =>{
        e.preventDefault()
        axios.post("/api/signup" , {
            username : username,
            age : age,
            gender : gender,
            password : password,
        })
        .then((response)=>{
            console.log(response)
            navigate('/signupconfirmed')
        })
        .catch((error)=>{
            console.log(error.response.data)
            setError(error.response.data)

        })
    }

    return(
        <div className="container1">
            <div className="container2">
                <p className='header'>Sign Up</p>
                <p>Enter your account details</p>
                <input type="text" placeholder="Username" value={username} onChange={(e)=>{setUsername(e.target.value)}} /> <br></br>
                <input type="number" placeholder="Age" value={age} onChange={(e)=>{setAge(e.target.value)}} /> <br></br>
                <div className='select'>
                <label>Gender:</label>
                <select value={gender} onChange={(e)=>{setGender(e.target.value)}}>
                    <option selected disabled></option>
                    <option value='Male'>Male</option>
                    <option value = 'Female'>Female</option>
                    <option value='Non-Binary'>Non-Binary</option>
                </select>
                </div>
                <input type="password" value={password} placeholder="Create Password" onChange={(e)=>{setPassword(e.target.value)}} /> <br></br>
                <p className='already'>Already have an account? <a href='/login'>Login</a></p>
                {error && <p className='error'>{error}</p>}
                <button onClick={Submit}>Get Started</button>
            </div>
        </div>
    )
}
export default Signup
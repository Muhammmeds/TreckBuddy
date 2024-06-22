import './Login.css'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const Login = () =>{
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const [error , setError] = useState(null)


    const navigate = useNavigate()

    
    const Submit = (e) =>{


        e.preventDefault()
        axios.post('/api/login' , {
            username : username,
            password : password
        })
        .then((response)=>{
            console.log(response.data)
            let token = response.data[1]
            let userid = response.data[2]
            localStorage.setItem('token', token)
            localStorage.setItem('userid', userid)
            console.log('good' , localStorage.getItem('token'))

            navigate(`/userdata/${userid}`)    
        })
        .catch((error)=>{
            console.log(error.response)
            setError(error.response.data)
        })
    }

    return(
        
        <div className="container3">
            <div className="container4">
                <p className='header'>Login</p>
                <p>Enter your account details</p>
                <input type="text" placeholder="Username" value={username} onChange={(e)=>{setUsername(e.target.value)}} /> <br></br>
                <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  /> <br></br>
                {error && <p className='error'>{error}</p>}
                <button onClick={Submit}>Login</button>
            </div>
        </div>
    
    )
}
export default Login
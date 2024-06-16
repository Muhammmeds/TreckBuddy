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
    const [image , setImage] = useState('')

    const navigate = useNavigate()

    const Submit = (e) =>{
        console.log(image)
        e.preventDefault()
        axios.post("/api/signup" , {
            username : username,
            age : age,
            gender : gender,
            password : password,
            image : image,
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

    const convertImageToBase64 = (e) =>{
        console.log(e)
        console.log(e.target.files)
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            console.log(reader.result)
            setImage(reader.result)
        }
        reader.onerror = (err) =>{
            console.log(err)
        }
    }

    return(
        <div className="container1">
            <div className="container2">
                <p className='header'>Sign Up</p>
                <p>Enter your account details</p>
                <input type="text" placeholder="Username" value={username} onChange={(e)=>{setUsername(e.target.value)}} /> <br></br>
                <input type="number" placeholder="Age" value={age}  onChange={(e)=>{setAge(e.target.value)}} /> <br></br>
                <div className='select'>
                <label>Gender:</label>
                <select value={gender} onChange={(e)=>{setGender(e.target.value)}}>
                    <option selected disabled></option>
                    <option value='Male'>Male</option>
                    <option value = 'Female'>Female</option>
                    <option value='Non-Binary'>Non-Binary</option>
                </select>

                </div>
                <div className='file'>
                <label>Photo:</label>
                <input type='file' accept="image/*" onChange={convertImageToBase64} />
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
import {useParams} from 'react-router-dom' 
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'


const Profile = () =>{
    const [user , setUser] = useState(null)

    const {id} = useParams()


    useEffect(()=>{

        const token = localStorage.getItem('token')

        axios.get(`/api/profile/${id}` , {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then((response)=>{
            setUser(response.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }, [id])

    return(
        <>
        { user && 
        <>
        <Navbar/>
        <p>{user.username}</p>
        <p>{user.age}</p>
        <p>{user.gender}</p>


        </>
        }
        </>
    )
}

export default Profile;
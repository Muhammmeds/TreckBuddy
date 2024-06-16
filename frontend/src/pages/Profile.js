import {useParams} from 'react-router-dom' 
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'


const Profile = () =>{
    const [user , setUser] = useState(null)

    const {id} = useParams()
    const userid = localStorage.getItem('userid')


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
        <div>
        <img  alt='' width={300} height={300} src={user.image} />
        </div>
        {userid === id ? <p>Can be edited</p> : <><p>Cannot be edited</p></>}
        <p>{user.username}</p>
        <p>{user.age}</p>
        <p>{user.gender}</p>


        </>
        }
        </>
    )
}

export default Profile;
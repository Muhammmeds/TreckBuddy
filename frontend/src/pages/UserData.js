import './UserData.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPlus , faShareFromSquare,faUsers , faMessage , faLocationDot , faTrash , faClock , faPersonWalking  } from "@fortawesome/free-solid-svg-icons";



const UserData = () =>{
    const [user , setUser] = useState(null)
    const [journey , setJourney] = useState([])
    const [to , setTo] = useState('')
    const [leavingtime , setLeavingTime] = useState('')
    const [note , setNote] = useState('')
    const [error , setError] = useState('')
    const [createjourney , setCreateJourney] = useState(false)


    const navigate = useNavigate()

    const Logout = (e) =>{
        e.preventDefault()
        localStorage.clear('token')
        navigate('/')

    }


    useEffect(()=>{
        let token = localStorage.getItem('token')

        axios.get('/api/users', {headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setUser(response.data)

        })
        .catch((error)=>{
            console.log(error)
        })
        axios.get('/api/alljourney', {headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setJourney(response.data)
            
        })
        .catch((error)=>{
            console.log(error)
        })

    },[])




    const createJourney = (e) =>{
        let token = localStorage.getItem('token')

        e.preventDefault()
        axios.post('/api/journey', {to,leavingtime , note},{headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setJourney(response.data)
            setTo('')
            setLeavingTime('')
            setNote('')
            setError('')
        })
        .catch((error)=>{
            console.log(error.response)
            setError(error.response.data)
        })
    }


    const peoplejoined = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/peoplejoined/${id}`,{} ,{headers : {
            Authorization : `Bearer ${token}`,
        }})
        .then((response)=>{
            setJourney(response.data)

        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data)

        })
        
        
    }

    const leavejourney = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/leavejourney/${id}`,{} ,{headers : {
            Authorization : `Bearer ${token}`,
        }})
        .then((response)=>{
            setJourney(response.data)

        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data)

        })

    }

    const showjourney = () =>{
        if(!createjourney){
            setCreateJourney(true)
        }else{
            setCreateJourney(false)

        }
    }

    const deleteJourney = (id) =>{
        let token = localStorage.getItem('token')


        axios.delete(`/api/journey/${id}`, {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then((response)=>{
            setJourney(response.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <>
        <div className='top'>
        <div className='top2'>
            <FontAwesomeIcon className='user' icon={faUser}/>
            <p>Hi , {user && user.username[0].toUpperCase() + user.username.slice( 1 , user.username.length)}</p>
        </div>
        <h1>Tbuddy</h1>
        <div className='top3'>
        <FontAwesomeIcon icon={faShareFromSquare} />
        <button onClick={Logout}>Logout</button>
        </div>
        </div>


        <div className='top4'>
        <div className='sidebar'>
            <div className='slidebarinner1'>
                <p>Profile</p>
                <p onClick={showjourney}><FontAwesomeIcon icon={faPlus} className='plus' /></p>
                <p>Create Journey</p>
            </div>
            {createjourney && <div className='form'>
            <FontAwesomeIcon className='formlocationlogo'  icon={faLocationDot}/> <br></br>
                <input type='text' placeholder='to' value={to} onChange={(e)=>{setTo(e.target.value)}} /> <br></br>
                <p>leavingtime:</p>
                <input type='time' value={leavingtime} onChange={(e)=>{setLeavingTime(e.target.value)}} /> <br></br>
                <textarea value={note} onChange={(e)=>{setNote(e.target.value)}} placeholder='note'>

                </textarea> <br></br>
                <p className='error'>{error}</p>
                <button onClick={createJourney}>Create Journey</button>

            </div>}
        </div>
        <div className='top5'>
        { journey.length > 0 ? journey.map((journey, index)=>(
            
            <div key={index} className='top6'>
                <div className='location'>
                    <div  className='locationfirstcontainer'>
                        <FontAwesomeIcon className='locationlogo'  icon={faLocationDot}/>
                        <p>{journey.to}</p>
                    </div>
                    <div>
                        {user._id !== journey.userid && !journey.peoplejoined.includes(user._id) ? (<button  onClick={()=>peoplejoined(journey._id)}>Accept</button> ) :
                        (
                            user._id !== journey.userid && journey.peoplejoined.includes(user._id)) ? (<button onClick={()=>{leavejourney(journey._id)}}>Leave</button>) : <FontAwesomeIcon className='delete' onClick={()=> deleteJourney(journey._id)} icon={faTrash}  />
                        }
                    </div>
                </div>
                <div className='leavingtime'>
                    <FontAwesomeIcon className='clock' icon={faClock}/>
                    <p>{journey.leavingtime}</p>
                </div>
                <div className='info'>
                <FontAwesomeIcon className='personwalking' icon={faPersonWalking}/>
                <p>{journey.username[0].toUpperCase() + journey.username.slice( 1 , journey.username.length)} - {journey.userage} - {journey.usergender} </p>
                </div>
                <div className='note'>
                <FontAwesomeIcon icon={faMessage}/>
                <p>"{journey.note}"</p>
                </div>
                <div className='peoplejoined'>
                <FontAwesomeIcon icon={faUsers}/>
                    <p>{journey.numberofpeoplejoined}</p>
                </div>

            </div>
        )) : <p className='nojourney'>No journey available</p>}
        </div>
        </div>
        </>
    )
}
export default UserData
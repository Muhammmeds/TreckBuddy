import './UserData.css'
import axios from 'axios'
import { useEffect, useState , useRef } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPlus, faX, faPenToSquare , faFaceFrown , faShareFromSquare,faUsers , faMessage , faLocationDot , faTrash , faClock , faPersonWalking  } from "@fortawesome/free-solid-svg-icons";
import Footer from '../components/Footer'


const UserData = () =>{
    const [user , setUser] = useState(null)
    const [journey , setJourney] = useState([])
    const [to , setTo] = useState('')
    const [leavingtime , setLeavingTime] = useState('')
    const [note , setNote] = useState('')
    const [error , setError] = useState('')
    const [createjourney , setCreateJourney] = useState(false)
    const [showNote , setShowNote] = useState(true)
    const [inputValue , setInputValue] = useState('')
    const [updateButton , setUpdateButton] = useState(true)

    const inputRef = useRef(null)

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

    
    const leavesIn = (time) =>{
        let arr = time.split(':')
        let date = new Date()
        let date2 = new Date()
        date2.setHours(arr[0])
        date2.setMinutes(arr[1])
        let diff = (date2 - date) / 60000
        if(diff > 1){
            return `leaves in ${diff} minutes` 
        }else if(diff === 1){
            return 'leaves in 1 minute' 
        }
    }
    const Edit = () =>{
        inputRef.current.focus()
        inputRef.current.value = setInputValue(inputValue.concat(inputRef.current.value))
        setShowNote(false)
        setUpdateButton(false)
    }

    const handleClick = (e) =>{
        setInputValue(e.target.value)
    }

    const Cancel = () =>{
        setUpdateButton(true)
        setShowNote(true)
        setInputValue('')
    }

    const UpdateNote = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/updatenote/${id}` , { update : inputValue } , {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then((response)=>{
            setJourney(response.data)
            
        setUpdateButton(true)
        setShowNote(true)
        setInputValue('')
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }




    return(
        <>
        {user &&
        <div className='top'>
        <div className='top2'>
            <FontAwesomeIcon className='user' icon={faUser}/>
            <p>Hi , {user && user.username[0].toUpperCase() + user.username.slice( 1 , user.username.length)}</p>
        </div>
        <p className='head'>T-Buddy</p>
        <div className='top3'>
        <FontAwesomeIcon icon={faShareFromSquare} className='sharefromsquare' />
        <button onClick={Logout}>Logout</button>
        </div>
        </div>
        }

        {user && <div className='top4'>
        <div className='sidebar'>
            <div className='slidebarinner1'>
                <div>
                    <Link to = {user && `/profile/${user._id}`}>Edit Profile</Link>
                </div> <hr></hr>
                <p onClick={showjourney}><FontAwesomeIcon icon={faPlus} className='plus' /></p>
                <p className='create'>Create Journey</p>
            </div>
            { createjourney && <div className='form'>
                <div className='formcontainer1'>
                    <p className='formlocationlogo'><FontAwesomeIcon   icon={faLocationDot}/></p>
                    <input type='text' placeholder='To' value={to} onChange={(e)=>{setTo(e.target.value)}} /> <br></br>
                </div>
                <div className='formcontainer2'>
                <p>Leaving time:</p>
                <input type='time' value={leavingtime} onChange={(e)=>{setLeavingTime(e.target.value)}} /> <br></br>
                </div>
                <div className='formcontainer3'>
                <p className='messageicon'><FontAwesomeIcon  icon={faMessage}/></p>
                <textarea value={note} onChange={(e)=>{setNote(e.target.value)}} placeholder='note'>

                </textarea>
                </div> <br></br>
                <p className='error'>{error}</p>
                <div className='formcontainer4'>
                <button onClick={createJourney}>Create Journey</button>
                </div>
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
                    <p>{journey.leavingtime} , <span className='leaves'>{leavesIn(journey.leavingtime)}</span></p>
                </div>
                <div className='info'>
                <FontAwesomeIcon className='personwalking' icon={faPersonWalking}/>
                <p>{journey.username[0].toUpperCase() + journey.username.slice( 1 , journey.username.length)} - {journey.userage} - {journey.usergender} {user._id !== journey.userid ? <Link to = {`/profile/${journey.userid}`}>view profile</Link> : <></>} </p>
                </div>
                <div className='note'>
                <FontAwesomeIcon icon={faMessage}/>
                <>
                {user._id === journey.userid ? (<p><input className='noteinput' onChange={handleClick} ref={inputRef} value ={showNote ? journey.note[0].toUpperCase() + journey.note.slice( 1 , journey.note.length) : inputValue } />{updateButton ? <span onClick={()=>Edit()} className='pentosquare'><FontAwesomeIcon  icon={faPenToSquare}/></span> : <><button className='noteupdate' onClick={()=>UpdateNote(journey._id)}>update</button><span onClick={Cancel}><FontAwesomeIcon className='notecancel'   icon={faX}/></span></>}</p>) : (<p>{journey.note[0].toUpperCase() + journey.note.slice( 1 , journey.note.length)}</p>)}
                </>
                </div>
                <div className='peoplejoined'>
                <FontAwesomeIcon icon={faUsers}/>
                    <p>{journey.numberofpeoplejoined}</p>
                </div>

            </div>
        )) : <p className='nojourney'>No journey available <FontAwesomeIcon className='sadface' icon={faFaceFrown}/>        </p>}
        </div>
        </div>
        }
        {user &&
        <Footer />
        }
        </>
    )
}
export default UserData
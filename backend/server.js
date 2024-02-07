require('dotenv').config()
const express = require('express')
const Journey = require('./models/journeyModel')
const JourneyUser = require('./models/journeyUserModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()
app.use(express.json())



mongoose.connect(process.env.db)
.then(()=>{
    app.listen(process.env.PORT , ()=>{
        console.log(`server running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(err)
})


const within30Minutes = (time) => {
    let timeArr = time.split(':')
    const d = new Date()
    const d1 = new Date()
    d1.setHours(timeArr[0])
    d1.setMinutes(timeArr[1])
    let diff = (d1 - d) / 60000
    if(diff > 30){
        return false;
    }else{
        return true;
    }
}


app.get('/api/journey', (req,res)=>{
    res.status(200).json('working')
})


//create a journey
app.post('/api/journey' , async(req,res)=>{
    const {to , leavingtime , note} = req.body
    if(to == ''||leavingtime == ''||note == ''){
        res.status(400).json({message : 'all field is required'})
    }
    let result = within30Minutes(leavingtime)
    if(!result){
        res.status(400).json({message : 'leaving time must be within 30 minutes'})
    }

    const journey = await Journey.create({to,leavingtime,note})
    res.status(200).json(journey)
})


//signup
app.post('/api/signup' , async(req,res)=>{
    const {username , age , gender , password} = req.body
    try{
    if(username == ''|| age == ''|| gender == ''|| password == ''){
        res.status(400).json({message : 'all field is required'})
    }
    if(password.length < 8){
        res.status(400).json({message : 'password must not be less than 8 characters'})
    }
    const exist = await JourneyUser.findOne({username : username})
    if(exist){
        res.status(400).json({message : 'username exists already'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)

    const user = await JourneyUser.create({username , age , gender , password : hashedPassword})
    res.status(200).json(user)
    }catch(err){
        console.log(err)
    }
    

})

//login
app.post('/api/login' , async(req,res)=>{
    const {username , password} = req.body
    try{
        if(username == "" || password == ''){
            res.status(400).json({message : 'all field is required'})
        }

        const user = await JourneyUser.findOne({username : username})

        if(!user){
            res.status(400).json({message : 'invalid credentials'})
        }
        const match = await bcrypt.compare(password , user.password)
        if(!match){
            res.status(400).json({message : 'password incorrect'})
        }
        res.status(200).json(`${user.username} is logged in and is ${user.age} years old`)
    }
    catch(err){
        console.log(err)
    }
})
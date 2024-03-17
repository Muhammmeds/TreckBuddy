require('dotenv').config()
const express = require('express')
const Journey = require('./models/journeyModel')
const JourneyUser = require('./models/journeyUserModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const protect = require('./authentication')


const app = express()
app.use(express.json())


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.SECRET_KEY , {expiresIn : '30d'})
}


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
    if(diff > 30 || diff < 0){
        return false;
    }else{
        return true;
    }
}

//get all journey
app.get('/api/alljourney',protect, async (req,res)=>{
    const userid = req.user.id


    const userJourney = await Journey.findOne({userid})
    const journeys = await Journey.find().sort({createdAt : -1})


    for( i = 0;i<journeys.length ; i++){
        let arr = journeys[i].leavingtime.split(':')
        let date = new Date()
        let date2 = new Date()
        date2.setHours(arr[0])
        date2.setMinutes(arr[1])
        let diff = (date2 - date) / 60000
        if(diff < 1){
            let arr2 = journeys[i].peoplejoined
            if(arr2.length > 0){
                for(j=0;j<arr2.length;j++){
                    let update = await JourneyUser.findByIdAndUpdate(arr2[j] , {$set : {acceptedajourney : false}} )
                }
            }
            let update2 = await Journey.findByIdAndDelete(journeys[i]._id)
        }
        
    }
    if(userJourney){
        journeys.splice(0 , 0 , userJourney)
        let lastIndex = journeys.map(JSON.stringify).lastIndexOf(JSON.stringify(userJourney));
        journeys.splice(lastIndex , 1)
    }
    res.status(200).json(journeys)
})

//get a user
app.get('/api/users', protect , async (req,res)=>{
    let user = req.user
    res.status(200).json(user)
})

//get user profile
app.get('/api/profile/:id' , protect , async(req,res)=>{
    const {id} = req.params
    const profile = await JourneyUser.findById(id)
    res.status(200).json(profile)
})

//get each user all journey
app.get('/api/eachuserjourney',protect, async (req,res)=>{
    const id = req.user.id
    const journey = await Journey.findOne({userid : id})
    res.status(200).json(journey)
})

//update note
app.patch('/api/updatenote/:id' , protect , async (req,res)=>{
    let userid = req.user.id
    let id = req.params.id
    const {update} = req.body

    const update2 = await Journey.findByIdAndUpdate(id , {$set : {note : update}})
    const journeys = await Journey.find().sort({createdAt : -1})
    const userJourney = await Journey.findOne({userid})

    
    if(userJourney){
        journeys.splice(0 , 0 , userJourney)
        let lastIndex = journeys.map(JSON.stringify).lastIndexOf(JSON.stringify(userJourney));
        journeys.splice(lastIndex , 1)
    }
    res.status(200).json(journeys)
})

// people joined
app.patch('/api/peoplejoined/:id', protect , async (req,res)=>{
    const userid = req.user.id
    const id = req.params.id


    const journey = await Journey.findById(id)
    const userJourney = await Journey.findOne({userid})
    const user = await JourneyUser.findById(userid)

    if(journey.peoplejoined.includes(userid) || user.acceptedajourney || userJourney){
        res.status(400).json('A journey has been joined or created')
    }
    else{
    const update = await Journey.findByIdAndUpdate(id , {$push : {peoplejoined : userid}}, {new : true})
    let number = update.peoplejoined.length
    const update2 = await Journey.findByIdAndUpdate(id , {$set : {numberofpeoplejoined : number }}, {new : true})
    const update3 = await JourneyUser.findByIdAndUpdate(userid , {$set : {acceptedajourney : true}}, {new : true})
    const journeys = await Journey.find().sort({createdAt : -1})
    res.status(200).json(journeys)
}})

//leave a journey
app.patch('/api/leavejourney/:id', protect , async(req,res)=>{
    const id = req.params.id
    const userid = req.user.id

    const user = await JourneyUser.findById(userid)
    const journey = await Journey.findById(id)
    const update = await Journey.findByIdAndUpdate(id , {$pull : {peoplejoined : userid}},{new : true})
    let number = update.peoplejoined.length
    const update2 = await Journey.findByIdAndUpdate(id , {$set : {numberofpeoplejoined : number }},{new : true})
    const update3 = await JourneyUser.findByIdAndUpdate(userid , {$set : {acceptedajourney : false}}, {new : true})
    const journeys = await Journey.find().sort({createdAt : -1})
    res.status(200).json(journeys)
})

//delete a journey
app.delete('/api/journey/:id', protect , async (req,res)=>{

    const id = req.params.id

    const journey = await Journey.findById(id)
    if(!journey){
        const journeys = await Journey.find().sort({createdAt : -1})
        res.status(200).json(journeys) 
    }else{
        let arr = journey.peoplejoined
        
         if(arr.length > 0){
        for(let i = 0;i<arr.length;i++){
            const update = await JourneyUser.findByIdAndUpdate(arr[i] , {$set : {acceptedajourney : false}})
        }
        }
        const deletejourney = await Journey.findByIdAndDelete(id)
        const journeys = await Journey.find().sort({createdAt : -1})
        res.status(200).json(journeys)
    }
    
})


//create a journey
app.post('/api/journey', protect , async(req,res)=>{
    const username = req.user.username
    const id = req.user.id
    const age = req.user.age
    const gender = req.user.gender

    const user = await JourneyUser.findById(id)
    const exist = await Journey.findOne({userid : id})

    if(exist || user.acceptedajourney){
        res.status(400).json('You have an existing journey')
    }else{
        const {to , leavingtime , note} = req.body
        if(to == ''||leavingtime == ''||note == ''){
            res.status(400).json('All field is required')
        }else{
            let result = within30Minutes(leavingtime)
            if(!result){
                res.status(400).json('Leaving time must be within the next 30 minutes')
            }else{
                
                const journey = await Journey.create({to,leavingtime,note , userid : id , username : username , userage : age , usergender : gender , peoplejoined : [] , numberofpeoplejoined : 0})
                const journeys = await Journey.find().sort({createdAt : -1})
                res.status(200).json(journeys)
            }
        }
    }
    
    
    

})


//signup
app.post('/api/signup' , async (req, res) => {
    const { username, age, gender, password } = req.body;

    if (username == '' || age == '' || gender == '' || password == '') {
        res.status(400).json('All field is required!');
    }else if(password.length < 8){
        res.status(400).json('password must not be less than 8 characters!');
    }else{
        const exist = await JourneyUser.findOne({ username: username });
        if (exist) {
            res.status(400).json('username exists already!');
        }else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await JourneyUser.create({ username, age, gender, password: hashedPassword , acceptedajourney : false});
            res.status(200).json(user);
        }
    }
});



//login
app.post('/api/login' , async(req,res)=>{
    const array = []
    const {username , password} = req.body
    
    if(username == "" || password == ''){
            res.status(400).json('All field is required!!')
        }else{
            const user = await JourneyUser.findOne({username : username})
            if(!user){
                res.status(400).json('Invalid credentials!!')
            }else{
                const match = await bcrypt.compare(password , user.password)
                
                if(!match){
                res.status(400).json('Password incorrect!!')
            }else{
                const token = generateToken(user._id)
                array.push(user.username)
                array.push(token)
                res.status(200).json(array)
            }
            }
        }
    
})
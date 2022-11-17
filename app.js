const express = require('express');
const app = express();
const path = require('path');
const Player = require ('./models/players')
const Team = require ('./models/team')
const mongoose = require('mongoose');
const methodOver = require('method-override');
const ejsMate = require ('ejs-mate')

mongoose.connect('mongodb://localhost:27017/imageIPL')
.then(()=>{
    console.log('Mongo Connection Open!!')
}).catch(err =>{
    console.log("Oh no Mongo Error!!")
    console.log(err)
})

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOver('_method'))

//team Route

app.get('/teamlist', async (req, res)=> {
    const findTeam = await Team.find({})
    res.render('teamlist/index', {findTeam})
    //res.render('teamlist/index')
})

app.get('/teamlist/new', async (req, res)=> {
    res.render('teamlist/new')
})

app.post('/teamlist', async (req,res)=>{
    //console.log(req.body)
    const newTeam = await new Team(req.body);
   console.log(newTeam);
//    res.send(newTeam);
   await newTeam.save();
   res.redirect('/teamlist')
})

app.get('/teamlist/:id', async (req,res)=>{
    const {id} = req.params;
    const idTeam = await Team.findById(id).populate('player');
    res.render('teamlist/show', {idTeam})
})

app.get('/teamlist/:id/member/new', async (req,res)=>{
    const {id} = req.params;
    const findIdteamp = await Team.findById(id);
    res.render('member/new', {findIdteamp})
})

app.post('/teamlist/:id/member', async (req, res)=>{
    const {id} = req.params;
    //console.log(id);
     const findIdteamp = await Team.findById(id);
    // console.log(findIdteamp)
   const {name, img, age, country, category } = req.body;
    const teamPlayer = new Player({name, img,  age, country, category } );
    findIdteamp.player.push(teamPlayer);
    teamPlayer.team = findIdteamp;
    //  console.log(teamPlayer.team)
    //  res.send(findIdteamp);
    await  findIdteamp.save();
    await  teamPlayer.save();
     res.redirect(`/teamlist/${id}`);
})

app.get('/teamlist/:id/edit', async(req, res) =>{
    const {id} = req.params;
    const editTeamlist = await Team.findById(id);
    // console.log(i);
    // res.send(i)
     res.render('teamlist/edit', {editTeamlist})
})

app.put('/teamlist/:id', async(req, res) =>{
    const {id} = req.params;
    const updateTeam = await Team.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    //console.log(j)
    res.redirect(`/teamlist/${updateTeam._id}`)
    // console.log(req.body)
    // res.send ('Put..')
})

app.delete('/teamlist/:id', async(req, res) =>{
    // res.send('DELETED')
     // const {id} = req.params;
      const deleteteamlist = await Team.findByIdAndDelete(req.params.id);
      res.redirect('/teamlist');
 })



//Players Route

app.get('/member', async (req, res)=> {
    const findPlayer = await Player.find({})
    res.render('member/index', {findPlayer})
})

app.get('/member/new', async (req, res)=> {
    res.render('member/new')
})

app.post('/member', async (req,res)=>{
    console.log(req.body)
     const newPlayer = await new Player(req.body);
    console.log(newPlayer);
   // res.send(newPlayer);
     await newPlayer.save();
     res.redirect('/member')
})

app.get('/member/:id', async (req,res)=>{
    const {id} = req.params;
    const idPlayer = await Player.findById(id).populate('team', 'name');
    res.render('member/show', {idPlayer})
})

app.get('/member/:id/edit', async(req, res) =>{
    const {id} = req.params;
    const editPlayerlist = await Player.findById(id);
    // console.log(i);
    // res.send(i)
     res.render('member/edit', {editPlayerlist})
})

app.put('/member/:id', async(req, res) =>{
    const {id} = req.params;
    const updatePlayer = await Player.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    //console.log(j)
    res.redirect(`/member/${updatePlayer._id}`)
    // console.log(req.body)
    // res.send ('Put..')
})



app.listen(3055, ()=>{
    console.log('App is listening on port 3055')
})

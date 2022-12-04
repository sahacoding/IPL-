const express = require ('express');
const router = express.Router();
const Player = require ('../models/players')
const Team = require ('../models/team')
const catchAsync = require ('../utils/catchAsync');
const ExpressError = require ('../utils/ExpressError');
const {isLoggedIn, validateTeam, validatePlyr} = require('../middleware');



router.get('/', catchAsync(async (req, res)=> {
    const findTeam = await Team.find({})
    res.render('teamlist/index', {findTeam})
    //res.render('teamlist/index')
}))

router.get('/new', isLoggedIn,  (req, res)=> {
    res.render('teamlist/new')
})

router.post('/', isLoggedIn, validateTeam,  catchAsync(async (req,res)=>{
    //console.log(req.body)
    const newTeam = await new Team(req.body);
  // console.log("tm is", newTeam);
//    res.send(newTeam);
   await newTeam.save();
   req.flash('success', 'Successfully made a new Teamlist')
   res.redirect('/teamlist')
}))

router.get('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const idTeam = await Team.findById(id).populate('player');
    res.render('teamlist/show', {idTeam})
}))

router.get('/:id/member/new', isLoggedIn, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const findIdteamp = await Team.findById(id);
    res.render('member/new', {findIdteamp})
}))

router.post('/:id/member', isLoggedIn, validatePlyr,  catchAsync(async (req, res)=>{
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
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) =>{
    const {id} = req.params;
    const editTeamlist = await Team.findById(id);
    // console.log(i);
    // res.send(i)
     res.render('teamlist/edit', {editTeamlist})
}))

router.put('/:id', isLoggedIn, validateTeam,  catchAsync(async(req, res) =>{
    const {id} = req.params;
   // console.log('body is', req.body)
    //const updateTeam = await Team.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    const updateTeam = await Team.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    //console.log('isss', updateTeam )
   
    req.flash('success', 'Successfully Update new Teamlist')
    res.redirect(`/teamlist/${updateTeam._id}`)
    // console.log(req.body)
    // res.send ('Put..')
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) =>{
    // res.send('DELETED')
     // const {id} = req.params;
      const deleteteamlist = await Team.findByIdAndDelete(req.params.id);
      req.flash('success', 'Successfully Deleted the Teamlist')
      res.redirect('/teamlist');
 }))

 module.exports = router;

const express = require ('express');
const router = express.Router();
const Player = require ('../models/players')
const Team = require ('../models/team')
const catchAsync = require ('../utils/catchAsync');
const ExpressError = require ('../utils/ExpressError');
const {isLoggedIn, validateCampground, validatePlyr} = require('../middleware');


//Players Route

router.get('/', catchAsync(async (req, res)=> {
    const findPlayer = await Player.find({})
    res.render('member/index', {findPlayer})
}))

router.get('/new', isLoggedIn, async (req, res)=> {
    res.render('member/new')
})

router.post('/', isLoggedIn,  validatePlyr,  catchAsync(async (req,res)=>{
   // console.log(req.body)
     const newPlayer = await new Player(req.body);
    console.log(newPlayer);
   // res.send(newPlayer);
     await newPlayer.save();
     req.flash('success', 'Successfully made a new Player')
     res.redirect('/member')
}))

router.get('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const idPlayer = await Player.findById(id).populate('team', 'name');
    res.render('member/show', {idPlayer})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) =>{
    const {id} = req.params;
    const editPlayerlist = await Player.findById(id);
    // console.log(i);
    // res.send(i)
     res.render('member/edit', {editPlayerlist})
}))

router.put('/:id', isLoggedIn, validatePlyr,  catchAsync(async(req, res) =>{
    const {id} = req.params;
    const updatePlayer = await Player.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    //console.log(j)
    req.flash('success', 'Successfully Update new Player')
    res.redirect(`/member/${updatePlayer._id}`)
    // console.log(req.body)
    // res.send ('Put..')
}))

module.exports = router;

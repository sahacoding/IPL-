const mongoose = require('mongoose');
const Player = require ('./players');
const {Schema} = mongoose;
const  teamSchema = new Schema({
    name:{
        type: String,
        require: true
    },
  image:{
        type: String,
        require: true
  },
    state: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    player:[ {
        type: Schema.Types.ObjectId,
       ref: 'Player'
 }]
})


teamSchema.post('findOneAndDelete', async(data)=>{
 if(data.player.length){
    const res = await Player.deleteMany({_id: {$in : data.player}})
      console.log(res);
 }
    
})

const Team = mongoose.model('Team', teamSchema)
module.exports = Team;
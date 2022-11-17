const mongoose = require ('mongoose');
const {Schema} = mongoose;
const playerSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    img:{
        type: String,
        require: true
  },
    age: {
        type: Number,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['batsman', 'bowler', 'wk', 'allrounder']
    },
    team: {
           type: Schema.Types.ObjectId,
          ref: 'Team'
    }

})

const Player = mongoose.model('Player', playerSchema)
module.exports = Player;

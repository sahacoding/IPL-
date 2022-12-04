const {tmSchema, plyrSchema} = require('./schemas.js');
const ExpressError = require ('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateTeam = (req, res, next) => {
    //console.log('body', req.body)
       const {error} = tmSchema.validate(req.body);
      // console.log('error is', error)
       if(error) {
           const msg = error.details.map(el => el.message).join(',')
           throw new ExpressError(msg,400)
       } else{
        next()
       }

    //    const {error: plyrerror} = plyrSchema.validate(req.body);
    //    console.log('error1 is', plyrerror)
    //    if(plyrerror) {
    //        const msg1 = plyrerror.details.map(el => el.message).join(',')
    //        throw new ExpressError(msg1,400)
    //    } 
       
   }

   module.exports.validatePlyr = (req, res, next) => {
    //console.log(' plyr body', req.body)
       const {error} = plyrSchema.validate(req.body);
     //  console.log('error plyr is', error)
       if(error) {
           const msg1 = error.details.map(el => el.message).join(',')
           throw new ExpressError(msg1,400)
       } else{
        next()
       }
       
    }
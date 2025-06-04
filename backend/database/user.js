const mongoose= require('mongoose')
 const userSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        username:String,
        password:String,
});
module.exports={
    userSchema
}
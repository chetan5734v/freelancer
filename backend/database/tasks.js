const mongoose= require('mongoose')
 const userSchema = new mongoose.Schema({
  title: String,
  category: String, // e.g., "design", "coding", "notes", etc.
  postedBy: String,
  status: String,
  deadline: Date, 
  createdAt: Date

});
module.exports={
    userSchema
}
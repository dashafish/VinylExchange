const mongoose =  require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ('bcrypt');

const userSchema = new Schema({
    firstName:{type: String, required: [true, "first name is required"]},
    lastName: {type: String, required: [true, "last name is required"]},
    email: {type: String, required: [true, "email is required"], unique: true},
    password: {type: String, required: [true, "password cannot be empty"]}

});

//replace plaintext password with hashed password before saving it to the database
//pre middleware
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));

});

//implement a method to compare the login password and the hash stored in dbs
userSchema.methods.comparePassword = function(loginPassword){
    let user = this;
    return bcrypt.compare(loginPassword, user.password)
}

module.exports = mongoose.model('User', userSchema);
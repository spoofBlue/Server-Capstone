
const mongoose = require(`mongoose`);
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    "userId" : {type : String} ,
    "username" : {type : String , required : true, unique : true} ,
    "userPassword" : {type : String , required : true} ,
    "userFullName" : {type : String , required : true} ,
    "userEmail" : {type : String , required : true} ,
    "userPhoneNumber" : {type : String , required : true} ,
    "userDescription" : {type : String , required : true} 
});

UserSchema.methods.serialize = function() {
    return {
        userId : this._id ,
        username : this.username ,
        userFullName : this.userFullName ,
        userEmail : this.userEmail ,
        userPhoneNumber : this.userPhoneNumber ,
        userDescription : this.userDescription 
    }
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.userPassword);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

//Syncronous version if needed.
UserSchema.statics.hashPasswordSync = function(password) {
    return bcrypt.hashSync(password, 10);
};

const Users = mongoose.model(`users`, UserSchema);

module.exports = {Users};
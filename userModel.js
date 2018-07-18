
const mongoose = require(`mongoose`);

const UserSchema = mongoose.Schema({
    "userId" : {type : String} ,
    "username" : {type : String , required : true} ,
    "userPassword" : {type : String , required : true} ,
    "userFullName" : {type : String , required : true} ,
    "userEmail" : {type : String , required : true} ,
    "userPhoneNumber" : {type : String , required : true} ,
    "userEntryIds" : {type : Object} ,
    "userDescription" : {type : String , required : true} 
});

UserSchema.methods.serialize = function() {
    return {
        userId : this._id ,
        username : this.username ,
        userFullName : this.userFullName ,
        userEmail : this.userEmail ,
        userPhoneNumber : this.userPhoneNumber ,
        userEntryIds : this.userEntryIds ,
        userDescription : this.userDescription 
    }
}

const Users = mongoose.model(`users`, UserSchema);

module.exports = {Users};
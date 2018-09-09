
const mongoose = require(`mongoose`);

const EntrySchema = mongoose.Schema({
    "entryCreationDate" : {type : String , required : true} ,
    "entryName" : {type : String , required : true} ,
    "entryUserFullName" : {type : String , required : true} ,
    "entryUserEmail" : {type : String , required : true} ,
    "entryUserPhoneNumber" : {type : String , required : true} ,
    "entryUsersId" : {type : String , required : true} ,
    "entryRole" : {type : String , required : true} ,
    "entryAddress" : {
        // Check to make this object required.
        entryStreetAddress : {type : String , required : true} ,
        entryCity : {type : String , required : true} ,
        entryState : {type : String , required : true} ,
        entryCountry : {type : String , required : true} ,
        entryZipcode : {type : String , required : true} 
    } ,
    "entryDescription" : {type : String , required : true} ,
    "entryFoodAvailable" : {type : String , required : true} ,
    "entryLastUpdatedDate" : {type : String}
});

EntrySchema.methods.serialize = function() {
    return {
        entryId : this._id ,
        entryCreationDate : this.entryCreationDate ,
        entryName : this.entryName ,
        entryUserFullName : this.entryUserFullName ,
        entryUserEmail : this.entryUserEmail ,
        entryUserPhoneNumber : this.entryUserPhoneNumber ,
        entryUsersId : this.entryUsersId ,
        entryRole : this.entryRole ,
        entryAddress : {                               // Perhaps I can simply use this.entryAddress. Maintaining specificity, just in case.
            entryStreetAddress : this[`entryAddress`].entryStreetAddress ,
            entryCity : this[`entryAddress`].entryCity ,
            entryState : this[`entryAddress`].entryState ,
            entryCountry : this[`entryAddress`].entryCountry ,
            entryZipcode : this[`entryAddress`].entryZipcode 
        } ,
        entryDescription : this.entryDescription ,
        entryFoodAvailable : this.entryFoodAvailable
    }
}

const Entries = mongoose.model(`entries`, EntrySchema);

module.exports = {Entries};
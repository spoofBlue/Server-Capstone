
const TEMP_USER = {
    userId : "AAAA" ,
    username : "BobSmith" ,
    userFullName : "Bob Smith" ,
    userEmail : "bobsmith@something.com" ,
    userPhoneNumber : "1234567890" ,
    userEntryIds : ["1111", "2222", "3333"] ,
    userDescription : "Hello, I have diner and a supermarket. Have some products I will need to toss, may as well put them here!"
};

const TEMP_USER_ENTRIES = [{
    entryId : "AAAA" ,
    entryCreationDate : "06-25-2018" ,
    entryName : `Henry's Market` ,
    entryUserFullName : "Bob Smith" ,
    entryUserEmail : "bobsmith@something.com" ,
    entryUserPhoneNumber : "1234567890" ,
    entryUsersId : "AAAA" ,
    entryRole : "Donator" ,
    entryAddress : {
        entryStreetAddress : "123 Oak Avenue" ,
        entryCity : "Dallas" ,
        entryState : "TX" ,
        entryCountry : "United States" ,
        entryZipcode : "12345"
    } ,
    entryDescription : "We're a local diner downtown. We typically have extra fruits and breads every couple of weeks." ,
    entryFoodAvailable : "Apple's five dozen. About ten loafs of bread. Ten cakes. Several dozen day-old bagels. Six gallons milk. Some misc."
} , {
    entryId : "2222" ,
    entryCreationDate : "06-27-2018" ,
    entryName : `Buy N' Large Supermarket` ,
    entryUserFullName : "Bob Smith" ,
    entryUserEmail : "bobsmith@something.com" ,
    entryUserPhoneNumber : "1234567890" ,
    entryUsersId : "AAAA" ,
    entryRole : "Donator" ,
    entryAddress : {
        entryStreetAddress : "111 Walaby Way" ,
        entryCity : "Dallas" ,
        entryState : "TX" ,
        entryCountry : "United States" ,
        entryZipcode : "12349"
    } ,
    entryDescription : "We are a large supermarket. We have a large surplus of products nearing expiration dates. Details outlines in our food database." ,
    entryFoodAvailable : "Several dozen day-old bagels."
} , {
    entryId : "3333" ,
    entryCreationDate : "07-02-2018" ,
    entryName : `City Hospitality Station` ,
    entryUserFullName : "Bob Smith" ,
    entryUserEmail : "bobsmith@something.com" ,
    entryUserPhoneNumber : "1234567890" ,
    entryUsersId : "AAAA" ,
    entryRole : "Receiver" ,
    entryAddress : {
        entryStreetAddress : "789 W Anderson Street" ,
        entryCity : "Houston" ,
        entryState : "TX" ,
        entryCountry : "United States" ,
        entryZipcode : "27705"
    } ,
    entryDescription : "We are a non-profit homeless shelter, seeking for reduced food rates." ,
    entryFoodAvailable : "Anything would be appreciated!"
}];

const TEMP_SEARCH_ENTRIES = [{
    entryId : "3333" ,
    entryCreationDate : "07-02-2018" ,
    entryName : `City Hospitality Station` ,
    entryUserFullName : "Bob Smith" ,
    entryUserEmail : "bobsmith@something.com" ,
    entryUserPhoneNumber : "1234567890" ,
    entryUsersId : "AAAA" ,
    entryRole : "Receiver" ,
    entryAddress : {
        entryStreetAddress : "789 W Anderson Street" ,
        entryCity : "Houston" ,
        entryState : "TX" ,
        entryCountry : "United States" ,
        entryZipcode : "27705"
    } ,
    entryDescription : "We are a non-profit homeless shelter, seeking for reduced food rates." ,
    entryFoodAvailable : "Anything would be appreciated!"
}, {
    entryId : "4444" ,
    entryCreationDate : "07-05-2018" ,
    entryName : `Place for the Homeless` ,
    entryUserFullName : "Kevin Jane" ,
    entryUserEmail : "kevinjane@something.com" ,
    entryUserPhoneNumber : "1234567890" ,
    entryUsersId : "DDDD" ,
    entryRole : "Receiver" ,
    entryAddress : {
        entryStreetAddress : "444 N Nelson Street" ,
        entryCity : "Houston" ,
        entryState : "TX" ,
        entryCountry : "United States" ,
        entryZipcode : "27710"
    } ,
    entryDescription : "We are a homeless shelter, looking for a donator." ,
    entryFoodAvailable : "No preferences."
}];

`use strict`;

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const mongoose = require(`mongoose`);

const {app, runServer, closeServer} = require(`../server`);
const {Entries} = require(`../entryModel`);
const {TEST_DATABASE_URL} = require(`../config`);

chai.use(chaiHttp);
const expect = chai.expect;


function seedEntryData() {
    console.info('Seeding entry data');
    const seedEntryData = [];
    for (let i=1; i<=10; i++) {
        seedEntryData.push(generateEntry());
    }
    return Entries.insertMany(seedEntryData);
}

function generateEntry() {
    const sampleEntry = {
        "entryId": generateId() ,                           // Remove this? Or else have _id replace this in db.
        "entryCreationDate": generateEntryCreationDate() ,
        "entryName" : genearteString() ,
        "entryUserFullName" : genearteString() ,
        "entryUserEmail" : genearteString() ,
        "entryUserPhoneNumber" : genearteString() ,
        "entryUsersId" : generateId() ,
        "entryRole" : generateEntryRole() ,
        "entryAddress" : {
            entryStreetAddress : genearteString() ,
            entryCity : genearteString() ,
            entryState : genearteString() ,
            entryCountry : genearteString() ,
            entryZipcode : generateEntryZipcode() ,
        } ,
        "entryDescription" : genearteString() ,
        "entryFoodAvailable" : genearteString() 
    };
    return sampleEntry;
}

function generateEntryWithoutEntryId() {
    const sampleEntry = {
        "entryCreationDate": generateEntryCreationDate() ,
        "entryName" : genearteString() ,
        "entryUserFullName" : genearteString() ,
        "entryUserEmail" : genearteString() ,
        "entryUserPhoneNumber" : genearteString() ,
        "entryUsersId" : generateId() ,
        "entryRole" : generateEntryRole() ,
        "entryAddress" : {
            entryStreetAddress : genearteString() ,
            entryCity : genearteString() ,
            entryState : genearteString() ,
            entryCountry : genearteString() ,
            entryZipcode : generateEntryZipcode() ,
        } ,
        "entryDescription" : genearteString() ,
        "entryFoodAvailable" : genearteString() 
    };
    return sampleEntry;
}

function generateId() {
    const ids = ["asdf1234Id", "11111fffffId", "qwertyId", "565565656Id", "thisIsAnId"];
    return ids[Math.floor(Math.random() * ids.length)];
}

function generateEntryCreationDate() {
    const dates = ["Jul 06, 1994", "May 02, 1722", "Jan 30, 2015", "Sep 12, 2027"];
    return dates[Math.floor(Math.random() * dates.length)];
}

function genearteString() {
    const strings = ["WordsOfInfo", "TextOrName", "StreetOrInfo", "ThingsInAString", "LettersGenerated"];
    return strings[Math.floor(Math.random() * strings.length)];
}

function generateEntryRole() {
    const roles = ["Donator","Receiver"];
    return roles[Math.floor(Math.random() * roles.length)];
}

function generateEntryZipcode() {
    const zipcodes = ["27705", "90210", "10055", "56567", "89144"];
    return zipcodes[Math.floor(Math.random() * zipcodes.length)];
}

function tearSeedDb() {
    console.warn(`Dropping database`);
    return mongoose.connection.dropDatabase();
}

describe(`Entry Integration Testing`, function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return seedEntryData();
    });
    afterEach(function() {
        return tearSeedDb();
    });
    after(function() {
        return closeServer();
    });

    describe(`Entry GET requests`, function() {
        it('should return all existing entries', function() {
            let res;
            return chai.request(app)
                .get('/entries')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an(`array`);
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Entries.countDocuments();
                })
                .then(function(count) {
                    expect(res.body).to.have.lengthOf(count);
                })
        });

        it(`should show an entry has all the correct Keys in it`, function() {
            let resEntry;
            const entryKeys = [`entryId`,`entryCreationDate`,`entryName`,`entryUserFullName`,`entryUserEmail`,`entryUserPhoneNumber`,`entryUsersId`,
            `entryRole`,`entryAddress`,`entryDescription`,`entryFoodAvailable`];
            const entryAddressKeys = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];
            return chai.request(app)
                .get(`/entries`)
                .then(function(_res) {
                    resEntry = _res.body[0];
                    expect(resEntry).to.have.keys(entryKeys);
                    expect(resEntry[`entryAddress`]).to.have.keys(entryAddressKeys);
                    return Entries.findById(resEntry.entryId);
                })
                .then(function(chosenEntry) {
                    entryKeys.forEach(function(key) {
                        /*
                        if (key === "entryId") {
                            expect(resEntry["entryId"]).to.equal(chosenEntry["_id"]);
                        } else */
                        if (key !== "entryAddress" && key !== "entryId") {
                            expect(resEntry[key]).to.equal(chosenEntry[key]);
                        }
                    });
                    entryAddressKeys.forEach(function(addressKey) {
                        expect(resEntry["entryAddress"][addressKey]).to.equal(chosenEntry["entryAddress"][addressKey]);
                    });
                });
        });

        it(`should return existing entries with the specified entryRole`, function() {
            // Can also test for an equal count of entries with a certain role (between search-database and response).
            let sampleEntry;
            return Entries.findOne()
            .then(function(entry) {
                sampleEntry = entry;
                return sampleEntry;
            })
            .then(function() {
                return chai.request(app)
                .get(`/entries?entryRole=${sampleEntry[`entryRole`]}`)
                .then(function(_res) {
                    res = _res;
                    res.body.forEach(function(entry) {
                        expect(entry[`entryRole`]).to.equal(sampleEntry[`entryRole`]);
                    });
                    return Entries.find({entryRole : sampleEntry[`entryRole`]});
                })
                .then(function(entriesWithTheRole) {
                    entriesWithTheRole.forEach(function(entry) {
                        expect(entry[`entryRole`]).to.equal(sampleEntry[`entryRole`]);
                    });
                });
            })
        });
        it(`should return existing entries with the specified entryZipcode`, function() {
            // Need to correct this test still.  See entryRouter before and after Entries.find(filters). filters is populated, but the entries
            // returned is empty.
            let sampleEntry;
            return Entries.findOne()
            .then(function(entry) {
                sampleEntry = entry;
                return sampleEntry;
            })
            .then(function() {
                return chai.request(app)
                .get(`/entries?entryZipcode=${sampleEntry[`entryAddress`][`entryZipcode`]}`)
                .then(function(_res) {
                    res = _res;
                    return Entries.find({entryAddress : {entryZipcode : sampleEntry[`entryAddress`][`entryZipcode`]}});
                })
                .then(function(entriesWithTheZipcode) {
                    entriesWithTheZipcode.forEach(function(entry) {
                        expect(entry[`entryAddress`][`entryZipcode`]).to.equal(sampleEntry[`entryAddress`][`entryZipcode`]);
                    });
                });
            })
        });
    });

    describe(`Entry POST requests`, function() {

        it(`should post a new entry into the database with all required keys (with correct values).`, function() {
            let newEntry;
            const entryKeys = [`entryId`,`entryCreationDate`,`entryName`,`entryUserFullName`,`entryUserEmail`,`entryUserPhoneNumber`,`entryUsersId`,
            `entryRole`,`entryAddress`,`entryDescription`,`entryFoodAvailable`];
            const entryAddressKeys = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];
            
            let resEntry;
            // Promise.resolve.  It looks like good logic. But is it good/neutral practice 
            // even though generateEntry() isn't asynchornous, therefore, not necessary?
            Promise.resolve(generateEntryWithoutEntryId())
                .then(newEnt => {
                    newEntry = newEnt;
                    return chai.request(app)
                .post(`/entries`)
                .send(newEntry)
                .then(function(_res) {
                    resEntry = _res.body;
                    expect(_res).to.have.status(201);
                    expect(_res).to.be.json;
                    expect(resEntry).to.be.a('object');
                    expect(resEntry).to.have.keys(entryKeys);
                    expect(resEntry.entryAddress).to.have.keys(entryAddressKeys);
                    return Entries.findById(resEntry.entryId);
                })
                .then(function(dbEntry) {
                    entryKeys.forEach(function(key) {
                        /*
                        if (key === "entryId") {
                            expect(resEntry["entryId"]).to.equal(chosenEntry["_id"]);
                        } else */
                        if (key !== "entryAddress" && key !== "entryId") {
                            expect(resEntry[key]).to.equal(dbEntry[key]);
                        }
                    });
                    entryAddressKeys.forEach(function(addressKey) {
                        expect(resEntry["entryAddress"][addressKey]).to.equal(dbEntry["entryAddress"][addressKey]);
                    });
                });
            })
            .catch(err => {
                console.log(err);
            });
        });

        it(`should not post a request that is missing certain keys in req.body`, function() {
            const badEntry = {
                "entryCreationDate": "Jul 24, 2014" ,
                "entryName" : "marketplace" ,
                "entryUserFullName" : "Bobby Boppers" ,
            }
            
            //let resEntry;
            return chai.request(app)
            .post(`/entries`)
            .send(badEntry)
            .then(function(_res) {
                expect(_res).to.have.status(400);
            })
            .catch(function(error) {
                expect(error).to.have.status(400);
            });
        });
    });

    describe(`entry PUT requests`, function() {
        it(`should make a PUT request and replace the intended information.`, function() {
            let updateInfo = {
                    entryId : "somePredefinedId" ,
                    entryCreationDate : "06-25-2018" ,
                    entryName : `Henry's Market` ,
                    entryUserFullName : "Bob Smith" ,
                    entryUsersId : "AAAA" ,
                    entryRole : "Donator" ,
                    entryAddress : {
                        entryStreetAddress : "123 Oak Avenue" ,
                        entryCity : "Dallas" ,
                        entryCountry : "United States" ,
                        entryZipcode : "12345"
                    } ,
                    entryDescription : "We're a local diner downtown. We typically have extra fruits and breads every couple of weeks." ,
                    entryFoodAvailable : "Apple's five dozen. About ten loafs of bread. Ten cakes. Several dozen day-old bagels. Six gallons milk. Some misc."
            }
            // All fields will be updated except entryUserEmail, entryUserPhoneNumber, and entryState.
            const entryKeys = [`entryId`,`entryCreationDate`,`entryName`,`entryUserFullName`,`entryUserEmail`,`entryUserPhoneNumber`,`entryUsersId`,
            `entryRole`,`entryAddress`,`entryDescription`,`entryFoodAvailable`];
            const entryAddressKeys = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];

            let chosenEntry;
            Entries.findOne()
            .then(function(entry) {
                chosenEntry = entry;
                updateInfo["entryId"] = chosenEntry._id;
                return chai.request(app)
                .put(`/entries/${chosenEntry._id}`)
                .send(updateInfo)
                .then(function(_res) {
                    expect(_res).to.have.status(204);
                    return Entries.findById(chosenEntry._id);
                })
                .then(function(dbEntry) {
                    entryKeys.forEach(function(key) {
                        if (key === "entryAddress") {
                            entryAddressKeys.forEach(function(addressKey) {
                                expect(dbEntry["entryAddress"][addressKey]).to.equal(updateInfo["entryAddress"][addressKey]);
                            });
                        } else
                        if (key !== "entryId") {
                            expect(dbEntry[key]).to.equal(updateInfo[key]);
                        }
                    });
                });
            });
        });

        it(`should fail to update a post because the id n routing request is invalid`, function() {
            const badId = "1";
            let updateInfo = {
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
            }

            return chai.request(app)
            .put(`/entries/${badId}`)
            .send(updateInfo)
            .then(function(_res) {
                expect(_res).to.have.status(400);
                expect(_res).to.have.property("message");
            })
            .catch(function(error) {
                console.log(error.body);  
                expect(error.name).to.equal(`AssertionError`);   // Double check, make sure this is the error I should be getting.
            });
        });
    });

    describe(`entry DELETE requests`, function() {

        it(`should delete an entry of the database`, function() {
            let chosenEntry;

            return Entries.findOne()
            .then(function(entry) {
                chosenEntry = entry;
                return chai.request(app)
                .delete(`/entries/${chosenEntry._id}`)
                .then(function(_res) {
                    expect(_res).to.have.status(204);
                    return Entries.findById(chosenEntry._id);
                })
                .then(function(result) {
                    console.log(`result = ${result}`);
                    expect(result).to.be.null;
                })
                .catch(function(error) {
                    console.log(`error = ${error}`)
                    expect(error).to.be(false);
                });
            });
        });
    });
});
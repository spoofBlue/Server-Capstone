
console.log("Hello Server Tester");

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);
const mongoose = require(`mongoose`);

mongoose.Promise = global.Promise;

const { app } = require(`../server`);

const expect = chai.expect;

chai.use(chaiHttp);

describe(`Server Test`, function () {
    it(`should return true no matter what`, function () {
        return chai.request(app)
            .get(`/`)
            .then(function (res) {
                console.log(res.body);
                expect(res).to.have.status(200);
            })
    });
});


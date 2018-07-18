
const express = require(`express`);
const bodyParser = require(`body-parser`);

const {Users} = require(`./userModel`);

// Further package accessibility
const router = express.Router();
const jsonParser = bodyParser.json();

router.get(`/`, (req, res) => {
    console.log(`Accessed userRouter through the get request.`);
    //const filters = {};  No filters currently deemed necessary.

    Users
        .find()
        .then(users => {
            res.status(200).json(users.map(user => user.serialize()));
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({message :`Internal Server Error`});
        });
});

router.get(`/:id`, (req, res) => {
    console.log(`Accessed userRouter through the get request.`);
    Users
        .findById(req.params.id)
        .then(user => {
            res.status(200).json(user.serialize());  
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({message :`Internal Server Error`});
        });
});

router.post(`/`, jsonParser, (req, res) => {
    console.log(`Accessed userRouter through the post request.`);
    const requiredFields = [`userPassword`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userDescription`];

    let errored = false;
    let message = [];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            message.push(`The field ${field} is missing from the request.`);
            errored = true;
        }
    });

    if (errored) {
        return res.status(400).json(message);
    }

    Users
        .create({
            username : req.body.username ,
            userPassword : req.body.userPassword ,
            userFullName : req.body.userFullName ,
            userEmail : req.body.userEmail ,
            userPhoneNumber : req.body.userPhoneNumber ,
            userDescription : req.body.userDescription ,
            userEntryIds : []
        })

        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            const message = `Failed to create user`;
            console.log(err);
            return res.status(400).send(message);
        });
});

router.put(`/:id`, jsonParser, (req, res) => {
    console.log(`Accessed userRouter through the put request.`);
    if (!(req.params.id && req.body.userId && req.params.id === req.body.userId)) {
        const msg = `${req.params.id} and ${req.body.userId} not the same`;
        return res.status(400).json({message : msg});
    }

    const toUpdate = {};
    const updateableFields = [`userPassword`,`username`,`userFullName`,`userEmail`,`userPhoneNumber`,`userDescription`, `userEntryIds`]
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Users
    .findByIdAndUpdate(req.params.id, {$set : toUpdate})
    .then(user => res.status(204).end())
    .catch(error => {
        const message = `Failed to update user.`;
        console.log(error.message);
        return res.status(400).send(message);
    });
});

router.delete(`/:id`, (req, res) => {
    console.log(`Accessed userRouter through the delete request.`);
    Users.findByIdAndRemove(req.params.id)
    .then(response => res.status(204).end())
    .catch(error => {
        console.log("Failed to find user in database.");
        res.status(400).send(error.message);
    });
});


router.use('*', function (req, res) {
    res.status(404).json({ message: 'Routing Not Found' });
});

module.exports = router;
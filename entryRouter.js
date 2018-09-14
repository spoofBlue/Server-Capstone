
const express = require(`express`);
const bodyParser = require(`body-parser`);

const {Entries} = require(`./entryModel`);

// Further package accessibility
const router = express.Router();
const jsonParser = bodyParser.json();

router.get(`/`, (req, res) => {
    console.log(`Accessed entryRouter through the get request.`);
    const filters = {};
    const queryableFields = [`entryRole`, `entryUsersId`, `entryZipcode`];
    queryableFields.forEach(field => {
        if (req.query[field]) {
            if (field === `entryZipcode`) {
                filters[`entryAddress.entryZipcode`] = req.query[field];
            } else {
                filters[field] = req.query[field];
            }
        }
    });

    Entries
        .find(filters)
        .then(entries => {
            res.status(200).json(entries.map(entry => entry.serialize()));
        })
        .catch(err => {
            return res.status(500).json({message :`Internal Server Error`});
        });
});

router.get(`/:id`, (req, res) => {
    console.log(`Accessed entryRouter through the get request.`);
    Entries
        .findById(req.params.id)
        .then(entry => {
            res.status(200).json(entry.serialize());  
        })
        .catch(err => {
            return res.status(500).json({message :`Internal Server Error`});
        });
});

router.post(`/`, jsonParser, (req, res) => {
    console.log(`Accessed entryRouter through the post request.`);
    const requiredFields = [`entryCreationDate`,`entryName`,`entryUserFullName`,`entryUserEmail`,`entryUserPhoneNumber`,`entryUsersId`,
    `entryRole`,`entryAddress`,`entryDescription`,`entryFoodAvailable`];

    let errored = false;
    let message = [];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            message.push(`The field ${field} is missing from the request.`);
            errored = true;
        }
    });

    const requiredAddressFields = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];
    requiredAddressFields.forEach(addressField => {
        if (req.body[`entryAddress`] && !(addressField in req.body[`entryAddress`])) {
            message.push(`The field ${addressField} within entryAddress is missing from the request.`);
            errored = true;
        }
    });

    if (errored) {
        return res.status(400).json(message);
    }

    Entries
        .create({
            entryCreationDate : req.body.entryCreationDate ,
            entryName : req.body.entryName ,
            entryUserFullName : req.body.entryUserFullName ,
            entryUserEmail : req.body.entryUserEmail ,
            entryUserPhoneNumber : req.body.entryUserPhoneNumber ,
            entryUsersId : req.body.entryUsersId ,
            entryRole : req.body.entryRole ,
            entryAddress : {
                entryStreetAddress : req.body.entryAddress.entryStreetAddress ,
                entryCity : req.body.entryAddress.entryCity ,
                entryState : req.body.entryAddress.entryState ,
                entryCountry : req.body.entryAddress.entryCountry ,
                entryZipcode : req.body.entryAddress.entryZipcode ,
            } ,
            entryDescription : req.body.entryDescription ,
            entryFoodAvailable : req.body.entryFoodAvailable ,
        })
        .then(entry => res.status(201).json(entry.serialize()))
        .catch(() => {
            const message = `Failed to create entry`;
            return res.status(400).send(message);
        });
});

router.put(`/:id`, jsonParser, (req, res) => {
    console.log(`Accessed entryRouter through the put request.`);
    if (!(req.params.id && req.body.entryId && req.params.id === req.body.entryId)) {
        const msg = `${req.params.id} and ${req.body.entryId} not the same`;
        return res.status(400).json({message : msg});
    }

    const toUpdate = {};
    const updateableFields = [`entryCreationDate`,`entryName`,`entryUserFullName`,`entryUserEmail`,`entryUserPhoneNumber`,`entryUsersId`,
    `entryRole`,`entryDescription`,`entryFoodAvailable`];  // Notice entryAddress was removed from updating.  We'll address in second if statement.
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    if (req[`body`][`entryAddress`]) {  // Could hypothetically leave entryAddress in updateable fields above.
        const updateableAddressFields = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];
        updateableAddressFields.forEach(field => {
            if (field in req[`body`][`entryAddress`]) {
                toUpdate[`entryAddress.${field}`] = req.body[`entryAddress`][field];
            }
        });
    }

    Entries
    .findByIdAndUpdate(req.params.id, {$set : toUpdate})
    .then(entry => res.status(204).end())
    .catch(() => {
        const message = `Failed to update entry`;
        return res.status(400).send(message);
    });
});

router.delete(`/:id`, (req, res) => {
    console.log(`Accessed entryRouter through the delete request.`);
    Entries.findByIdAndRemove(req.params.id)
    .then(response => res.status(204).end())
    .catch(error => {
        const message = "Failed to find entry in database.";
        res.status(400).send(message);
    });
});

router.use('*', function (req, res) {
    res.status(404).json({ message: 'Routing Not Found' });
});

module.exports = router;
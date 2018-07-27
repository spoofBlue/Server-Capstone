
console.log("Hello main.js");

function main() {
    let USER;
    let USER_ENTRIES;
    let SEARCH_ENTRIES;
    let CURRENT_ENTRY;
    let CURRENT_ENTRY_SOURCE;
    let FORM_INPUTS;

    function initializePage() {
        checkAuthorizedUser(); 

        handleStatusTabClick();
        handleCreateNewEntryTabClick();
        handleSearchEntryTabClick();
        handleLogoutTabClick();
        handleViewEntryButtonClick();
        handleUpdateEntryButtonClick();
        hanldeSearchButtonClick();
        handleSubmitNewEntryButtonClick();
        handleSubmitUpdatedEntryButtonClick();
        handleDeleteButtonClick();

        getUserInfo();
        loadStatusSection();
    }

    function checkAuthorizedUser() {
        // Is this necessary? I could have a middleware function that shows an error in authenticity. When that error
        // occurs, the server could route the user to login.html?
        //$.get('/', function(response) {
        //    console.log(response);
            //if (response.status !== 200) {
            //    console.log(`client says server does not approve`);
            //    loadLoginPage();
            //} else {
            //    console.log(`client says server approves`);
            //}
        //});
        console.log(`user was authenticated to use the site through the checkAuthorizedUser() function.`)
    }

    function loadLoginPage() {
        // Empty USER, USER_ENTRIES, SEARCH_ENTRIES.
        // Load the Login page HTML.
        console.log("loadLoginPage() runs");
        window.location = "/index.html";
    }

    function getUserInfo() {
        // User's already logged in.  Getting serialized information on the user to store locally.
        //!!!!!! GET request!!
        USER = TEMP_USER;
    }

    function loadStatusSection() {
        // This function can load the HTML by clicking the Status Tab (route from handleStatusTabClick) or from intial page load (initializePage).
        getUserEntries()
        .then(() => {
            hideAllSections();
            unhideSection(`status_section`);
            CURRENT_ENTRY_SOURCE = USER_ENTRIES;
            if (USER_ENTRIES.length > 0) {
                displayStatusSection();
            } else {
                displayEmptyStatus();
            }
        })
        .catch((error) => {
            console.log("error in loadStatusSection: ", error.message);
        });
    }

    function getUserEntries() {
        // User's already logged in.  Getting serialized information on the entries of a specific entryUserId 
        // (the current user's userId) to store locally. 
        // Return a Promise.
        const user_entries_promise = new Promise((resolve, reject) => {
            const query = {
                entryUserId : USER.userId
            }
            $.get(`/entries`, query, function(data, status) {
                console.log("status: ", status);
                if (status === `success`) {
                    console.log(data);
                    USER_ENTRIES = data;
                    resolve();
                } else {
                    reject();
                }
                
            });
        });

        return user_entries_promise;
    }

    function hideAllSections() {
        // Adds the `hidden` CSS class (which has display:none) from all sections, making them invisible in the HTML.
        const sections = [`notification_section`,`status_section`, `create_new_entry_section`, `search_entry_section`, `search_results_section`, `view_entry_section`, `update_entry_section`];
        sections.forEach(section => $(`.${section}`).addClass(`hidden`));
    }

    function unhideSection(section) {
        // Removes the `hidden` CSS class (which has display:none) from the argument `section` to make it visible in the HTML.
        $(`.${section}`).removeClass(`hidden`);
    }

    function getEntryInfoFromEntryId(id) {
        // Get's the object with entryId "id" from USER_ENTRIES or SEARCH_ENTRIES, depending on which section user was in when accessing entry.
        if (CURRENT_ENTRY_SOURCE === USER_ENTRIES) {
            USER_ENTRIES.forEach(entry => {
                if (entry.entryId === id) {
                    CURRENT_ENTRY = entry;
                }
            });
        } else  { // !!!!!!!! if (CURRENT_ENTRY_SOURCE === USER_ENTRIES === SEARCH_ENTRIES)?
            SEARCH_ENTRIES.forEach(entry => {
                if (entry.entryId === id) {
                    CURRENT_ENTRY = entry;
                }
            });
        }
    }
    
    function gatherUserInputs(section) {
        // Given a section, parses through all the inputs in the section (likely in a form), and stores any details about the input into object
        // form_inputs.  Notice the addressDetails array, any inputs with a name in addressDetails gets placed into an object with form_inputs
        // called entryAddress.
        let form_inputs = {};

        const addressDetails = [`entryStreetAddress`,`entryCity`,`entryState`,`entryCountry`,`entryZipcode`];
        $(`.${section} input`).each(function() {
            let input = $(this);
            if (input.attr("type") === "radio") {
                if (input.is(":checked")) {
                    form_inputs[input.attr("name")] = {
                        id : input.attr("id") ,
                        type : input.attr("type") ,
                        value : input.val() ,
                        name : input.attr("name")
                    }
                } 
            } else 
            if (addressDetails.indexOf(input.attr("name")) !== -1) {
                if (!form_inputs.hasOwnProperty(`entryAddress`)) {
                    form_inputs[`entryAddress`] = {
                        name : `entryAddress` ,
                        type : `object` ,
                        value : {}
                    };
                }
                form_inputs[`entryAddress`][`value`][input.attr("name")] = {
                    id : input.attr("id") ,
                    type : input.attr("type") ,
                    value : input.val() ,
                    name : input.attr("name")
                }
            } else {
                form_inputs[input.attr("name")] = {
                    id : input.attr("id") ,
                    type : input.attr("type") ,
                    value : input.val() ,
                    name : input.attr("name")
                }
            }
        });
        return form_inputs;
    }

    function verifyAcceptableUserInputs(form_inputs) {
        // Verifies all text-based fields in the form_inputs object satisfy standards set in verifyInput. 
        // Returns true if all fields fulfill standards.
        // !!!!!! Doesn't fully highlightTextbox, notifyUser properly yet!
        let verified = true;
        console.log(form_inputs);

        $(`.notification_section`).addClass(`hidden`);
        Object.keys(form_inputs).forEach(function(input) {
            console.log(input);
            const result = verifyInput(form_inputs[input]);
            console.log(result);
            if (result !== "Accepted") {
                highlightTextbox(input.id);
                notifyUser(result);
                verified = false;
            }
        });
        return verified;
    }

    function verifyInput(input) {
        // Reads in input, uses input.name to determine what kind of tests the input must go through to be considered valid.
        let result = "Accepted";
        if (input.type === "text") {
            console.log(input);
            if ((input.name === "searchMileRadius") && Number.isNaN(parseInt(input.value))) {
                result = "The Mile Radius must be a number.";
            } else
            if (input.name === "searchMileRadius" && parseInt(input.value) > 15) {
                result = "The Mile Radius must be 15 or less.";
            } else
            if ((input.name === "entryZipcode" || input.name === "searchZipcode") && Number.isNaN(parseInt(input.value))) {
                result = "The zipcode must be a number.";
            }
        } else
        if (input.name === `entryAddress`) {
            console.log(input);
            Object.keys(input.value).forEach(function(addressInput) {
                console.log(input[`value`][addressInput]);
                if ((addressInput === "entryZipcode") && Number.isNaN(parseInt(input[`value`][addressInput].value))) {
                    result = "The zipcode must be a number.";
                }
            });
        }
        return result;
    }

     function highlightTextbox(textbox) {
        // Adds CSS to the textbox input (through the highlighted class) to make it stand out to the user, making it clear which textbox needs to be changed.
        $(textbox).addClass("highlighted");
     }

     function notifyUser(errorMessage) {
         unhideSection(`notificaton_section`);
         $(`.notificaton_section`).html(errorMessage);
     };

    /**                 PAGE SPECIFIC FUNCTIONS                     **/

    function handleStatusTabClick() {
        // When user clicks the Status Tab:
        //!!!!!!!!!!! (Server -> Make sure still authenticated).
        //!!!!!!!!!!! If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // For each entry in with the user's ID (Server -> GET entries associated with userId): 
        // (Server -> GET entries serialized information: almost everything).
        // !!!!!!!!!!! OPTIONAL Entries.sort().
        // Fill USER_ENTRIES storage locally.
        // Display Name, Role, Address, Contact Name, Description. Then a View Entry button and Update Entry button.
        // Refill, unhide Status section's HTML.
        $(".status_tab").click(function(event) {
            console.log("handleStatusTabClick runs");
            checkAuthorizedUser();
            loadStatusSection();
        });
    }

    function displayStatusSection() {
        // Fills in the HTML of .status_section.  Pulls data from locally stored USER_ENTRIES to display each entry.
        $(`.status_section`).html(
        `<h2>Status Page of ${USER.userFullName}</h2>
        <ul></ul>`
        );
        USER_ENTRIES.forEach(entry => {
            $(`.status_section ul`).append(
                `<li class="entry">
                <h3>${entry.entryName}</h3>
                <p>Role: ${entry.entryRole}</p>
                <h4>Address: ${stringifyEntryAddress(entry.entryAddress)}</h4>
                <p>Contact: ${entry.entryUserFullName}</p>
                <p>Description: ${entry.entryDescription}</p>
                <button class="view_entry_button" title="View Entry Button" value="${entry.entryId}">View</button>
                <button class="update_entry_button" title="Update Entry Button" value="${entry.entryId}">Update</button>
                </li>`
            );
        });
    }

    function displayEmptyStatus() {
        $(`.status_section`).html(
        `<h2>Status Page of ${USER.userFullName}</h2>
        <p>You currently have no entries listed. Click on the New Entry tab to create a new entry!</p>`
        );
    }

    function handleCreateNewEntryTabClick() {
        // When user clicks the Create Entry Tab:
        // !!!!!!!!!!!!! (Server -> Make sure still authenticated).
        // !!!!!!!!!!!!! If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // Refill, unhide Create Entry section's HTML.
        // OPTIONAL Autofill Contact Name, E-mail, Phone Number into form fields.
        $(".create_new_entry_tab").click(function(event) {
            console.log("handleCreateNewEntryTab runs");
            checkAuthorizedUser();
            hideAllSections();
            unhideSection(`create_new_entry_section`);
            CURRENT_ENTRY_SOURCE = USER_ENTRIES;
            displayCreateNewEntrySection();
        });
    }

    function displayCreateNewEntrySection() {
        // Fills in the HTML of .create_new_entry_section.  Autofills data from locally stored USER to help.
        $(`.create_new_entry_section`).html(
            `<h2>Create New Entry</h2>
            <form role="form">
                <fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" class="radio_donator_or_receiver" id="radio_donator" required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" class="radio_donator_or_receiver" id="radio_receiver" required>
                    <label for="radio_receiver">Receiver</label>
                </fieldset>
                <fieldset>
                    <legend>Business Info</legend>
                    <label for="input_entry_name">Business Name:</label>
                    <input type="text" name="entryName" placeholder="Bob's Diner" id="input_entry_name" required>
                    <label for="input_entry_description">Description:</label>
                    <input type="text" name="entryDescription" placeholder="We're a local diner downtown, giving away day-old food at a decent price." id="input_entry_description">
                </fieldset>
                <fieldset>
                    <legend>Address</legend>
                    <label for="input_entry_streetAddress">Street Address:</label>
                    <input type="text" name="entryStreetAddress" placeholder="123 Oak Avenue" id="input_entry_streetAddress" required>
                    <label for="input_entry_city">City:</label>
                    <input type="text" name="entryCity" placeholder="Houston" id="input_entry_city" required>
                    <label for="input_entry_state">State:</label>
                    <input type="text" name="entryState" placeholder="TX" id="input_entry_state" required>
                    <label for="input_entry_country">Country:</label>
                    <input type="text" name="entryCountry" placeholder="United States" id="input_entry_country" required>
                    <label for="input_entry_zipcode">Zipcode:</label>
                    <input type="text" name="entryZipcode" placeholder="90210" id="input_entry_zipcode" required>
                </fieldset>
                <fieldset>
                    <legend>Business Info</legend>
                    <label for="input_entry_contact_name">Contact's Name:</label>
                    <input type="text" name="entryUserFullName" placeholder="Bob Smith" id="input_entry_contact_name" value="${USER.userFullName}" required>
                    <label for="input_entry_contact_email">E-mail:</label>
                    <input type="text" name="entryUserEmail" placeholder="bobsmith@place.com" id="input_entry_contact_email" value="${USER.userEmail}" required>
                    <label for="input_entry_contact_phoneNumber">Phone Number:</label>
                    <input type="text" name="entryUserPhoneNumber" placeholder="123-456-7890" id="input_entry_contact_phoneNumber" value="${USER.userPhoneNumber}" required>
                </fieldset>
                <label for="input_entry_foodAvailable">Food Available:</label>
                <input type="text" name="entryFoodAvailable" placeholder="Several dozen bagels weekly.  Several gallons of milk weekly." id="input_entry_foodAvailable"
                    required>
                <button type="submit" class="submit_new_entry_button" title="Submit New Entry Button">Create Entry</button>
            </form>`
        );
    }

    function handleSearchEntryTabClick() {
        // When user clicks the Search Entry Tab:
        // !!!!!!!! (Server -> Make sure still authenticated).
        // !!!!!!!! If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // Refill, unhide Search Entry section's HTML.
        $(".search_entry_tab").click(function(event) {
            console.log("handleSearchEntryTab runs");
            checkAuthorizedUser();
            hideAllSections();
            unhideSection(`search_entry_section`);
            displaySearchEntrySection();
        });
        // Empty SEARCH_ENTRIES local storage?
    }

    function displaySearchEntrySection() {
        // Fills in the HTML of .create_new_entry_section.  Autofills data from locally stored USER to help.
        $(`.search_entry_section`).html(
            `<h2>Search Entries</h2>
            <form role="form">
                <fieldset>
                    <legend>Search for donators or receivers?</legend>
                    <input type="radio" name="entryRole" value="Donator" class="radio_donator_or_receiver" id="radio_donator" required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" class="radio_donator_or_receiver" id="radio_receiver" required>
                    <label for="radio_receiver">Receiver</label>
                </fieldset>
                <fieldset>
                    <legend>Location Criteria</legend>
                    <label for="input_entry_zipcode">Zipcode:</label>
                    <input type="text" name="searchZipcode" placeholder="90210" id="input_entry_zipcode" required>
                    <label for="input_mile_radius">Within this many miles:</label>
                    <input type="text" name="searchMileRadius" placeholder="15 maximum" id="input_mile_radius" required>
                    <button type="submit" class="search_button" title="Start Search Button" >Start Search</button>
                </fieldset>
            </form>`
        )
    }

    function handleLogoutTabClick() {
        // When user clicks the Logout Tab:
        // Show an alert asking "Are you sure?" or something like this.

        // Load the Login page.
        $(".logout_tab").click(function(event) {
            console.log("handleLogoutTabClick runs");
            if (confirm("Click OK to confirm log out.")) {
                // Clicks OK.
                loadLoginPage();
            }
        });
        
        // If confirmed logging out (Server -> remove JWT authentication).
    }

    function handleViewEntryButtonClick() {
        // When user clicks the View Entry button (within Status Page or Search Page):
        // !!!!!!!!!!!! (Server -> Make sure still authenticated).
        // !!!!!!!!!!!! If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide current section's HTML.
        // obtain the entryId relevant to the entry clicked.
        // Refill, unhide View Entry section's HTML.
        // Display almost everything for the entry (from relevant entryId's info in USER_ENTRIES or SEARCH_ENTRIES, depending on if entryUsersId = userId).
        // If userId matches the entries associated userID, also make the Update Entry button available.
        $("main").on("click", ".view_entry_button", function(event) {
            console.log("handleViewEntryButtonClick runs");
            checkAuthorizedUser();
            getEntryInfoFromEntryId($(event.currentTarget).attr("value"));  // the entry's entryId was stored in value.
            hideAllSections();
            unhideSection(`view_entry_section`);
            displayViewEntrySection();
        });
    }

    function displayViewEntrySection() {
        // Fills in the HTML of .view_entry_section.  Uses data from CURRENT_ENTRY. Only shows update button if entry's userId = id of logged in user.
        console.log("Let's view the entry.")
        console.log(CURRENT_ENTRY);
        $(`.view_entry_section`).html(
            `<h2>View Entry for ${CURRENT_ENTRY.entryName}.</h2>
            <p>Role: ${CURRENT_ENTRY.entryRole}</p>
            <h3>${stringifyEntryAddress(CURRENT_ENTRY.entryAddress)}</h3>
            <section class="contact_info">
                <h3>Contact: ${CURRENT_ENTRY.entryUserFullName}</h3>
                <p>Contact's E-mail: ${CURRENT_ENTRY.entryUserEmail}</p>
                <p>Contact's Phone Number: ${CURRENT_ENTRY.entryUserPhoneNumber}</p>
            </section>
            <p>Date Created: ${CURRENT_ENTRY.entryCreationDate}</p> 
            <p>Description: ${CURRENT_ENTRY.entryDescription}.</p>
            <p>Food Available: ${CURRENT_ENTRY.entryFoodAvailable}</p>`
        );
        console.log(CURRENT_ENTRY.entryUsersId);
        console.log(USER.userId);
        if (CURRENT_ENTRY.entryUsersId === USER.userId) {
            $(`.view_entry_section`).append(
                `<button class="update_entry_button" title="Update Entry Button" value="${CURRENT_ENTRY.entryId}">Update</button>
                <button class="delete_entry_button" title="Delete Entry Button" value="${CURRENT_ENTRY.entryId}">Delete</button>`

            );
        }
    }

    function stringifyEntryAddress(addressObject) {
        // Takes the object addressObject and combines all the address info within it into a single string for the user.
        return `${addressObject.entryStreetAddress}, ${addressObject.entryCity}, ${addressObject.entryState}, ${addressObject.entryZipcode}`;
    }

    function handleUpdateEntryButtonClick() {
        // When user clicks on the Update Entry button on the Status, Search, or View Entry pages:
        // obtain the entryId relevant to the entry clicked.
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide current section's HTML.
        // Refill, unhide Update Entry section's HTML.
        // !!!!!!!!!!!! Set the values in the respective fields to the entries previous information (from entryId's info in USER_ENTRIES).
        $("main").on("click", ".update_entry_button" ,function(event) {
            console.log("handleUpdateEntryButtonClick runs");
            checkAuthorizedUser();
            getEntryInfoFromEntryId($(event.currentTarget).attr("value"));  // the entry's entryId was stored in value.
            hideAllSections();
            unhideSection(`update_entry_section`);
            displayUpdateEntrySection();
        });
        
    }

    function displayUpdateEntrySection() {
        // Fills in the HTML of .update_entry_section.  Uses data from CURRENT_ENTRY.
        $(`.update_entry_section`).html(
            `<h2>Update Entry for ${CURRENT_ENTRY.entryName}</h2>
            <form role="form"></form>`
        );
        if (CURRENT_ENTRY.entryRole === `Donator`) {        // Then the `Donator` value is checked.
            $(`.update_entry_section form`).append(
                `<fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" class="radio_donator_or_receiver" id="radio_donator" checked required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" class="radio_donator_or_receiver" id="radio_receiver" required>
                    <label for="radio_receiver">Receiver</label>
                </fieldset>`
            );
        } else 
        if (CURRENT_ENTRY.entryRole === `Receiver`) {
            $(`.update_entry_section form`).append(      // Then the `Receiver` value is checked.
                `<fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" class="radio_donator_or_receiver" id="radio_donator" required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" class="radio_donator_or_receiver" id="radio_receiver" checked required>
                    <label for="radio_receiver">Receiver</label>
                </fieldset>`
            );
        }
        $(`.update_entry_section form`).append(
            `<fieldset>
                    <legend>Business Info</legend>
                    <label for="input_entry_name">Business Name:</label>
                    <input type="text" name="entryName" value="${CURRENT_ENTRY.entryName}" id="input_entry_name" required>
                    <label for="input_entry_description">Description:</label>
                    <input type="text" name="entryDescription" value="${CURRENT_ENTRY.entryDescription}" id="input_entry_description">
                </fieldset>
                <fieldset>
                    <legend>Address</legend>
                    <label for="input_entry_streetAddress">Street Address:</label>
                    <input type="text" name="entryStreetAddress" value="${CURRENT_ENTRY.entryAddress.entryStreetAddress}" id="input_entry_streetAddress" required>
                    <label for="input_entry_city">City:</label>
                    <input type="text" name="entryCity" value="${CURRENT_ENTRY.entryAddress.entryCity}" id="input_entry_city" required>
                    <label for="input_entry_state">State:</label>
                    <input type="text" name="entryState" value="${CURRENT_ENTRY.entryAddress.entryState}" id="input_entry_state" required>
                    <label for="input_entry_country">Country:</label>
                    <input type="text" name="entryCountry" value="${CURRENT_ENTRY.entryAddress.entryCountry}" id="input_entry_country" required>
                    <label for="input_entry_zipcode">Zipcode:</label>
                    <input type="text" name="entryZipcode" value="${CURRENT_ENTRY.entryAddress.entryZipcode}" id="input_entry_zipcode" required>
                </fieldset>
                <fieldset>
                    <legend>Business Info</legend>
                    <label for="input_entry_contact_name">Contact's Name:</label>
                    <input type="text" name="entryUserFullName" value="${CURRENT_ENTRY.entryUserFullName}" id="input_entry_contact_name" required>
                    <label for="input_entry_contact_email">E-mail:</label>
                    <input type="text" name="entryUserEmail" value="${CURRENT_ENTRY.entryUserEmail}" id="input_entry_contact_email" required>
                    <label for="input_entry_contact_phoneNumber">Phone Number:</label>
                    <input type="text" name="entryUserPhoneNumber" value="${CURRENT_ENTRY.entryUserPhoneNumber}" id="input_entry_contact_phoneNumber" required>
                </fieldset>
                <label for="input_entry_foodAvailable">Food Available:</label>
                <input type="text" name="entryFoodAvailable" value="${CURRENT_ENTRY.entryFoodAvailable}" id="input_entry_foodAvailable"
                    required>
                <button class="view_entry_button" title="View Entry Button" value="${CURRENT_ENTRY.entryId}">View</button>
                <button class="delete_entry_button" title="Delete Entry Button" value="${CURRENT_ENTRY.entryId}">Delete</button>
                <button type="submit" class="submit_updated_entry_button" title="Submit Updated Entry Button" value="${CURRENT_ENTRY.entryId}">Update Entry</button>`
        );
    }

    function hanldeSearchButtonClick() {
        // When user clicks the Search button on the Search Page:

        // !!!!!!!!! (Server -> Make sure still authenticated).
        // !!!!!!!!! If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are properly filled (ex zipcode is a number, mile radius is a number)
        // If fields not valid. Notify the user. Stop.
        // Make a request to the GeoCoder API to gather all zipcodes within the user-specified mile-radius form the user-specified zipcode.
        // A list of usable zipcodes is made from the results of the get request. Store locally.
        // Empty SEARCH_ENTRIES.
        // (Server -> GET all entries that have one of the zipcodes from the list).
        // For each entry returned:
        // Fill SEARCH_ENTRIES storage locally.
        // Display Name, Role, Address, Contact Name, Description. Then a View Entry button and (when applicable) Update Entry button.
        $(".search_entry_section").on("submit", "form", function(event) {
            console.log("handleSearchButtonClick runs");
            event.preventDefault();
            checkAuthorizedUser();
            const form_inputs = gatherUserInputs(`search_entry_section`);
            let verified = verifyAcceptableUserInputs(form_inputs);
            if (!verified) {
                console.log(`something wasn't filled out properly.`);   
            } else {
                return getNearbyZipcodes(form_inputs)
                .then(zipcodes => {
                    console.log(zipcodes);
                    const role = form_inputs["entryRole"].value;
                    return getSearchEntries(zipcodes, role);
                })
                .then(() => {
                    console.log(SEARCH_ENTRIES);    
                    CURRENT_ENTRY_SOURCE = SEARCH_ENTRIES;
                    unhideSection(`search_results_section`);
                    return displaySearchResultSection();
                });
            }
        });
    }

    function getNearbyZipcodes(form_inputs) {
        // Given a zipcode and mile radius provided by the user, makes a GET requet to Geonames API for closest zipcodes.
        // Returns a promise with an array of zipcodes.
        let zipCodes = [];
        console.log(form_inputs);

        let username = "corunnery";                 // Account established through Cory!
        let country = "US";                         // We are assuming we're working in the United States for now.
        let zipCode = form_inputs["searchZipcode"].value;
        let radius = (form_inputs["searchMileRadius"].value * 1.60934);   // Converting the miles from the user to kilometers for the API.
        let maxRows = "10";
        let query = `username=${username}&country=${country}&postalcode=${zipCode}&radius=${radius}&maxRows=${maxRows}`;
        return fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?${query}`)
            .then(response => response.json())
            .then(data => {
            if (data[`postalCodes`]) {
                data[`postalCodes`].forEach(function(area) {
                    zipCodes.push(area.postalCode);
                });
            }
            return zipCodes;
        })
        .catch(error => {
            alert(`GeoNames API not returning everything properly.`);
            return zipCodes;
        });
    }

    function getSearchEntries(zipCodes, role) {
        // Given an array of zipcodes and a string role, this makes a GET request for all entries in database with zipcode and role.
        // Getting serialized information on the entries of a specific zipcode to store in SEARCH_ENTRIES.
        //!!!!!! GET request!!
        if (zipCodes.length === 0) {
            notifyUser(`No areas were found near ${FORM_INPUTS["Zipcode"].value}.`)
            return Promise.reject();
        } else {
            SEARCH_ENTRIES = {};
            const concurrentPromises = [];
            console.log(zipCodes);
            zipCodes.forEach(zipcode => {
                const zipPromise = new Promise((resolve, reject) => {
                    return getEntriesByZipcode(zipcode, role);
                })
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error.message);
                });
                concurrentPromises.push(zipPromise);
            });
            
            return Promise.all(concurrentPromises)
            .then(() => {
                console.log(`getSearchEntries successful.`);
                return;
            })
            .catch((error) => {
                console.log(`getSearchEntries error: `, error.message);
                return error.message;
            });
        }
    }

    function getEntriesByZipcode(zipcode, role) {
        console.log(`ran getEntriesByZipcode`);
        // Given a zipcode and role, makes a request to the server and pushes those entries into SEARCH_ENTRIES.
        const query = {
            entryZipcode : zipcode,
            entryRole : role
        }
        $.get(`/entries`, query, function(data, status) {
            for (let entry in data.entries) {
                console.log(entry);
                console.log(entry);
                SEARCH_ENTRIES.push();
            }
        })
        .then(() => {
            console.log(`arrived at end of getEntryiesByZipcode successfully`);
            return;
        })
        .catch(error => {
            console.log(`getEntriesByZipcode error`, error.message);
            return error.message;
        });

        //SEARCH_ENTRIES = TEMP_SEARCH_ENTRIES;                   // temporary.
    }

    function displaySearchResultSection() {
        // Display each entry from SEARCH_ENTRIES.
        $(`.search_results_section`).html(
            `<h2>Results: ${SEARCH_ENTRIES.length} entries.</h2>
            <ul></ul>`
        );
        SEARCH_ENTRIES.forEach(entry => {
            $(`.search_results_section ul`).append(
                `<li class="entry">
                <h3>${entry.entryName}</h3>
                <p>Role: ${entry.entryRole}</p>
                <h4>Address: ${stringifyEntryAddress(entry.entryAddress)}</h4>
                <p>Contact: ${entry.entryUserFullName}</p>
                <p>Description: ${entry.entryDescription}</p>
                <button class="view_entry_button" title="View Entry Button" value="${entry.entryId}">View</button>
                `
            );
            if (entry.entryUsersId === USER.userId) {
                $(`.search_results_section ul`).append(
                    `<button class="update_entry_button" title="Update Entry Button" value="${entry.entryId}">Update</button>`
                );
            }
            $(`.search_results_section ul`).append(`
            </li>
            `);
        });    
    }

    function handleSubmitNewEntryButtonClick() {
        // When user clicks the Submit New Entry button on the Create New Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number, email has @, OPTIONAL phone number verified).
        // If fields not valid, notify the user. Stop.
        // !!!!!!!!! (Server => POST this entry into Entries).
        // Add to USER_ENTRIES locally. Add entryId to USER's entries.
        // Hide current section's HTML.
        // Refill, unhide View Entry section's HTML (with relevant entryId's info).
        // Display almost everything for the entry.
        $(".create_new_entry_section").on("submit", "form", function(event) {
            console.log("handleSubmitNewEntryButtonClick runs");
            event.preventDefault();
            checkAuthorizedUser();
            const form_inputs = gatherUserInputs(`create_new_entry_section`);
            let verified = verifyAcceptableUserInputs(form_inputs);
            if (!verified) {
                console.log(`something wasn't filled out properly`);   
            }
            else {
                let entryInfo = packageInputsIntoObject(form_inputs);
                entryInfo = assignMiscInfo(entryInfo);
                postEntryToDatabase(entryInfo);
                entryInfo = getEntryIdFromDatabase(entryInfo);
                CURRENT_ENTRY = entryInfo;
                addEntryToUserEntries(entryInfo);
                addEntryIdToUserInfo(entryInfo);
                hideAllSections();
                unhideSection(`view_entry_section`);
                CURRENT_ENTRY_SOURCE = USER_ENTRIES;
                displayViewEntrySection();
            }
        });
    }

    function packageInputsIntoObject(form_inputs) {
        // Using form_inputs to create the object to send.  The "entryAddress" property has an object value, so must evaluate each property in 
        // the "entryAddress" object as well.
        let information = {};
        Object.keys(form_inputs).forEach(key => {
            console.log(key);
            if (key === "entryAddress") {
                const addressObject = form_inputs["entryAddress"]['value'];
                information["entryAddress"] = {};

                Object.keys(addressObject).forEach(addressKey => {
                    console.log(addressKey);
                    information["entryAddress"][addressKey] = addressObject[addressKey][`value`];
                });
            } else {
                information[key] = form_inputs[key][`value`];
            }
        });
        console.log(information);
        return information;
    }

    function assignMiscInfo(entryInfo) {
        // Gives the entry the date it was made, as well as the entryUserId from the user that just made the entry.
        const date = new Date();
        entryInfo[`entryCreationDate`] = date.toDateString().substring(4);
        entryInfo[`entryUsersId`] = USER.userId;
        return entryInfo;
    }

    function postEntryToDatabase(entryInfo) {
        // Post entry (entryInfo) into the server database.
        
        // $.post(`/entries'?, function(res, rej) {

        //})
    }

    function getEntryIdFromDatabase(entryInfo) {
        // (This function is run after the entry is sumbitted to the database and given a unique Id), Gets the unique Id from the database
        // and gives the property to entryInfo.  Then returns entryInfo.
        // $.get(`/entries`, function(response) {

        //})
        entryInfo[`entryId`] = "9999";    // temporary code until get request can be made.
        return entryInfo;
    }

    function addEntryToUserEntries(entryInfo) {
        // Add entry to USER_ENTRIES.  Realistically, should never find an entry with the entryId in USER_ENTRIES already.
        let newEntry = true;
        for (let entry in USER[`userEntryIds`]) {
            if (entry[`entryId`] === entryInfo[`entryId`]) {
                newEntry = false;
            }
        }
        if (newEntry === true) {
            USER_ENTRIES.push(entryInfo);
        }
    }
    
    function addEntryIdToUserInfo(entryInfo) {
        // Adds the new entryId from created entry into user's entries. Only does so if entryId does not exist with user yet.
        let newEntry = true;
        for (let entry in USER[`userEntryIds`]) {
            if (entry[`entryId`] === entryInfo[`entryId`]) {
                newEntry = false;
            }
        }
        if (newEntry === true) {
            USER.userEntryIds.push(entryInfo.entryId);
        }
    }

    function handleSubmitUpdatedEntryButtonClick() {
        // When user clicks the Submit Updated Entry button on the Update Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number).
        // If fields not valid, notify the user. Stop.
        // (Server => PUT the updated information into this entry in Entries).
        // Add to USER_ENTRIES locally.
        // Hide current section's HTML.
        // Refill, unhide View Entry section's HTML (with relevant entryId's info).
        // Display almost everything for the entry.
        $(".update_entry_section").on("submit", "form", function(event) {
            console.log("handleSubmitUpdatedEntryButtonClick runs");
            event.preventDefault();
            checkAuthorizedUser();
            const form_inputs = gatherUserInputs(`update_entry_section`);
            let verified = verifyAcceptableUserInputs(form_inputs);
            if (!verified) {
                console.log(`something wasn't filled out properly`); 
            }
            else {
                const entryId = $(event.currentTarget).attr("value");
                let updateInfo = packageInputsIntoObject(form_inputs);
                updatedEntry = combineEntryInfoAfterUpdate(updateInfo);
                updateEntryToDatabase(updatedEntry);
                
                CURRENT_ENTRY = updatedEntry;
                updateEntryInUserEntries(updatedEntry);
                addEntryIdToUserInfo(updatedEntry);
                hideAllSections();
                unhideSection(`view_entry_section`);
                CURRENT_ENTRY_SOURCE = USER_ENTRIES;
                displayViewEntrySection();
            }
        });
    }

    function combineEntryInfoAfterUpdate(updateInfo) {
        // Combines the updateInfo with the current information of CURRENT_ENTRY, returning the updatedEntry.
        let updatedEntry = CURRENT_ENTRY;
        Object.keys(updateInfo).forEach(input => {
            if (input === "entryAddress") {
                Object.keys(updateInfo[`entryAddress`]).forEach(addressInput => {
                    updatedEntry[`entryAddress`][addressInput] = updateInfo[`entryAddress`][addressInput];
                });
            } else {
                updatedEntry[input] = updateInfo[input];
            }
        });
        const date = new Date();
        updatedEntry[`entryLastUpdatedDate`] = date.toDateString().substring(4);
        return updatedEntry;
    }

    function updateEntryToDatabase(entryInfo) {
        // PUT (ie update) entry in the server database.
        // $.put(`/entries/${entryInfo.entryId}'?, function(res, rej) {

        //})
    }

    function updateEntryInUserEntries(updatedEntry) {
        // Find entryId from USER_ENTRIES and refill information.
        // Doesn't replace fields one by one; simply replaces the entire entry.  Could alter if needed.
        console.log(`ran updateEntryLocally`);

        let userEntryIndex = USER_ENTRIES.find((entry, index) => {
            console.log(index);
            console.log(entry);
            if (updatedEntry.entryId === entry.entryId) {
                return index;
            }
        });
        USER_ENTRIES[userEntryIndex] = updatedEntry;
    }

    function handleDeleteButtonClick() {
        // When the delete button is clicked while the user views it, 
        $("main").on("click", ".delete_entry_button", function(event) {
            console.log("handleDeleteButtonClick runs");
            checkAuthorizedUser();
            if (confirm(`Are you sure you want to delete this entry?`)) {
                const entryIdToDelete = $(event.currentTarget).attr("value");       // the entry's entryId was stored in value.

                deleteEntryInDatabase(entryIdToDelete);
                deleteEntryInUserEntries(entryIdToDelete);
                deleteEntryIdInUserInfo(entryIdToDelete);

                loadStatusSection();
            }
        });
        /*
        // delete from server database
        // delete from USER_ENTRIES
                hideAllSections();
                unhideSection(`view_entry_section`);
                CURRENT_ENTRY_SOURCE = USER_ENTRIES;
                displayViewEntrySection();
        */
    }

    function deleteEntryInDatabase(entryId) {
        // Makes a DELETE request to the database for the id specified.
    }

    function deleteEntryInUserEntries(entryId) {
        // Removes the entry from USER_ENTRIES using the id specified.
    }

    function deleteEntryIdInUserInfo(entryId) {
        // Removes the entryId from the USER 's userEntryIds.
    }

    $(initializePage());
}

$(main());
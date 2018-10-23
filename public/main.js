
// Functions separated into groups (1: Initial page loading functions, 2: Page specific functions,
// 3: API request functions, 4: Global storage functions, 5: Versatile functions)

function main() {
    let JWT_KEY;
    let USERNAME;

    let USER;
    let USER_ENTRIES;
    let SEARCH_ENTRIES;
    let CURRENT_ENTRY;
    let CURRENT_ENTRY_SOURCE;

    function initializePage() {

        establishCredentials();

        checkAuthorizedUser()
        .then(() => {
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
            handleBackButtonClick();

            getUserInfo()
            .then(() => {
                loadSideNavigation();
                loadStatusSection();
            });
        })
        .catch(() => {
            loadLoginPage();
        }); 
    }

    function loadLoginPage() {
        // Load and move to the Login page HTML in the browser.
        window.location = "/index.html";
    }

    //////////////////// 1: Initial page loading functions (besides the event handling functions) /////////////////////////////
    function establishCredentials() {
        // Load, then remove credentials passed on from the index.js save to localStorage.  To retain JWT key and username.
        JWT_KEY = localStorage.getItem(`harvest_united_jwt`);
        USERNAME = localStorage.getItem(`harvest_united_username`);
        localStorage.removeItem(`harvest_united_jwt`);
        localStorage.removeItem(`harvest_united_username`);
    }

    function checkAuthorizedUser() {
        // Verifies the current jwt works, also refreshes the JWT for the user.
        const jwt = JWT_KEY;

        return fetch(`/auth/refresh`, {method : "POST", headers : {"Authorization" : `Bearer ${jwt}`}})
        .then(response => response.json())
        .then(res => {
            JWT_KEY = res.authToken;
        })
        .catch(() => {
            // Could potentially use this response if we wish to notify the user of the timeout when booted. Is this implied?
            //localStorage.setItem(`harvest_united_status`, `Local session timed out.`);
            loadLoginPage();
        }); 
    }

    function getUserInfo() {
        // User's already logged in.  Getting serialized information on the user to store locally (USER).
        const jwt = JWT_KEY;
        const username = USERNAME;
        
        return fetch(`/users?username=${username}`, {method : "GET", headers : {"Authorization" : `Bearer ${jwt}`}})
        .then(response => response.json())
        .then(res => {
            USER = res[0];
        })
        .catch(error => {
            notifyUser(`Unable to retrieve your user info. Logout and try again.`);
        });
    }
    
    function loadSideNavigation() {
        // Establishes the side navigation bar to be operable. (however, display:none until screen is small).
        $(document).ready(function(){
            $('.sidenav').sidenav();
        });
    }

    function getUserEntries() {
        // Getting serialized information on the entries of a specific entryUserId (the current user's userId)
        // to store locally.
        const user_entries_promise = new Promise((resolve, reject) => {
            $.get(`/entries?entryUsersId=${USER.userId}`, function(data, status) {
                if (status === `success`) {
                    USER_ENTRIES = data;
                    resolve();
                } else {
                    reject();
                }
            });
        });
        return user_entries_promise;
    }

    ////////////////////  2: Page specific functions  /////////////////////////////

    function handleStatusTabClick() {
        // When user clicks the Status Tab: loads the Status Section.
        // OPTIONAL improvement: Entries.sort().
        $(".status_tab").click(function(event) {
            checkAuthorizedUser()
            .then(() => {
                loadStatusSection();
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            });
        });
    }

    function loadStatusSection() {
        // Gathers USER_ENTRIES, then displays them if they're present.
        // This function can load the HTML by clicking the Status Tab (route from handleStatusTabClick) 
        // or from intial page load (initializePage).
        getUserEntries()
        .then(() => {
            hideAllSections();
            unhideSection(`status_section`);
            setFrontPageImageHeight(`status_section`);
            CURRENT_ENTRY_SOURCE = `USER_ENTRIES`;
            if (USER_ENTRIES.length > 0) {
                displayStatusSection();
            } else {
                displayEmptyStatus();
            }
        })
        .catch(() => {
            notifyUser(`Unable to find your entries.  Logout and try again.`);
        });
    }

    function displayStatusSection() {
        // Fills in the HTML of .status_section.  Pulls data from locally stored USER_ENTRIES to display each entry.
        $(`.status_section`).html(
        `<h3><strong>Status Page of ${USER.userFullName}<strong></h3>
        <ul></ul>`
        );
        USER_ENTRIES.forEach(entry => {
            $(`.status_section ul`).append(
                `<li class="entry">
                <div class="row">
                    <div class="col s12 m10 offset-m1">
                        <div class="card">
                            <div class="card-content">
                                <h4 class="card-title">${entry.entryName}</h4>
                                <p class="float-right"><b>Role:</b> ${entry.entryRole}</p>
                                <p><b>Address:</b> ${stringifyEntryAddress(entry.entryAddress)}</p>
                                <p><b>Contact:</b> ${entry.entryUserFullName}</p>
                                <p><b>Description:</b> ${entry.entryDescription}</p>
                            </div>
                            <div class="card-action">
                                <button class="view_entry_button waves-effect waves-light btn" title="View Entry Button" value="${entry.entryId}">View</button>
                                <button class="update_entry_button waves-effect waves-light btn" title="Update Entry Button" value="${entry.entryId}">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                </li>`
            );
        });
    }

    function displayEmptyStatus() {
        // Fills in the HTML of .status_section.
        $(`.status_section`).html(
        `<h3><strong>Status Page of ${USER.userFullName}</strong></h3>
        <p>You currently have no entries listed, but we have an example entry below.</p>
        <p>Click on the Create Entry tab to create a new entry!</p>
        <ul></ul>`
        );
        $(`.status_section ul`).append(
            `<li class="entry">
            <div class="row">
                <div class="col s12 m10 offset-m1">
                    <div class="card">
                        <div class="card-content">
                            <h4 class="card-title">Bob's Market</h4>
                            <p class="float-right"><b>Role:</b> Receiver</p>
                            <p><b>Address:</b> 123 Oak Avenue</p>
                            <p><b>Contact:</b> Bob Smith</p>
                            <p><b>Description:</b> We're a local food market on the west side of Austin.</p>
                        </div>
                        <div class="card-action">
                            <button disabled class="view_entry_button waves-effect waves-light btn" title="View Entry Button">View</button>
                            <button disabled class="update_entry_button waves-effect waves-light btn" title="Update Entry Button">Update</button>
                        </div>
                    </div>
                </div>
            </div>
            </li>
        `);
    }

    function handleCreateNewEntryTabClick() {
        // When user clicks the Create Entry Tab, shows .create_new_entry_section.
        $(".create_new_entry_tab").click(function(event) {
            checkAuthorizedUser()
            .then(() => {
                hideAllSections();
                unhideSection(`create_new_entry_section`);
                setFrontPageImageHeight('create_new_entry_section');
                CURRENT_ENTRY_SOURCE = `USER_ENTRIES`;
                displayCreateNewEntrySection();
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
        });
    }

    function displayCreateNewEntrySection() {
        // Fills in the HTML of .create_new_entry_section.  Autofills data from locally stored USER to help.
        $(`.create_new_entry_section`).html(
            `<h3>Create New Entry</h3>
            <form role="form" action="#" class="form">
                <fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" id="radio_donator" required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" id="radio_receiver" required>
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
                    <input type="email" name="entryUserEmail" placeholder="bobsmith@place.com" id="input_entry_contact_email" value="${USER.userEmail}" required>
                    <label for="input_entry_contact_phoneNumber">Phone Number:</label>
                    <input type="text" name="entryUserPhoneNumber" placeholder="123-456-7890" id="input_entry_contact_phoneNumber" value="${USER.userPhoneNumber}" required>
                </fieldset>
                <label for="input_entry_foodAvailable">Food Available:</label>
                <input type="text" name="entryFoodAvailable" placeholder="Several dozen bagels weekly.  Several gallons of milk weekly." id="input_entry_foodAvailable">
                <button type="submit" class="submit_new_entry_button waves-effect waves-light btn" title="Submit New Entry Button">Create Entry</button>
            </form>`
        );
    }

    function handleSearchEntryTabClick() {
        // When user clicks the Search Entry Tab, shows the search_entry_section.
        $(".search_entry_tab").click(function(event) {
            checkAuthorizedUser()
            .then(() => {
                hideAllSections();
                unhideSection(`search_entry_section`);
                setFrontPageImageHeight('search_entry_section');
                displaySearchEntrySection();
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
            
        });
    }

    function displaySearchEntrySection() {
        // Fills in the HTML of .create_new_entry_section.  Autofills data from locally stored USER to help.
        $(`.search_entry_section`).html(
            `<h3>Search Entries</h3>
            <form role="form" class="form" id="search_form">
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
                    <button type="submit" class="search_button waves-effect waves-light btn" title="Start Search Button" >Start Search</button>
                </fieldset>
            </form>`
        )
    }

    function handleLogoutTabClick() {
        // When user clicks the Logout Tab, asks for confirmation of log out, loads login page if confirmed.
        $(".logout_tab").click(function(event) {
            if (confirm("Click OK to confirm log out.")) {
                // Clicks OK.
                // Could potentially use this response if we wish to notify the user of a successful logout. Is this implied?
                // localStorage.setItem(`harvest_united_status`, `User signed out.`);
                loadLoginPage();
            }
        });
    }

    function handleViewEntryButtonClick() {
        // When user clicks the View Entry button (within Status Page or Search Page), obtain entryId from button.
        // Gets relevant entry info from server and shows it in view_entry_section.
        $("main").on("click", ".view_entry_button", function(event) {
            checkAuthorizedUser()
            .then(() => {
                getEntryInfoFromEntryId($(event.currentTarget).attr("value"));  // the entry's entryId was stored in value.
                hideAllSections();
                unhideSection(`view_entry_section`);
                setFrontPageImageHeight('view_entry_section');
                displayViewEntrySection();
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
            
        });
    }

    function displayViewEntrySection() {
        // Fills in the HTML of .view_entry_section.  Uses data from CURRENT_ENTRY.
        if (CURRENT_ENTRY_SOURCE === `SEARCH_ENTRIES`) {
            $(`.view_entry_section`).html(
                `<button class="back_button return_back_to_search_results waves-effect waves-light btn right" title="Back Button">Go Back</button>`
            );
        } else { // Then (CURRENT_ENTRY_SOURCE === `USER_ENTRIES`)
            $(`.view_entry_section`).html(
                `<button class="back_button return_back_to_user_entries waves-effect waves-light btn right" title="Back Button">Go Back</button>`
            );
        }
        
        $(`.view_entry_section`).append(
            `<h3><strong>Entry: ${CURRENT_ENTRY.entryName}</strong></h3>
            <p><b>Role:</b> ${CURRENT_ENTRY.entryRole}</p>
            <h4 class="view_entry_entryAddress">${stringifyEntryAddress(CURRENT_ENTRY.entryAddress)}</h4>
            <div class="view_entry_contact_info">
                <p><em>Contact:</em> ${CURRENT_ENTRY.entryUserFullName}</p>
                <p><em>Contact's E-mail:</em> ${CURRENT_ENTRY.entryUserEmail}</p>
                <p><em>Contact's Phone Number:</em> ${CURRENT_ENTRY.entryUserPhoneNumber}</p>
            </div>
            <p><b>Date Created:</b> ${CURRENT_ENTRY.entryCreationDate}</p> 
            <p><b>Description:</b> ${CURRENT_ENTRY.entryDescription}.</p>
            <p class="view_entry_foodAvailable"><b>Food Available:</b> ${CURRENT_ENTRY.entryFoodAvailable}</p>`

        );
        //Only shows delete/update buttons if entry's userId = id of logged-in user.
        if (CURRENT_ENTRY.entryUsersId === USER.userId) {
            $(`.view_entry_section`).append(
                `<button class="update_entry_button waves-effect waves-light btn" title="Update Entry Button" value="${CURRENT_ENTRY.entryId}">Update</button>
                <button class="delete_entry_button waves-effect waves-light btn" title="Delete Entry Button" value="${CURRENT_ENTRY.entryId}">Delete</button>`

            );
        }
    }

    function handleUpdateEntryButtonClick() {
        // When user clicks on the Update Entry button on the Status, Search, or View Entry pages, get the entryId from the button clicked.
        // Shows the relevant entry in the update_entry_section.
        // Set the values in the respective fields to the entries previous information (from entryId's info in USER_ENTRIES).
        $("main").on("click", ".update_entry_button" ,function(event) {
            checkAuthorizedUser()
            .then(() => {
                getEntryInfoFromEntryId($(event.currentTarget).attr("value"));  // the entry's entryId was stored in value.
                hideAllSections();
                unhideSection(`update_entry_section`);
                setFrontPageImageHeight('update_entry_section');
                displayUpdateEntrySection();
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
        });
    }

    function displayUpdateEntrySection() {
        // Fills in the HTML of .update_entry_section.  Uses data from CURRENT_ENTRY.
        $(`.update_entry_section`).html(
            `<h3>Update Entry for ${CURRENT_ENTRY.entryName}</h3>
            <form role="form" action="#" class="form" id="update_entry_form"></form>
            <div class="extra_button_container">
                <button class="view_entry_button waves-effect waves-light btn" title="View Entry Button" value="${CURRENT_ENTRY.entryId}">View</button>
                <button class="delete_entry_button waves-effect waves-light btn" title="Delete Entry Button" value="${CURRENT_ENTRY.entryId}">Delete</button>
            </div>`
        );
        if (CURRENT_ENTRY.entryRole === `Donator`) {        // Then the `Donator` value is checked.
            $(`.update_entry_section form`).append(
                `<fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" id="radio_donator" checked required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" id="radio_receiver" required>
                    <label for="radio_receiver">Receiver</label>
                </fieldset>`
            );
        } else 
        if (CURRENT_ENTRY.entryRole === `Receiver`) {
            $(`.update_entry_section form`).append(      // Then the `Receiver` value is checked.
                `<fieldset>
                    <legend>Is this location a donator or receiver?</legend>
                    <input type="radio" name="entryRole" value="Donator" id="radio_donator" required>
                    <label for="radio_donator">Donator</label>
                    <input type="radio" name="entryRole" value="Receiver" id="radio_receiver" checked required>
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
                    <input type="email" name="entryUserEmail" value="${CURRENT_ENTRY.entryUserEmail}" id="input_entry_contact_email" required>
                    <label for="input_entry_contact_phoneNumber">Phone Number:</label>
                    <input type="text" name="entryUserPhoneNumber" value="${CURRENT_ENTRY.entryUserPhoneNumber}" id="input_entry_contact_phoneNumber" required>
                </fieldset>
                <label for="input_entry_foodAvailable">Food Available:</label>
                <input type="text" name="entryFoodAvailable" value="${CURRENT_ENTRY.entryFoodAvailable}" id="input_entry_foodAvailable">
                <button type="submit" class="submit_updated_entry_button waves-effect waves-light btn" title="Submit Updated Entry Button" value="${CURRENT_ENTRY.entryId}">Update Entry</button>`   
        );
    }

    function hanldeSearchButtonClick() {
        // When user clicks the Search button on the Search Page, validates fields, then Obtains a list of zipcodes close to
        // the entered zipcode, stored locally. Gather ten closest zip codes from requested zip code.
        // A list of usable zipcodes is made from the results of the get request. Store locally.
        // For each zipcode returned: Gets entries from server and stores in SEARCH_ENTRIES. Shows the results.
        $(".search_entry_section").on("submit", "form", function(event) {
            event.preventDefault();
            checkAuthorizedUser()
            .then(() => {
                const form_inputs = gatherUserInputs(`search_entry_section`);
                if (verifyAcceptableUserInputs(form_inputs)) {
                    getNearbyZipcodes(form_inputs)
                    .then(zipcodes => {
                        return getSearchEntries(zipcodes, form_inputs);
                    })
                    .then((arrayOfarrayofEntries) => {
                        const entries = arrayOfarrayofEntries.reduce(function(accumulation, current) {
                            accumulation.push(...current);
                            return accumulation;
                        }, []);

                        CURRENT_ENTRY_SOURCE = `SEARCH_ENTRIES`;
                        SEARCH_ENTRIES = entries;
                        unhideSection(`search_results_section`);
                        displaySearchResultSection(entries);
                    })
                    .catch(() => {
                        notifyUser(`Invalid zipcode entered. Please try again.`);
                    });
                }
            })
            .catch(() => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            });
        });
    }

    function displaySearchResultSection(entries) {
        // Display each entry from SEARCH_ENTRIES.
        $(`.search_results_section`).html(
            `<h3><strong>Results: ${entries.length} entries.</strong></h3>
            <ul></ul>`
        );
        entries.forEach(entry => {
            $(`.search_results_section ul`).append(
                `<li class="entry">
                <div class="row">
                    <div class="col s12 m10 offset-m1">
                        <div class="card">
                            <div class="card-content">
                                <h4 class="card-title">${entry.entryName}</h4>
                                <p class="right"><b>Role:</b> ${entry.entryRole}</p>
                                <p><b>Address:</b> ${stringifyEntryAddress(entry.entryAddress)}</p>
                                <p><b>Contact:</b> ${entry.entryUserFullName}</p>
                                <p><b>Description:</b> ${entry.entryDescription}</p>
                            </div>
                            <div class="card-action card-action-${entry.entryId}">
                                <button class="view_entry_button waves-effect waves-light btn" title="View Entry Button" value="${entry.entryId}">View</button>
            `);
            if (entry.entryUsersId === USER.userId) {
                $(`.search_results_section .card-action-${entry.entryId}`).append(
                    `<button class="update_entry_button waves-effect waves-light btn" title="Update Entry Button" value="${entry.entryId}">Update</button>`
                );
            }
            $(`.search_results_section ul`).append(`
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            `);
        });    
    }

    function handleSubmitNewEntryButtonClick() {
        // When user clicks the Submit New Entry button on the Create New Entry page, validates inputs, then posts
        // the entry into the database. Also updates the user's entries locally.
        // Add to USER_ENTRIES locally. Add entryId to USER's entries.  Shows user the entry.
        $(".create_new_entry_section").on("submit", "form", function(event) {
            event.preventDefault();
            checkAuthorizedUser()
            .then(() => {
                const form_inputs = gatherUserInputs(`create_new_entry_section`);
                if (verifyAcceptableUserInputs(form_inputs)) {
                    let entryInfo = packageInputsIntoObject(form_inputs);
                    entryInfo = assignMiscInfo(entryInfo);
                    const postPromise = postEntryToDatabase(entryInfo);

                    postPromise
                    .then(entryInfo => {
                        // Note, entryInfo now also has entryId.
                        CURRENT_ENTRY = entryInfo;
                        addEntryToUserEntries(entryInfo); 
                        hideAllSections();
                        unhideSection(`view_entry_section`);
                        setFrontPageImageHeight('view_entry_section');
                        CURRENT_ENTRY_SOURCE = `USER_ENTRIES`;
                        displayViewEntrySection();
                        M.toast({html: 'Entry created!'});
                    })
                    .catch(error => {
                        notifyUser(`Cannot submit a new entry at this time. Please check in later.`);
                    });
                }
            })
            .catch(() => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
        });
    }

    function packageInputsIntoObject(form_inputs) {
        // Using form_inputs {id: x, name: y, type: z, value: n} to create the object to send.  The "entryAddress" property has an object value, 
        // so must evaluate each property in the "entryAddress" object as well.
        // The reason gatherUserInputs wasn't made to just display name : value (removing the necessity of this function packageInputs) 
        // was versatility;  form_inputs is used for it's id/type in highlighting fields.
        let information = {};
        Object.keys(form_inputs).forEach(key => {
            if (key === "entryAddress") {
                const addressObject = form_inputs["entryAddress"]['value'];
                information["entryAddress"] = {};

                Object.keys(addressObject).forEach(addressKey => {
                    information["entryAddress"][addressKey] = addressObject[addressKey][`value`];
                });
            } else {
                information[key] = form_inputs[key][`value`];
            }
        });
        return information;
    }

    function assignMiscInfo(entryInfo) {
        // Gives the entry the date it was made, as well as the entryUserId from the user that just made the entry.
        const date = new Date();
        entryInfo[`entryCreationDate`] = date.toDateString().substring(4);
        entryInfo[`entryUsersId`] = USER.userId;
        return entryInfo;
    }

    function handleSubmitUpdatedEntryButtonClick() {
        // When user clicks the Submit Updated Entry button on the Update Entry page, validates fields, then updates the information
        // in the server. Makes the edits to the locally stored entry as well. Shows the updated entry.
        $(".update_entry_section").on("submit", "#update_entry_form", function(event) {
            event.preventDefault();
            checkAuthorizedUser()
            .then(() => {
                const form_inputs = gatherUserInputs(`update_entry_section`);
                if (verifyAcceptableUserInputs(form_inputs)) {
                    const entryId = $(event.currentTarget).attr("value");
                    let updateInfo = packageInputsIntoObject(form_inputs);
                    updatedEntry = combineEntryInfoAfterUpdate(updateInfo);
                    
                    updateEntryToDatabase(updatedEntry)
                    .then((res) => {
                        CURRENT_ENTRY = updatedEntry;
                        updateEntryInUserEntries(updatedEntry);
                        hideAllSections();
                        unhideSection(`view_entry_section`);
                        setFrontPageImageHeight('view_entry_section');
                        displayViewEntrySection();
                        M.toast({html: 'Entry updated!'});
                    })
                    .catch(error => {
                        notifyUser(`Unable to update the entry. Please refresh and try again.`);
                    });
                }
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
            
        });
    }

    function combineEntryInfoAfterUpdate(updateInfo) {
        // Updates our CURRENT_ENTRY with the updateInfo object provided, returning the updatedEntry.
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

    function handleDeleteButtonClick() {
        // When the delete button is clicked while the user views it, removes the entry from the database and USER_ENTRIES.
        $("main").on("click", ".delete_entry_button", function(event) {
            checkAuthorizedUser()
            .then(() => {
                if (confirm(`Are you sure you want to delete this entry?`)) {
                    const entryIdToDelete = $(event.currentTarget).attr("value");       // the entry's entryId was stored in value.

                    deleteEntryInDatabase(entryIdToDelete)
                    .then(() => {
                        deleteEntryInUserEntries(entryIdToDelete);
                        deleteEntryInSearchEntries(entryIdToDelete);

                        loadSourceSection();
                        M.toast({html: 'Entry deleted.'});
                    })
                    .catch(error => {
                        notifyUser(`Unable to find the entry. Refresh and try again.`);
                    });
                }
            })
            .catch(error => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            }); 
        });
    }

    function handleBackButtonClick() {
        // When user clicks the back button on the View Entry or Update Entry sections, sends user back to previous section.
        $(`.view_entry_section`).on(`click`, `.back_button`, function() {
            checkAuthorizedUser()
            .then(() => {
                loadSourceSection();
            })
            .catch(() => {
                notifyUser(`Your session appears to have ended. Refresh and try again.`);
            });
        });
    }

    //////////////////// 3: API request functions /////////////////////////////

    function getNearbyZipcodes(form_inputs) {
        // Makes a request to the server, which makes a request to the Zipwise API, 
        // Given zipcode and mile radius in form_inputs, gets 15 nearest zipcodes.
        // Returns a promise with an array of zipcodes.
        let zipcodes = [];
        const quantity = 15;

        let initZipCode = form_inputs["searchZipcode"].value;
        let radius = (form_inputs["searchMileRadius"].value);
        const key = "6g4fkdzmkwnn8axr";                 // Account established through Cory!
        const country = "U";                         // We are assuming we're working in the United States for now.
        return fetch(`https://www.zipwise.com/webservices/radius.php?key=${key}&zip=${initZipCode}&radius=${radius}&country=${country}&format=json`)
        .then(response => response.json())
        .then(data => {
            const areas = data.results.slice(0, quantity); //results obj is an array of objects, each object has a "zip" key, among other things.
            areas.forEach(function(area) {
                zipcodes.push(area.zip);
            });
            return zipcodes;
        })
        .catch(error => {
            alert(`Zipwise API not returning everything properly.`);
            return error;
        });
    }

    function getSearchEntries(zipCodes, form_inputs) {
        // Given an array of zipcodes and a string role, this makes a GET request for all entries in database with zipcode and role.
        // Getting serialized information on the entries of a specific zipcode to store in SEARCH_ENTRIES.
        const role = form_inputs["entryRole"].value;
        if (zipCodes.length === 0) {
            notifyUser(`${form_inputs["searchZipcode"].value} is not a valid zipcode!`);
            return Promise.reject();
        } else {
            const concurrentPromises = zipCodes.map(zipcode => {
                return getEntriesByZipcode(zipcode, role);
            });
            
            return Promise.all(concurrentPromises)
            .then(res => {
                return res;
            })
            .catch((error) => {
                return error.message;
            });
        }
    }

    function getEntriesByZipcode(zipcode, role) {
        // Given a single zipcode and role, makes a GET request to the server for entries.
        return fetch(`/entries?entryZipcode=${zipcode}&entryRole=${role}`, {method : "GET"})
        .then(response => response.json())
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.message;
        });
    }

    function postEntryToDatabase(entryInfo) {
        // Post entry (entryInfo) into the server database.
        return fetch(`/entries`, {method: "POST", body: JSON.stringify(entryInfo), headers : {"content-type": "application/json"}})
        .then(response => response.json())
        .catch(error => {
            return error.message;
        });
    }

    function updateEntryToDatabase(entryInfo) {
        // Updates the entry in the server database.
        return fetch(`/entries/${entryInfo.entryId}`, {method : "PUT", body : JSON.stringify(entryInfo), headers : {"content-type" : "application/json"}})
        .then(response => response.json())
        .then(res => {
            return res;
        })
        .catch(error => {
            return error.message;
        });
    }

    function deleteEntryInDatabase(entryId) {
        // Makes a DELETE request to the database for the id specified.
        return fetch(`entries/${entryId}`, {method : "DELETE"})
        .then(response => response.json())
        .catch(error => {
            return error.message;
        });
    }

    //////////////////// 4: Global storage functions /////////////////////////////

    function addEntryToUserEntries(entryInfo) {
        // Add entry to USER_ENTRIES. First checks to make sure entry isn't in USER_ENTRIES already.
        let newEntry = true;
        for (let entry in USER_ENTRIES) {
            if (entry[`entryId`] === entryInfo[`entryId`]) {
                newEntry = false;
            }
        }
        if (newEntry === true) {
            USER_ENTRIES.push(entryInfo);
        }
    }

    function updateEntryInUserEntries(updatedEntry) {
        // Find entryId from USER_ENTRIES and refill information.
        // Doesn't replace fields one by one; simply replaces the entire entry.  Could alter if needed.
        let userEntryIndex = USER_ENTRIES.find((entry, index) => {
            if (updatedEntry.entryId === entry.entryId) {
                return index;
            }
        });
        USER_ENTRIES[userEntryIndex] = updatedEntry;
    }

    function deleteEntryInUserEntries(deletingEntryId) {
        // Removes the entry from USER_ENTRIES using the id specified.
        let userEntryIndex;
        USER_ENTRIES.forEach((entry, index) => {
            if (deletingEntryId === entry.entryId) {
                userEntryIndex = index;
            }
        });
        if (userEntryIndex !== -1) {
            USER_ENTRIES.splice(userEntryIndex, 1);
        }
    }

    function deleteEntryInSearchEntries(deletingEntryId) {
        // Removes the entry from SEARCH_ENTRIES using the id specified.
        if (CURRENT_ENTRY_SOURCE === `SEARCH_ENTRIES`) {
            let userEntryIndex;
            SEARCH_ENTRIES.forEach((entry, index) => {
                if (deletingEntryId === entry.entryId) {
                    userEntryIndex = index;
                }
            });
            if (userEntryIndex !== -1) {
                SEARCH_ENTRIES.splice(userEntryIndex, 1);
            }
        }
    }

    //////////////////// 5: Versatile functions /////////////////////////////
    function getEntryInfoFromEntryId(id) {
        // Get's the object with entryId "id" from USER_ENTRIES or SEARCH_ENTRIES, depending on which section user was in when accessing entry.
        if (CURRENT_ENTRY_SOURCE === `USER_ENTRIES`) {
            USER_ENTRIES.forEach(entry => {
                if (entry.entryId === id) {
                    CURRENT_ENTRY = entry;
                }
            });
        } else  
        if (CURRENT_ENTRY_SOURCE === `SEARCH_ENTRIES`) {
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
        let verified = true;

        $(`.notification_section`).addClass(`hidden`);
        Object.keys(form_inputs).forEach(function(input) {
            const result = verifyInput(form_inputs[input]);
            if (result !== "Accepted") {
                highlightTextbox(form_inputs[input].id);
                notifyUser(result);
                verified = false;
            } else {
                removeHighlightTextbox(form_inputs[input].id);
            }
        });
        return verified;
    }

    function highlightTextbox(textbox) {
        // Adds CSS to the textbox input (through the highlighted class) to make it stand out to the user, making it clear which textbox needs to be changed.
        $(`#${textbox}`).addClass("highlighted");
    }

    function removeHighlightTextbox(textbox) {
        // Removes CSS to the textbox input (through the highlighted class).
        $(`#${textbox}`).removeClass("highlighted");
    }

    function verifyInput(input) {
        // Reads in input, uses input.name to determine what kind of tests the input must go through to be considered valid.
        let result = "Accepted";
        if (input.type === "text") {
            if ((input.name === "searchMileRadius") && Number.isNaN(parseInt(input.value))) {
                result = "The Mile Radius must be a number.";
            } else
            if (input.name === "searchMileRadius" && parseInt(input.value) > 40) {
                result = "The Mile Radius must be 40 or less.";
            } else
            if ((input.name === "entryZipcode" || input.name === "searchZipcode") && Number.isNaN(parseInt(input.value))) {
                result = "The zipcode must be a number.";
            }
            if ((input.name === "entryZipcode" || input.name === "searchZipcode") && input.value.length !== 5) {
                result = "The zipcode must be five digits long.";
            }
        } else
        if (input.name === `entryAddress`) {
            Object.keys(input.value).forEach(function(addressInput) {
                if ((addressInput === "entryZipcode") && Number.isNaN(parseInt(input[`value`][addressInput].value))) {
                    result = "The zipcode must be a number.";
                }
            });
        }
        return result;
    }

    function loadSourceSection() {
        // Function used after updating or deleting an entry. Depending on whether the user was in the Status section
        // or the Search section prior to updating/deleting an entry, user is returned there.
        if (CURRENT_ENTRY_SOURCE === `USER_ENTRIES`) {
            hideAllSections();
            unhideSection(`status_section`);
            setFrontPageImageHeight('status_section');
            loadStatusSection();
        } else
        if (CURRENT_ENTRY_SOURCE === `SEARCH_ENTRIES`) {
            hideAllSections();
            unhideSection(`search_entry_section`);
            unhideSection(`search_results_section`);
            setFrontPageImageHeight('search_entry_section');
            displaySearchEntrySection();
            displaySearchResultSection(SEARCH_ENTRIES);  // Chose not to simply unhide this section, as it may be updated. Updating HTML.  
        }
    }

    function stringifyEntryAddress(addressObject) {
        // Takes the object addressObject and combines all the address info within it into a single string for the user.
        return `${addressObject.entryStreetAddress}, ${addressObject.entryCity}, ${addressObject.entryState}, ${addressObject.entryZipcode}`;
    }

    function notifyUser(message) {
        // Unhides the notification section and posts the message String.
        unhideSection(`notification_section`);
        $(`.notification_section`).html(`
        <p>${message}</p>
        `);
    };

    function setFrontPageImageHeight(section) {
        // Changes the sizing of the background image and overlay, based on which section is loaded. 
        // Typically longer sections make the background expand to wrap around section.
        if (section === 'create_new_entry_section' || section === 'update_entry_section') {
            $(`#front-image-container`).css("height", `auto`);
        } else {
            $(`#front-image-container`).css("height", `100%`);
        }
    }

    function hideAllSections() {
        // Adds the `hidden` CSS class (which has display:none) from all sections, making them invisible in the HTML.
        const sections = [`notification_section`,`status_section`, `create_new_entry_section`, `search_entry_section`, `search_results_section`, `view_entry_section`, `update_entry_section`];
        sections.forEach(section => {
            $(`.${section}`).addClass(`hidden`);
            $(`.${section}`).empty();
        })
    }

    function unhideSection(section) {
        // Removes the `hidden` CSS class (which has display:none) from the argument `section` to make it visible in the HTML.
        $(`.${section}`).removeClass(`hidden`);
    }

    $(initializePage());
}

$(main());
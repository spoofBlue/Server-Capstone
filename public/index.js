
console.log("Hello index.js");

function main() {
    
    let USER;
    let USER_ENTRIES;
    let SEARCH_ENTRIES;
    let STATUS = {
        "TIMED-OUT" : false ,
        "SUCCESSFULLY-CREATED" : false ,
        "SUCCESSFULLY-UPDATED" : false
    }

    function intializePage() {
        // handleCreateNewAccountButtonClick();
        // handleSubmitNewAccountButtonClick();
        handleLoginButton();
        handleStatusTabClick();
        handleCreateEntryTabClick();
        handleSearchEntryTabClick();
        handleLogoutTabClick();
        handleViewEntryButtonClick();
        handleUpdateEntryButtonClick();
        hanldeSearchButtonClick();
        handleSubmitNewEntryButtonClick();
        handleSubmitUpdatedEntryButtonClick();
    }

    function loadMainPage() {
        // Retrieve token. Speak to server and verify user is logged in (with the token)
        // If there is not a valid token, Redirect to login page 
        // windows.location = main.html
    }

    // Instead of these two steps done before loading a page explicitly: 1. (Server -> Make sure still authenticated).
    // 2. If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
    // We could only rely on loading page middleware to authenticate before loading.

    /*
    *   function handleCreateNewAccountButtonClick() {
    *   console.log("handleCreateNewAccountButton runs");
    *   // When user clicks the Create New Account button: 
    *   // Load the Create New Account Page.
    *   }
    * 
    *   function handleSubmitNewAccountButtonClick() {
    *   console.log("handleSubmitNewAccountButto runs");
    *   // When user clicks the submit button on the Create New Account page:
    *   // Verify fields are filled properly (ex email address has @, OPTIONAl phone number is valid).
    *   // Verify username has not been used before, and password is greater than 8 characters.
    *   // If fields are not valid, notify the user.
    *   // (Server -> POST a new user).
    *   // Load Status page HTML (with userId). No entries will be on the account.
    *   }
    * 
    */

    function loadLoginPage() {
        // Load the Login page HTML.
        // Empty USER, USER_ENTRIES, SEARCH_ENTRIES.
    }

    function handleLoginButton() {
        $(".login_button").click(function(event) {
            console.log("handleLoginButton runs");
            // Make explicit functions instead.
            const username = $(".input_username").val();
            const password = $(".input_password").val();
            window.location = "/main.html";
            /**return {
                username : username,
                password : password
            }**/
        });
        // When user clicks the login button: 
        // Verify through API the username and password are valid. (Server -> check database with find(), authenticate, attach JWT)
        // If failure, let user know. Adding a short <p>.
        // If success, load main page HTML (with userId).
        // (Server -> GET user's serialized information: fullName, Entries)
        // Store user information locally in USER.
        // For each entry in Entries.sort() with the user's ID (Server -> GET entries associated with userId): 
        // Store entry locally in USER_ENTRIES.
        // Display Name, Role, Address, Contact Name, Description.  Then a View Entry button and Update Entry button.
    }

    

    function handleStatusTabClick() {
        $(".status_tab").click(function(event) {
            console.log("handleStatusTabClick runs");
        });
        // When user clicks the Status Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // Refill, unhide Status section's HTML.
        // Empty Entries storage.
        // For each entry in with the user's ID (Server -> GET entries associated with userId): 
        // (Server -> GET entries serialized information: almost everything).
        // OPTIONAL Entries.sort().
        // Fill USER_ENTRIES storage locally.
        // Display Name, Role, Address, Contact Name, Description. Then a View Entry button and Update Entry button.
    }

    function handleCreateEntryTabClick() {
        $(".create_entry_tab").click(function(event) {
            console.log("handleCreateEntryTab runs");
        });
        // When user clicks the Create Entry Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // Refill, unhide Create Entry section's HTML.
        // OPTIONAL Autofill Contact Name, E-mail, Phone Number into form fields.
    }

    function handleSearchEntryTabClick() {
        $(".search_tab").click(function(event) {
            console.log("handleSearchEntryTab runs");
        });
        // When user clicks the Search Entry Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide, current section's HTML.
        // Empty SEARCH_ENTRIES local storage.
        // Refill, unhide Search Entry section's HTML.
    }

    function handleLogoutTabClick() {
        $(".logout_tab").click(function(event) {
            console.log("handleLogoutTabClick runs");
        });
        // When user clicks the Logout Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Show an alert asking "Are you sure?" or something like this.
        // If confirmed logging out (Server -> remove JWT authentication).
        // Load the Login page.
    }

    function handleViewEntryButtonClick() {
        $(".view_entry_button").click(function(event) {
            console.log("handleViewEntryButtonClick runs");
        });
        // When user clicks the View Entry button (within Status Page or Search Page):
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide current section's HTML.
        // Refill, unhide View Entry section's HTML.
        // Display almost everything for the entry (from relevant entryId's info in USER_ENTRIES or SEARCH_ENTRIES, depending on if entryUsersId = userId).
        // If userId matches the entries associated userID, also make the Update Entry button available.
    }

    function handleUpdateEntryButtonClick() {
        $(".update_entry_tab").click(function(event) {
            console.log("handleUpdateEntryButtonClick runs");
        });
        // When user clicks on the Update Entry button on the Status, Search, or View Entry pages:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Hide current section's HTML.
        // Refill, unhide Update Entry section's HTML.
        // Set the values in the respective fields to the entries previous information (from entryId's info in USER_ENTRIES).
    }

    function hanldeSearchButtonClick() {
        $(".search_button").click(function(event) {
            console.log("handleSearchButtonClick runs");
        });
        // When user clicks the Search button on the Search Page:
        // Verify fields are properly filled (ex zipcode is a number, mile radius is a number)
        // If fields not valid. Notify the user. Stop.
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Empty SEARCH_ENTRIES.
        // Make a request to the GeoCoder API to gather all zipcodes within the user-specified mile-radius form the user-specified zipcode.
        // A list of usable zipcodes is made from the results of the get request. Store locally.
        // (Server -> GET all entries that have one of the zipcodes from the list).
        // For each entry returned, Entries.sort perhaps:
        // Fill SEARCH_ENTRIES storage locally.
        // Display Name, Role, Address, Contact Name, Description. Then a View Entry button and (when applicable) Update Entry button.
    }

    function handleSubmitNewEntryButtonClick() {
        $(".submit_new_entry_button").click(function(event) {
            console.log("handleSubmitNewEntryButtonClick runs");
        });
        // When user clicks the Submit New Entry button on the Create New Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number, email has @, OPTIONAL phone number verified).
        // If fields not valid, notify the user. Stop.
        // (Server => POST this entry into Entries).
        // Add to USER_ENTRIES locally. Add entryId to USER's entries.
        // Hide current section's HTML.
        // Refill, unhide View Entry section's HTML (with relevant entryId's info).
        // Display almost everything for the entry.
    }

    function handleSubmitUpdatedEntryButtonClick() {
        $(".submit_updated_entry_button").click(function(event) {
            console.log("handleSubmitUpdatedEntryButtonClick runs");
        });
        // When user clicks the Submit Updated Entry button on the Update Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number, email has @, OPTIONAL phone number verified).
        // If fields not valid, notify the user. Stop.
        // (Server => PUT the updated information into this entry in Entries).
        // Add to USER_ENTRIES locally.
        // Hide current section's HTML.
        // Refill, unhide View Entry section's HTML (with relevant entryId's info).
        // Display almost everything for the entry.
    }


    $(intializePage());
}


$(main());
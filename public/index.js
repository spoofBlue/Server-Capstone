
console.log("Hello index.js");

function main() {
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

    // Instead of the instructions "Load X page HTML", I could instead remove current section HTML and
    // add relevant section's HTML

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

    function handleLoginButton() {
        console.log("handleLoginButton runs");
        // When user clicks the login button: 
        // Verify through API the username and password are valid. (check database with find(), authenticate, attach JWT)
        // If failure, let user know. Adding a short <p>.
        // If success, load Status page HTML (with userId).
        // (GET user's information: fullName, Entries)
        // For each entry in Entries.sort() with the user's ID: 
        // Display Name, Role, Address, Contact Name, Description.  Then a View Entry button and OPTIONAL Update Entry button.
    }

    function handleStatusTabClick() {
        console.log("handleStatusTabClick runs");
        // When user clicks the Status Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Load the Status page HTML (with userId).
        // (Server -> GET user's serialized information: fullName, Entries)
        // For each entry in Entries.sort() with the user's ID: 
        // Display Name, Role, Address, Contact Name, Description.  Then a View Entry button and OPTIONAL Update Entry button.
    }

    function handleCreateEntryTabClick() {
        console.log("handleCreateEntryTab runs");
        // When user clicks the Create Entry Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Load the Create Entry page HTML.
        // OPTIONAL (Server -> GET user's serialized information: fullName, E-mail, Phone number)
        // OPTIONAL Autofill Contact Name, E-mail, Phone Number.
    }

    function handleSearchEntryTabClick() {
        console.log("handleSearchEntryTab runs");
        // When user clicks the Search Entry Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Load the Search Entry Page HTML.
    }

    function handleLogoutTabClick() {
        console.log("handleLogoutTabClick runs");
        // When user clicks the Logout Tab:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Show an alert asking "Are you sure?" or something like this.
        // If confirmed logging out, load the Login page.
    }

    function handleViewEntryButtonClick() {
        console.log("handleViewEntryButtonClick runs");
        // When user clicks the View Entry button (within Status Page or Search Page):
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Load the View Entry Page (with relevant entryId and current account's userId).
        // (Server -> GET entries serialized information: almost everything).
        // Display almost everything for the entry.
        // OPTIONAL If userId matches the entries associated userID, also make the Update Entry button available.
        // 
    }

    function handleUpdateEntryButtonClick() {
        console.log("handleUpdateEntryButtonClick runs");
        //When user clicks on the Update Entry button on the Status, Search, or View Entry pages:
        //(Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Load the Update Entry page HTML (with entryId).
        // (Server -> GET entries serialized information: almost everything)
        // Set the values in the respective fields to the entries previous information.  {altenatively, could get this info prior to loading the page}
    }

    function hanldeSearchButtonClick() {
        console.log("handleSearchButtonClick runs");
        // When user clicks the Search button on the Search Page:
        // Verify fields are properly filled (ex zipcode is a number, mile radius is a number)
        // If fields not valid. Notify the user. Stop.
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Make a request to the GeoCoder API to gather all zipcodes within the user-specified mile-radius form the user-specified zipcode.
        // A list of usable zipcodes is made from the results of the get request. 
        // (Server -> GET all entries that have one of the zipcodes from the list).
    }

    function handleSubmitNewEntryButtonClick() {
        console.log("handleSubmitNewEntryButtonClick runs");
        // When user clicks the Submit New Entry button on the Create New Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number, email has @, OPTIONAL phone number verified).
        // If fields not valid, notify the user. Stop.
        // (Server => POST this entry into Entries).
        // Load the View Entry page (with entryId and userID).
        // (Server -> GET entries serialized information: almost everything).
        // Display almost everything for the entry.
    }

    function handleSubmitUpdatedEntryButtonClick() {
        console.log("handleSubmitUpdatedEntryButtonClick runs");
        // When user clicks the Submit Updated Entry button on the Update Entry page:
        // (Server -> Make sure still authenticated).
        // If not authenticated, load the Login Page.  Notify user the session timed out. Stop.
        // Verify fields are filled properly (ex zipcode is number, email has @, OPTIONAL phone number verified).
        // If fields not valid, notify the user. Stop.
        // (Server => PUT the updated information into this entry in Entries).
        // Load the View Entry page (with entryId and userID).
        // (Server -> GET entries serialized information: almost everything).
        // Display almost everything for the entry.
    }


    $(intializePage());
}


$(main());
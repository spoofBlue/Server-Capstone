
console.log("Hello main.js");

function main() {
    let USER;
    let USER_ENTRIES;
    let SEARCH_ENTRIES;
    let STATUS = {
        "TIMED-OUT" : false ,
        "SUCCESSFULLY-CREATED" : false ,
        "SUCCESSFULLY-UPDATED" : false
    }

    function initializePage() {
        handleStatusTabClick();
        handleCreateEntryTabClick();
        handleSearchEntryTabClick();
        handleLogoutTabClick();
        handleViewEntryButtonClick();
        handleUpdateEntryButtonClick();
        hanldeSearchButtonClick();
        handleSubmitNewEntryButtonClick();
        handleSubmitUpdatedEntryButtonClick();
        loadLoginPage();
    }

    function loadLoginPage() {
        console.log("loadLoginPage() runs");
        USER, USER_ENTRIES, SEARCH_ENTRIES = undefined, undefined, undefined;
        // Empty USER, USER_ENTRIES, SEARCH_ENTRIES.
        // Load the Login page HTML.
        windows.location = "/index.html";
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
            loadLoginPage();
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

    $(initializePage());
}

$(main());
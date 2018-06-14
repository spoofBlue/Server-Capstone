
console.log("Hello index.js");

function main() {

    function intializePage() {
        // handleCreateNewAccountButtonClick();
        // handleSubmitNewAccountButtonClick();
        handleLoginButton();
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

    function handleLoginButton() {
        $(".login_button").click(function(event) {
            console.log("handleLoginButton runs");
            // Make explicit functions instead.
            const username = $(".input_username").val();
            const password = $(".input_password").val();
            
            /**return {
                username : username,
                password : password
            }**/
            loadMainPage();
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

    function loadMainPage() {
        console.log("loadMainPage() runs");
        windows.location = "/main.html";
        // Retrieve token. Speak to server and verify user is logged in (with the token)
        // If there is not a valid token, Redirect to login page 
    }

    $(intializePage());
}


$(main());
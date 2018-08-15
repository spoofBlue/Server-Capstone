
console.log("Hello index.js");

function main() {

    function intializePage() {
        handleCreateNewAccountButtonClick();
        handleSubmitNewAccountButtonClick();
        handleBackButtonClick();
        handleLoginButton();
    }

    function hideAllSections() {
        // Adds the `hidden` CSS class (which has display:none) from all sections, making them invisible in the HTML.
        const sections = [`login_section`, `notification_section`, `create_new_account_section`];
        sections.forEach(section => $(`.${section}`).addClass(`hidden`));
    }

    function unhideSection(section) {
        // Removes the `hidden` CSS class (which has display:none) from the argument `section` to make it visible in the HTML.
        $(`.${section}`).removeClass(`hidden`);
    }

    function handleCreateNewAccountButtonClick() {
        // When user clicks the Create New Account button: 
        // Load the Create New Account Page.
        $(`.login_section`).on(`click`,`.create_new_account_button`, function(event) {
            console.log("ran handleCreateNewAccountButton");
            event.preventDefault();
            hideAllSections();
            unhideSection(`create_new_account_section`);
        });
    }
    
    
    function handleSubmitNewAccountButtonClick() {
        // When user clicks the submit button on the Create New Account page:
        // Verify username has not been used before, and password is greater than 8 characters.
        // If fields are not valid, notify the user.
        // (Server -> POST a new user).
        // Load Status page HTML (with userId). No entries will be on the account.
        $(`.create_new_account_section`).on(`submit`,`form`, function(event) {
            console.log(`ran handleSubmitNewAccountButtonClick`);
            event.preventDefault();
            const form_inputs = gatherUserInputs(`create_new_account_section`);
            let userInfo = packageInputsIntoObject(form_inputs);
            console.log(`handleSubmitNewAccount. userInfo = `, userInfo);
            const postPromise = postUserToDatabase(userInfo);

            postPromise
            .then(response => {
                console.log(`handleSubmitNewAccountButtonClick. response = `, response);
                
                $(`.notification_section`).empty();
                if (response.status === 422) {
                    console.log(`no post, because we caught an invalid response from user.`);
                    response.body.forEach(error => {
                        form_inputs.forEach(input => {
                            if (error.field === input.name) {
                                highlightTextbox(form_inputs[input].id);
                            } else {
                                removeHighlightTextbox(form_inputs[input].id);
                            }
                        });
                        notifyUser(error.message);
                    });
                    unhideSection(`notification_section`);
                } else {
                //if (response.toString === [object Object]) {
                    console.log(`we made a post to the database!`);
                    hideAllSections();
                    notifyUser(`Account Creation Successful!`);
                    unhideSection(`login_section`);
                    unhideSection(`notificatoin_section`);
                }     
            })
            .catch(error => {
                console.log(`handleSubmitNewAccountButtonClick. error.response =`, error.response);
            });
        });
    }

    function gatherUserInputs(section) {
        // Given a section, parses through all the inputs in the section (likely in a form), and stores any details about the input into object
        // form_inputs.  
        let form_inputs = {};
        $(`.${section} input`).each(function() {
            let input = $(this);
            form_inputs[input.attr("name")] = {
                id : input.attr("id") ,
                type : input.attr("type") ,
                value : input.val() ,
                name : input.attr("name")
            }
        });
        console.log(`gatherUserInput. form_inputs = `, form_inputs)
        return form_inputs;
    }

    function packageInputsIntoObject(form_inputs) {
        // Using form_inputs {id: x, name: y, type: z, value: n} to create the object to send.
        // The reason gatherUserInputs wasn't made to just display name : value (removing the necessity of this function packageInputs) 
        // was versatility;  form_inputs is used for it's id/type in highlighting fields.
        let information = {};
        Object.keys(form_inputs).forEach(key => {
            information[key] = form_inputs[key][`value`];
        });
        console.log(`packageInputsIntoObject finished. information = `, information);
        return information;
    }

    function postUserToDatabase(userInfo) {
        // Given the object userInfo, post the user into the user database.  The response is either a confirmation, or an error response,
        // consisting of an array of objects.
        return fetch(`/users`, {method: "POST", body: JSON.stringify(userInfo), headers : {"content-type": "application/json"}})
        .then(response => response.json())/*{   !!!!!! Remove me in final product, just tried this.
            const status = response.status;
            const body = response.json();
            return {status:status, body:body};
        })*/
        .catch(error => {
            return error.message;
        });
    }

    function handleBackButtonClick() {
        $(`.create_new_account_section`).on(`click`, `.back_button`, function() {
            console.log(`ran handleBackButtonClick`);
            hideAllSections();
            unhideSection(`login_section`);
        });
    }

    function highlightTextbox(textbox) {
        // Adds CSS to the textbox input (through the highlighted class) to make it stand out to the user, making it clear which textbox needs to be changed.
        console.log(`highlightTextbox. textbox= `, textbox);
        $(`#${textbox}`).addClass("highlighted");
    }

    function removeHighlightTextbox(textbox) {
        // Removes CSS to the textbox input (through the highlighted class).
        console.log(`highlightTextbox. textbox= `, textbox);
        $(`#${textbox}`).removeClass("highlighted");
    }

    function notifyUser(message) {
        // Unhides the notification section and posts the message String.
        unhideSection(`notification_section`);
        $(`.notification_section`).append(`
        <p>${message}</p>
        `);
    };

    function handleLoginButton() {
        // When user clicks the login button: 
        // Verify through API the username and password are valid. (Server -> check database with find(), authenticate, attach JWT)
        // If failure, let user know. Adding a short <p>.
        // If success, load main page HTML (with userId).
        // REST OF THIS ACTUALLY GOES TO MAIN.HTML
        // (Server -> GET user's serialized information: fullName, Entries)
        // Store user information locally in USER.
        // For each entry in Entries.sort() with the user's ID (Server -> GET entries associated with userId): 
        // Store entry locally in USER_ENTRIES.
        // Display Name, Role, Address, Contact Name, Description.  Then a View Entry button and Update Entry button.
        $(".login_section").on("submit", "form", function(event) {
            console.log("handleLoginButton runs");
            event.preventDefault();
            // Make explicit functions instead.
            const username = $(".input_username").val();
            const password = $(".input_password").val();

            const authorizePromise = authorizeUser(username, password);

            authorizePromise
            .then(response => {
                localStorage.setItem(`harvest_united_jwt`, response.authToken);
                localStorage.setItem(`harvest_united_username`, username);
                loadMainPage();
            })
            .catch(error => {
               console.log(error.message);
            });
        });
    }

    function authorizeUser(username, password) {
        // Posts info from the filled out form to the server to authorize the user.  Returns true with a WST if User authorized.
        const query = {
            username : username ,
            password : password
        };

        return fetch(`/auth/login`, {method : "POST", body : JSON.stringify(query), headers : {"content-type" : "application/json"}})
        .then(res => {
            if (res.ok) {
                return res;
            }
            throw new Error("Username or password does not check out.");
        })
        .then(response => response.json())
    }

    function loadMainPage() {
        console.log("loadMainPage() runs");
        console.log(`jwt token: `, localStorage.getItem(`harvest_united_jwt`));
        console.log(`username: `, localStorage.getItem(`harvest_united_username`));
        window.location = "/main.html";
    }

    $(intializePage());
}


$(main());
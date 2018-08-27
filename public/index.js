
console.log("Hello index.js");

function main() {

    function intializePage() {
        handleClickCollapsible();
        handleTextboxClick();
        handleSubmitNewAccountButtonClick();
        handleLoginButton();

        $(document).ready(function(){
            $('.collapsible').collapsible();
        });
    }

    function hideSection(section) {
        // Adds the `hidden` CSS class (which has display:none) from all sections, making them invisible in the HTML.
        $(`.${section}`).addClass(`hidden`);
    }

    function unhideSection(section) {
        // Removes the `hidden` CSS class (which has display:none) from the argument `section` to make it visible in the HTML.
        $(`.${section}`).removeClass(`hidden`);
    }

    function handleClickCollapsible() {
        // When user clicks the a collapsible list, checks whether the user activated the collapsible.  Ultimately
        // changes the height of the background image to cover the entire page.
        // Also hides the notification section, if it's present.
        $(`li`).on(`click`,`.collapsible-header`, function(event) {
            console.log("ran handleClickCollapsible");
            event.preventDefault();

            $(`.notification_section`).empty();
            hideSection(`notification_section`);
            if ($(this).parent().get(0).className.indexOf(`active`) === -1) {
                setFrontPageImageHeight("auto");
                console.log(`handleClickCollapsible. into if-true`);
            } else {
                setFrontPageImageHeight("100%");
                console.log(`handleClickCollapsible. into else`);
            }
        });
    }

    function setFrontPageImageHeight(setting) {
        $(`#front-image-container`).css("height", setting);
    }

    function handleTextboxClick() {
        $(`.create_new_account_section`).on(`click`, `input[type="text"]`, function() {
            console.log(`handleTextboxClick. this=`, this);
            removeHighlightTextbox(this.id);
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
            $(`.notification_section`).empty();
            hideSection(`notification_section`);
            if (verifyAcceptableUserInputs(form_inputs)) {
                const postPromise = postUserToDatabase(userInfo);

                postPromise
                .then(response => {
                    console.log(`handleSubmitNewAccountButtonClick. response = `, response);

                    console.log(`we made a post to the database!`);
                    M.toast({html: 'User Account Created!'});
                    //window.location = "/index.html";
                    //notifyUser(`Account Creation Successful!`);
                    //unhideSection(`notification_section`);
                    //$(`.create_new_account_section`).removeClass(`active`);
                    //setFrontPageImageHeight("100%");     
                })
                .catch(error => {
                    notifyUser(`Unable to create the user. Please use a unique username.`);
                    highlightTextbox(`input_username`);
                    console.log(`handleSubmitNewAccountButtonClick. error =`, error);
                });
            }
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
        .then(response =>  {
            console.log(`postUserToDatabase response=`, response);
            if (!response.ok) {
                throw new Error(`postUserToDatabase call resulted in ${response.statusText}`);
            }
            return response.json();
        }); 
    }

    function verifyAcceptableUserInputs(form_inputs) {
        // Verifies all text-based fields in the form_inputs object satisfy standards set in verifyInput. 
        // Returns true if all fields fulfill standards.
        let verified = true;
        console.log(`verifyAcceptableUserInputs. form_inputs=`, form_inputs);

        $(`.notification_section`).addClass(`hidden`);
        Object.keys(form_inputs).forEach(function(input) {
            console.log(input);
            const result = verifyInput(form_inputs[input]);
            console.log(result);
            if (result !== "Accepted") {
                console.log(`verifyAcceptableUserInputs. unacceptable input = `, form_inputs[input]);
                highlightTextbox(form_inputs[input].id);
                notifyUser(result);
                verified = false;
            } else {
                removeHighlightTextbox(form_inputs[input].id);
            }
        });
        return verified;
    }

    function verifyInput(input) {
        // Reads in input, uses input.name to determine what kind of tests the input must go through to be considered valid.
        // Only verifying the password for now, but leaving this to be scalable.
        let result = "Accepted";
        console.log(input);
        if ((input.name === "userPassword") && input.value.length < 10) {
            result = "The Password must be 10 characters or longer, with no extra whitespace before/after.";
        } else 
        if ((input.name === "userPassword") && input.value.trim() !== input.value) {
            result = "The Password must be 10 characters or longer, with no extra whitespace before/after.";
        }
        return result;
    }

    function highlightTextbox(textbox) {
        // Adds CSS to the textbox input (by adding the highlighted class) to make it stand out to the user, making it clear which textbox needs to be changed.
        console.log(`highlightTextbox. textbox= `, textbox);
        $(`#${textbox}`).addClass("highlighted");
    }

    function removeHighlightTextbox(textbox) {
        // Removes CSS to the textbox input (by removing the highlighted class).
        console.log(`removeHighlightTextbox. textbox= `, textbox);
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
            const password = $(".input_userPassword").val();
            //console.log(`username=`, username);
            //console.log(`password=`, password);

            const authorizePromise = authorizeUser(username, password);

            authorizePromise
            .then(response => {
                localStorage.setItem(`harvest_united_jwt`, response.authToken);
                localStorage.setItem(`harvest_united_username`, username);
                loadMainPage();
            })
            .catch(error => {
                notifyUser(`Username or password does not check out.`);
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
const scriptURL = 'https://script.google.com/macros/s/AKfycbzOyn9R1k3EPqr-nRixnwCXERxfxwR2FUTgkUuFQpPNiopu9vn-omH2qX0V5XIpTyHQ/exec'
const form = document.forms['contact-form']
var currentTab = 0; // Current tab is set to be the first tab (0)
var livesInNZ = true;
// Get the checkbox and submit button
var checkbox = document.getElementById('tac_checkbox');
var submitBtn = document.getElementById('submitBtn');

showTab(currentTab); // Display the current tab

// Add event listener to the checkbox
checkbox.addEventListener('change', function () {
    // If checkbox is checked, enable submit button, else disable it
    if (checkbox.checked) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
});

form.addEventListener('submit', e => {
    capitalizeInputs();
    document.getElementById('date_time').value = generateDateTimeString();
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => alert("Thank you! your form is submitted successfully."))
        .then(() => { window.location.reload(); })
        .catch(error => console.error('Error!', error.message))
})


function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
        document.getElementById("nextBtn").style.display = "none";
    } else if (n == 2) {
        document.getElementById("prevBtn").style.display = "inline";
        document.getElementById("nextBtn").style.display = "none";
    } else if (n == 3) {
        if (livesInNZ) {
            document.getElementById("nextBtn").style.display = "none";
        }
        else {
            document.getElementById("nextBtn").style.display = "inline";
        }
    } else {
        document.getElementById("prevBtn").style.display = "inline";
        document.getElementById("nextBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").style.display = "none";
        submitBtn.style.display = "inline";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid (Check email):
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        // document.getElementById("regForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false:
            valid = false;
        }
        else if (y[i].type === "email") { // If the field is an email input
            // Check if the email is valid
            if (!validateEmail(y[i].value)) {
                // If not valid, add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false:
                valid = false;
            }
        }
    }
    // If the valid status is true, mark the step as finished and valid: fuck??
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

// These two functions could be combines into one true/false
function newZealandYes() {
    livesInNZ = true;
    document.getElementById('input_countries').value = "New Zealand";
    // Show the region options
    document.getElementById('regions_nz').style.display = 'block';
    // Hide the country options
    document.getElementById('countries').style.display = 'none';
    nextPrev(1)
}

function newZealandNo() {
    livesInNZ = false;
    document.getElementById('input_countries').value = ""
    // Hide the region options
    document.getElementById('regions_nz').style.display = 'none';
    // Show the country options
    document.getElementById('countries').style.display = 'block';
    nextPrev(1)
}

function generateDateTimeString() {
    // Get the current date and time
    var now = new Date();

    // Extract the date components
    var month = now.getMonth() + 1; // Months are zero-based
    var day = now.getDate();
    var year = now.getFullYear();

    // Extract the time components
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Format the date/time string
    var dateTimeString = month + '/' + day + '/' + year + ' ' +
        hours + ':' + minutes + ':' + seconds;

    // Return the date/time string
    return dateTimeString;
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to set the region 
function setRegion(regionName) {
    document.getElementById('region_nz').value = regionName;
    nextPrev(1);
}

// Function to set "How did you hear about us?"
function setHowDidYouHearAboutUs(option) {
    document.getElementById('how_did_you_hear_about_us').value = option;
    nextPrev(1);
}

// These last two functions could be combined in a setHiddenInput function that takes as argument the hidden input ID and the value 
function setHiddenInputandNext(inputID, value) {
    document.getElementById(inputID).value = value;
    nextPrev(1);
}

// Function to UpperCase the first letter of all the text inputs
function capitalizeInputs() {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        let value = input.value.trim();
        if (value.length > 0) {
            // Split the value by space, capitalize each word, then join them back together
            value = value.split(' ').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
            input.value = value;
        }
    });
}
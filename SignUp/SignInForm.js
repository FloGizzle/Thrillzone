const scriptURL = 'https://script.google.com/macros/s/AKfycbzOyn9R1k3EPqr-nRixnwCXERxfxwR2FUTgkUuFQpPNiopu9vn-omH2qX0V5XIpTyHQ/exec'
const form = document.forms['sign-in-form']
var currentTab = 0; // Current tab is set to be the first tab (0)
var livesInNZ = true;
// Define the duration of inactivity in milliseconds
var inactivityDuration = 5 * 60 * 1000; // 5 minutes in milliseconds (minutes x seconds x miliseconds)
// Get the checkbox and submit button
var checkbox = document.getElementById('tac_checkbox');
var submitBtn = document.getElementById('submitBtn');
// To know if to post on TZ or EQ
// To know what activities to send to the form
var thrillZone = false;
var listOfTZActivities = [];
var escapeQuest = false;
var escapeRoom = "";
// Will be assigned to true if frisbee, outdoor or kidzclub
var additionalInfoRequired = false;
var phoneRequired = false;

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

// Event listeners for user activity
document.addEventListener("DOMContentLoaded", startTimer); // Start timer when page loads
document.addEventListener("click", resetTimer); // Reset timer on click
document.addEventListener("keypress", resetTimer); // Reset timer on keypress


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
    } else if (n == 5) {
        // Change the next button function into a check activities button 
        document.getElementById("nextBtn").onclick = isAdditionalInfoRequired;
        // Check if no additional info requires nextBtn takes back its original function and nextPrev(1)

    } else {
        document.getElementById("prevBtn").style.display = "inline";
        document.getElementById("nextBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").style.display = "none";
        submitBtn.style.display = "inline";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
        submitBtn.style.display = "none";
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
    document.getElementById('regions_nz').style.display = 'grid';
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

// Function for the activities buttons (selection of activities)
// Function to select or deselect an activity
function selectActivity(activityBtn, activityName) {
    // var activityList = document.getElementById("activity");

    if (activityBtn.classList.contains("selected")) {
        // If the activity button is already selected, remove it from the list and remove the selected class
        activityBtn.classList.remove("selected");
        var index = listOfTZActivities.indexOf(activityName);
        if (index !== -1) {
            listOfTZActivities.splice(index, 1);
        }
    } else {
        // If the activity button is not selected, add it to the list and add the selected class
        activityBtn.classList.add("selected");
        listOfTZActivities.push(activityName);
    }

    // Update the hidden input field with the updated list of activities
    //activityList.value = listOfTZActivities.join(",");

    console.log(listOfTZActivities);
}

function selectEscapeQuest(activityBtn) {
    if (!escapeQuest) {
        escapeQuest = true;
    } else {
        escapeQuest = false;
    }
    console.log(escapeQuest);
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

// Function to refresh the page BUT could be replaced by Reload Form ??? 
function refreshPage() {
    // alert("Page refreshed after 5 minutes of inactivity.");
    location.reload(); // Reload the page but could be document.getElementById("sign-in-form").reset();
}

// Function to set timer for inactivity
function startTimer() {
    clearTimeout(window.timerId); // Clear any existing timer
    window.timerId = setTimeout(refreshPage, inactivityDuration); // 5 minutes
}

// Function to reset timer on user activity
function resetTimer() {
    clearTimeout(window.timerId);
    startTimer();
}

// Check if phone number is required, if yes returns true
function isPhoneRequired() {
    return listOfTZActivities.includes("Kidz Club") || listOfTZActivities.includes("Outdoor Escape Adventures") || listOfTZActivities.includes("Frisbee Golf") || escapeQuest;
}

// Check if additional info is required for the activities, if yes displays additional info contained, if not moves to next tab
function isAdditionalInfoRequired() {
    if (!isPhoneRequired()) {
        nextPrev(1);
        document.getElementById("nextBtn").onclick = nextPrev;
    }
    else {
        // display the additional info
        document.getElementById("nextBtn").onclick = nextPrev;
    }
}
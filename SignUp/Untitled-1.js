const scriptURL = 'https://script.google.com/macros/s/AKfycbzOyn9R1k3EPqr-nRixnwCXERxfxwR2FUTgkUuFQpPNiopu9vn-omH2qX0V5XIpTyHQ/exec'
const form = document.forms['contact-form']
var currentTab = 0; // Current tab is set to be the first tab (0)
var livesInNewZealand = true; // To know what to display on slide 2
var numberOfSlides = 9; // Number of slides/pages
showTab(currentTab); // Display the current tab

// Create a class to store the data ? 

// form.addEventListener('submit', e => {
//     console.log(generateDateTimeString());
//     e.preventDefault()
//     fetch(scriptURL, { method: 'POST', body: new FormData(form) })
//         .then(response => alert("Thank you! your form is submitted successfully."))
//         .then(() => { window.location.reload(); })
//         .catch(error => console.error('Error!', error.message))
// })

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
        document.getElementById("nextBtn").innerHTML = "Start";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "none";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        document.getElementById("regForm").submit();
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
    }
    // If the valid status is true, mark the step as finished and valid: fuck
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

function newZealandYes() {
    // Show the region options
    document.getElementById('region_nz').style.display = 'block';
    // Hide the country options
    document.getElementById('countries').style.display = 'none';
    nextPrev(1)
}

function newZealandNo() {
    // Hide the region options
    document.getElementById('region_nz').style.display = 'none';
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
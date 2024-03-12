// Replace with the desired URL of the Google spreadsheets
const scriptURLTZ = "https://script.google.com/macros/s/AKfycbzOyn9R1k3EPqr-nRixnwCXERxfxwR2FUTgkUuFQpPNiopu9vn-omH2qX0V5XIpTyHQ/exec";
const scriptURLEQ = "https://script.google.com/macros/s/AKfycbxHQrj2mlTipYYrxb9u1YcSZZFjmkvTlwayEFPxzyDXIlPYht7DTwQwH4FFa3TnOknGRA/exec";
// Define the duration of inactivity in milliseconds
var inactivityDuration = 2 * 60 * 1000; // 5 minutes in milliseconds (minutes x seconds x miliseconds)

const form = document.forms["sign-in-form"];
var currentTab = 0; // Current tab is set to be the first tab (0)
var activityStepOne = true;
var livesInNZ = true;
// Get the checkbox and submit button
var checkbox = document.getElementById("tac_checkbox");
var submitBtn = document.getElementById("submitBtn");
// To know what activities to send to the form
var listOfTZActivities = [];
var listOfEscapeRooms = [];
var escapeQuest = false;
var phoneNumber;
// Select all input elements
var inputs = document.querySelectorAll('input');

showTab(currentTab); // Display the current tab

form.addEventListener("submit", (e) => {
  // Capitalize inputs before submission
  capitalizeInputs();

  // Generate and set date time value
  document.getElementById("date_time").value = generateDateTimeString();

  // Prevent default form submission
  e.preventDefault();

  // Disable the submit button to prevent multiple submissions
  submitBtn.disabled = true;

  // Hide the form
  form.style.display = "none";

  // Show thank you message
  document.getElementById("thank_you_message").style.display = "inline";

  // Update hidden input fields with the updated list of activities
  if (listOfTZActivities !== null) {
    document.getElementById("what_activities").value = listOfTZActivities.join(", ");
  }

  // Check if for Thrillzone and Escape Quest and send to corresponding URL
  if (listOfTZActivities !== null || listOfEscapeRooms !== null) {
    const promises = [];

    if (listOfTZActivities !== null) {
      promises.push(fetch(scriptURLTZ, { method: "POST", body: new FormData(form) }));
    }

    if (listOfEscapeRooms !== null) {
      promises.push(fetch(scriptURLEQ, { method: "POST", body: new FormData(form) }));
    }

    // Wait for all fetch requests to complete
    Promise.all(promises)
      .then(() => {
        window.location.reload(); // Reload the page after both fetch requests are completed
      })
      .catch((error) => console.error("Error!", error.message));
  }
});

// Add event listener to each text input for the ENTER key to have the same effect as the Next Button
// Make sure the generated phone number input gets affected too
inputs.forEach(function (input) {
  input.addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
      // Prevent the default action of the Enter key (form submission)
      event.preventDefault();
      // Call the function you want to execute when Enter is pressed
      nextPrev(1);
    }
  });
});

// Event listeners for user activity
document.addEventListener("DOMContentLoaded", startTimer); // Start timer when page loads
document.addEventListener("click", resetTimer); // Reset timer on click
document.addEventListener("keypress", resetTimer); // Reset timer on keypress

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  document.getElementById("back_to_activities").style.display = "none";
  document.getElementById("check_activities").style.display = "none";
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
  } else if (n == 2) {
    document.getElementById("prevBtn").style.display = "inline";
    document.getElementById("nextBtn").style.display = "none";
  } else if (n == 3) {
    if (livesInNZ) {
      document.getElementById("nextBtn").style.display = "none";
    } else {
      document.getElementById("nextBtn").style.display = "inline";
    }
  } else if (n == 5) {
    if (activityStepOne == true) {
      displayFirstStepOfActivities();
    } else {
      displaySecondStepOfActivities();
    }
    enableCheckActivityBtn();

  } else if (n == 6) {
    // CHANGE BACK TO DISPLAY SECOND STEP OF ACTIVITIES IN NEXTPREV FUNCITON
    document.getElementById("prevBtn").style.display = "inline";
    document.getElementById("nextBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
    document.getElementById("nextBtn").style.display = "inline";
  }

  if (n == x.length - 1) {
    // Add event listener to the checkbox
    checkbox.addEventListener("change", function () {
      // If checkbox is checked, enable submit button, else disable it
      if (checkbox.checked) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    });
    document.getElementById("nextBtn").style.display = "none";
    submitBtn.style.display = "inline";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
    submitBtn.style.display = "none";
  }

  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n);
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
  var x,
    y,
    i,
    valid = true;
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
    } else if (y[i].type === "email") {
      // If the field is an email input
      // Check if the email is valid
      if (!validateEmail(y[i].value)) {
        // If not valid, add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false:
        valid = false;
      }
    }
  }
  // If the valid status is true, mark the step as finished and valid
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

// These two functions could be combined into one true/false
function newZealandYes() {
  livesInNZ = true;
  document.getElementById("input_countries").value = "New Zealand";
  // Show the region options
  document.getElementById("regions").style.display = "inline";
  // Hide the country options
  document.getElementById("countries").style.display = "none";
  nextPrev(1);
}

function newZealandNo() {
  livesInNZ = false;
  document.getElementById("input_countries").value = "";
  // Hide the region options
  document.getElementById("regions").style.display = "none";
  // Show the country options
  document.getElementById("countries").style.display = "block";
  nextPrev(1);
}

//#region Generate DD/MM/YYYY
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
  var dateTimeString =
    month +
    "/" +
    day +
    "/" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  // Return the date/time string
  return dateTimeString;
}
//#endregion

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


// These last two functions could be combined in a setHiddenInput function that takes as argument the hidden input ID and the value
function setHiddenInputandNext(inputID, value) {
  document.getElementById(inputID).value = value;
  nextPrev(1);
}

// Function to select or deselect an activity
function selectActivity(activityBtn, activityName, escapeRoom) {
  if (activityBtn.classList.contains("selected")) {
    // If the activity button is already selected, remove it from the list and remove the selected class
    activityBtn.classList.remove("selected");

    if (escapeRoom) {
      // If escapeRoom is true, remove the activity from the listOfEscapeRooms
      var index = listOfEscapeRooms.indexOf(activityName);
      if (index !== -1) {
        listOfEscapeRooms.splice(index, 1);
      }
    } else {
      // If escapeRoom is false, remove the activity from the listOfTZActivities
      var index = listOfTZActivities.indexOf(activityName);
      if (index !== -1) {
        listOfTZActivities.splice(index, 1);
      }
    }
  } else {
    // If the activity button is not selected, add it to the list and add the selected class
    activityBtn.classList.add("selected");

    if (escapeRoom) {
      // If escapeRoom is true, add the activity to the listOfEscapeRooms
      listOfEscapeRooms.push(activityName);
    } else {
      // If escapeRoom is false, add the activity to the listOfTZActivities
      listOfTZActivities.push(activityName);
    }
  }

  if (escapeRoom) {
    document.getElementById("what_escape_room").value = listOfEscapeRooms.join(", ");
  }

  enableCheckActivityBtn();
}

function selectEscapeQuest(activityBtn) {
  if (!escapeQuest) {
    escapeQuest = true;
    activityBtn.classList.add("selected");
  } else {
    escapeQuest = false;
    activityBtn.classList.remove("selected");
  }
  enableCheckActivityBtn();
  console.log(escapeQuest);
}

// Function to UpperCase the first letter of all the text inputs
function capitalizeInputs() {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    let value = input.value.trim();
    if (value.length > 0) {
      // Split the value by space, capitalize each word, then join them back together
      value = value
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
      input.value = value;
    }
  });
}

//#region Functions for refresh page and timer 
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
//#endregion

// Enables the check activity based on a condition if at least one activity is selected
function enableCheckActivityBtn() {
  // Enable or disable the "check activities" button based on conditions
  var checkAcitivtyBtn = document.getElementById("check_activities");
  if (listOfTZActivities.length > 0 || escapeQuest) {
    checkAcitivtyBtn.disabled = false; // Enable the button
  } else {
    checkAcitivtyBtn.disabled = true; // Disable the button
  }
}

// Check if phone number is required, if yes returns true
function isPhoneRequired() {
  return (
    listOfTZActivities.includes("Kidz Club") ||
    listOfTZActivities.includes("Outdoor Escape Adventures") ||
    listOfTZActivities.includes("Frisbee Golf") ||
    escapeQuest
  );
}

// Check if additional info is required for the activities, if yes displays additional info contained, if not moves to next tab
function isAdditionalInfoRequired() {
  if (!isPhoneRequired()) {
    nextPrev(1);
  } else {
    displaySecondStepOfActivities();
  }
}

function displayFirstStepOfActivities() {
  activityStepOne = true;
  document.getElementById("phone_number_input").innerHTML = "";
  document.getElementById("escape_rooms_hidden_input").innerHTML = "";
  document.getElementById("step_one_activities").style.display = "inline";
  document.getElementById("step_two_activities").style.display = "none";
  document.getElementById("prevBtn").style.display = "inline";
  document.getElementById("back_to_activities").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("check_activities").style.display = "inline";
}

function displaySecondStepOfActivities() {
  // Make sure at least one escape room is selected... if EQ is true bla bla bla else no
  activityStepOne = false;
  // display the additional info
  document.getElementById("phone_number_input").innerHTML =
    '<p><input type="number" id="phone_input" placeholder="Enter Phone Number" name="Phone" oninput="this.className = \'\'"></p>';
  if (phoneNumber !== null) {
    document.getElementById("phone_input").value = phoneNumber;
  }
  document.getElementById("phone_input").addEventListener("input", function (event) {
    phoneNumber = event.target.value;
  });
  // Event listener for Enter key press
  document.getElementById("phone_input").addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
      // Prevent the default action of the Enter key (form submission)
      event.preventDefault();
      // Call the function to simulate next/prev button click
      nextPrev(1); // 1 for next, -1 for prev
    }
  });

  if (escapeQuest) {
    document.getElementById("escape_room_options").style.display = "inline";
    document.getElementById("escape_rooms_hidden_input").innerHTML = '<input type="hidden" name="Escape Room" id="what_escape_room" value=""></input>';
    document.getElementById("what_escape_room").value = listOfEscapeRooms.join(", ");
    console.log(listOfEscapeRooms);
  } else {
    document.getElementById("escape_room_options").style.display = "none";
  }
  document.getElementById("step_one_activities").style.display = "none";
  document.getElementById("step_two_activities").style.display = "inline";
  document.getElementById("prevBtn").style.display = "none";
  document.getElementById("back_to_activities").style.display = "inline";
  document.getElementById("nextBtn").style.display = "inline";
  document.getElementById("check_activities").style.display = "none";
}

function openModal() {
  document.getElementById("termsModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("termsModal").style.display = "none";
}

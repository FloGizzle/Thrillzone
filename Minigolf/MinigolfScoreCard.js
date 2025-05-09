const numberOfHoles = 17;
var holeNumber = 0;
var numPlayers = 0;
var playerScores = {};
var winer = "";
var challOne = "Use your club backwards and try to get the golf ball into one of the holes, you have three tries, continue from where the ball stops. <br>The number in the hole is your score, if you can't make it your score is 10."
var challTwo = "Pull the two strings in order to bring your golf ball to the top while avoiding the holes !"
var challThree = "Grab a frisbee from the bucket and aim for basket, the less tries you need the better! <br>Throw from the cross on the floor."
var challFour = "Grab a ball from the bucket. <br>You have 10 throws to hit 3 balls into the target, stop once you have hit three, the amount of tries you needed is your score! <br>Good Luck!"
var challFive = "Grab a bean bag from the bucket. <br>Aim for the hole, the amount of tries you need is your score !"
var challSix = "Grab a bean bag from the bucket and choose a hole. <br>Aim for the hole, the amount of tries you need is your score !"
var challSeven = "Split into two teams. <br>The team that wins will reward each of its players with a hole-in-one, whereas the losing team will receive 5 points for each of its players."
var challEight = "Move the board in order to bring your golf ball at the end of the maze while avoiding the holes !"
var names = {
    1: ["Hole 1: Underwater", false],
    2: ["Hole 2: Frodo Putterfinger", false],
    3: ["Challenge 1: Putt'n'Lift", challEight],
    4: ["Hole 3: City Race", false],
    5: ["Challenge 2: UFO Frisbee", challThree], //Cheese board
    6: ["Challenge 3: Putt'n'Pull", challTwo],
    7: ["Hole 4: Party Putt", false],
    8: ["Challenge 4: Putt'n'Pool", challOne],
    9: ["Challenge 5: Ball Toss", challFour],
    10: ["Hole 5: The Tree of Souls", false],
    11: ["Challenge 6: Corn", challFive],
    12: ["Hole 6: Skee Ball", true],
    13: ["Hole 7: Fire Wings", false],
    14: ["Hole 8: Glowing Gate Bridge", false],
    15: ["Challenge 7: 4 the Win !", challSeven],
    16: ["Challenge 8: Bag Toss", challSix],
    17: ["Hole 9: FoosGolf", false]
    // Challenge 9 ???
}
function createTable() {
    numPlayers = document.getElementById("numPlayers").value;
    if (numPlayers == "") {
        alert("Please select the number of players.");
        return false;
    }

    // Scroll to the top of the page (to the anchor with id "top")
    window.location.href = "#top";

    var form = document.querySelector("form");
    form.style.display = "none"; // hide the form
    var table = "<table>";
    table += "<tr><th>Player Number</th><th>Name</th></tr>";
    for (var i = 1; i <= numPlayers; i++) {
        table += "<tr><td>" + i + "</td><td><input type=\"text\" name=\"player" + i + "\"></td></tr>";
    }
    table += "</table>";
    document.getElementById("table-container").innerHTML = table;
    document.getElementById("start-game-btn").style.display = "block";
    return false;
}

function startGame() {
    var players = "";
    holeNumber = 1;

    for (var i = 1; i <= numPlayers; i++) {
        var playerName = document.getElementsByName("player" + i)[0].value;
        if (playerName == "") {
            alert("Please enter a name for Player " + i + ".");
            return false;
        }
        players += "<div class=\"player-container\">" +
            "<div class=\"player-name\">" + playerName + "</div>" +
            "<div class=\"player-score\">" +
            "<input class=\"score-box\" type=\"number\" value=\"\" step=\"1\" min=\"0\">" +
            "</div>" +
            "</div>";

        // Add player to playerScores object
        playerScores[i] = {
            name: playerName,
            scores: [],
            totalScore: 0,
        };

        for (let k = 0; k < numberOfHoles; k++) {
            playerScores[i].scores.push(0);
        }

    }

    document.getElementById("hole-number").innerHTML = names[holeNumber][0];
    document.getElementById("hole-number").style.display = "block";
    document.getElementById("table-container").style.display = "none";
    document.getElementById("start-game-btn").style.display = "none";
    document.getElementById("players-container").innerHTML = players;
    document.getElementById("players-container").style.display = "block";
    document.getElementById("next-hole-btn").style.display = "flex";

    return false;
}

function nextHole(back) {

    if (back === false) {
        document.getElementById("next-hole-btn").innerHTML = "Next";
        holeNumber -= 1;
        // sets the text of the score box to the previous value ??? 
        let scoreBoxes = document.querySelectorAll(".score-box");
        boxNumber = 0;
        scoreBoxes.forEach(function (box) {
            boxNumber += 1;
            if (playerScores[boxNumber].scores[holeNumber - 1] != 0) {
                box.value = playerScores[boxNumber].scores[holeNumber - 1];
            }
            else {
                box.value = "";
            }
        });
    }
    else {
        // Get the current hole score for each player and add it to their total score
        var scoreBoxes = document.querySelectorAll(".score-box");
        boxNumber = 0;
        scoreBoxes.forEach(function (box) {
            boxNumber += 1;
            // var playerName = box.closest(".player-container").querySelector(".player-name").textContent;
            var score = parseInt(box.value);
            if (isNaN(score)) score = 0; // in case the user entered a non-numeric value
            playerScores[boxNumber].scores[holeNumber - 1] = score;
            if (holeNumber < numberOfHoles) {
                if (playerScores[boxNumber].scores[holeNumber] != 0)
                    box.value = playerScores[boxNumber].scores[holeNumber]; // reset the score box for the next hole
                else {
                    box.value = "";
                }
            }
        });

        holeNumber++; // increment the hole number
    }

    for (let i = 0; i < numPlayers; i++) {
        playerScores[i + 1].totalScore = 0;
        for (let j = 0; j < playerScores[i + 1].scores.length; j++) {
            playerScores[i + 1].totalScore += playerScores[i + 1].scores[j];
        }
    }

    if (holeNumber < (numberOfHoles + 1)) {
        document.getElementById("hole-number").innerHTML = names[holeNumber][0];

        // Display either text or image 
        if (names[holeNumber][1] == false) {
            document.getElementById("rules-p").style.display = "none";
            document.getElementById("skee-img").style.display = "none";
        }
        else if (names[holeNumber][1] == true) {
            document.getElementById("rules-p").style.display = "none";
            document.getElementById("skee-img").style.display = "block";
        }
        else {
            document.getElementById("skee-img").style.display = "none";
            document.getElementById("rules-p").innerHTML = names[holeNumber][1];
            document.getElementById("rules-p").style.display = "block";
        }
    }

    // Table with the ladder total scores + less points to most points
    const data = playerScores;
    const sortedData = Object.values(data).sort((a, b) => a.totalScore - b.totalScore);
    const lowestScore = sortedData[0].totalScore;
    winer = sortedData[0].name;

    const winners = sortedData.filter(player => player.totalScore === lowestScore)
        .map(player => player.name);

    ladderTable = "<table><tr><th>Rank</th><th>Player</th><th>Total Score</th><tr>";
    for (var i = 1; i <= numPlayers; i++) {
        ladderTable += "<tr>";
        ladderTable += "<td>" + (i) + "</td>";
        ladderTable += "<td>" + sortedData[i - 1].name + "</td>";
        ladderTable += "<td>" + sortedData[i - 1].totalScore + "</td>";
        // ladderTable += "<td>" + sortedData[i - 1].scores.sort((a, b) => a - b).join(", ") + "</td>";
        ladderTable += "</tr>";
    }
    ladderTable += "</table>";

    if (winners.length === 1) {
        document.getElementById("first-player").innerHTML = winer + " is leading !!!";
    }
    else if (winners.length === 2) {
        document.getElementById("first-player").innerHTML = winners[0] + " and " + winners[1] + " are leading !!!";
    }
    else {
        let p = winners.pop();
        document.getElementById("first-player").innerHTML = winners.join(", ") + ", and " + p + " are leading !!!";
    }

    document.getElementById("first-player").style.display = "block";
    document.getElementById("ladder-table").innerHTML = ladderTable;
    document.getElementById("ladder-table").style.display = "table";
    document.getElementById("back-btn").style.display = "flex";
    document.getElementById("next-hole-btn").style.display = "flex";
    document.getElementById("two-btn").style.display = "flex";
    document.getElementById("two-btn").style.justifyContent = "space-between";

    if (holeNumber == 1) {
        document.getElementById("back-btn").style.display = "none";
        document.getElementById("next-hole-btn").style.display = "block";
    }

    if (holeNumber == numberOfHoles) {
        document.getElementById("next-hole-btn").innerHTML = "Finish";
        document.getElementById("next-hole-btn").style.display = "table";
    }

    // If all holes have been played, display the final scores and hide the Next Hole button
    if (holeNumber > numberOfHoles) {
        endGame(winners);
    }
}

function endGame(vainqueurs) {
    var teamScore = 0;
    document.getElementById("hole-number").style.display = "none";
    document.getElementById("ladder-table").style.display = "none";
    document.getElementById("back-btn").style.display = "none";
    document.getElementById("rules-p").style.display = "none";

    if (vainqueurs.length === 1) {
        document.getElementById("first-player").innerHTML = winer + " won !!!";
    }
    else if (vainqueurs.length === 2) {
        document.getElementById("first-player").innerHTML = vainqueurs[0] + " and " + vainqueurs[1] + " won !!!";
    }
    else {
        let p = vainqueurs.pop();
        document.getElementById("first-player").innerHTML = vainqueurs.join(", ") + ", and " + p + " won !!!";
    }

    var scoresTable = "<table><tr><th>Holes</th>";
    for (var i = 1; i <= numPlayers; i++) {
        scoresTable += "<th>" + playerScores[i].name + "</th>";
    }

    // scoresTable += "<th>Hole Total</th>";
    scoresTable += "</tr>";

    for (var i = 0; i < numberOfHoles; i++) {
        // var holeTotal = 0;
        scoresTable += "<tr><td>" + (i + 1) + "</td>";
        for (var j = 1; j <= numPlayers; j++) {
            var score = playerScores[j].scores[i] || 0;
            scoresTable += "<td>" + score + "</td>";
            // holeTotal += score;
        }
        // scoresTable += "<td>" + holeTotal + "</td>";
        scoresTable += "</tr>";
    }

    scoresTable += "<tr style=\"font-weight: bold;\"><td>Total</td>";
    for (var i = 1; i <= numPlayers; i++) {
        scoresTable += "<td>" + playerScores[i].totalScore + "</td>";
        teamScore += playerScores[i].totalScore;
    }
    // scoresTable += "<td>" + teamScore + "</td>";
    scoresTable += "</tr>";
    scoresTable += "</table>";
    document.getElementById("players-container").innerHTML = scoresTable;
    document.getElementById("next-hole-btn").style.display = "none";
}

function scrollToTop() {
    window.location.href = "#top";
}
// Add the beforeunload event listener to display a confirmation message
window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "Are you sure you want to refresh the page? Your 		  progress may be lost.";
    return null; // Safari will show a default message like "Changes you made may not be saved."
});
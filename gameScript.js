var player = document.getElementById("player");
var obstacle = document.getElementById("obstacle");
function avoid() {
    if (player.classList != "jump") {
        player.classList.add("jump");
        setTimeout(function(){
            player.classList.remove("jump");
        }, 750);
    }
}

var contactMade = setInterval(function(){
    var sideOfObstacle = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
    var topOfPlayer = parseInt(window.getComputedStyle(player).getPropertyValue("top"));
    if (sideOfObstacle > 0 && sideOfObstacle < 35 && topOfPlayer >= 620) {
        obstacle.style.display = "none";
        obstacle.style.animation = "none";
        score = Math.floor(Math.random() * 75);
        window.alert("Game Over :( Your score: " + score + ". Refresh the page to try again!");
    }
},5)
let game;
let gamewidth = 1200;
let gameheight = 400;
let context;

let arjanwidth = 180;
let arjanheight = 180;
let arjanX = 50;
let arjanY = gameheight - arjanheight;
let arjanImg;

let arjan = {
    x: arjanX,
    y: arjanY,
    width: arjanwidth,
    height: arjanheight
};

//enemy
let enemyArray = [];

let enemy1Width = 64;
let enemy2Width = 69;
let enemy3Width = 102;
let enemy4Width = 88;

let enemyHeight = 70;
let enemyX = gamewidth; 
let enemyY = gameheight - enemyHeight;

let enemy1Img;
let enemy2Img;
let enemy3Img;
let enemy4Img;

//physics
let velocityX = -6; 
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

let minEnemySpacing = 350;

window.onload = function() {
    game = document.getElementById("game");
    game.height = gameheight;
    game.width = gamewidth;

    context = game.getContext("2d"); 
    context.fillStyle = "brown";
    context.fillRect(arjanX, arjanY, arjanwidth, arjanheight);

    arjanImg = new Image();
    arjanImg.src = "./img/Arjan.png";
    arjanImg.onload = function() {
        context.drawImage(arjanImg, arjan.x, arjan.y, arjan.width, arjan.height);
    };

    enemy1Img = new Image();
    enemy1Img.src = "./img/Cedric.png";

    enemy2Img = new Image();
    enemy2Img.src = "./img/Eanna.png";

    enemy3Img = new Image();
    enemy3Img.src = "./img/Levi.png";

    enemy4Img = new Image();
    enemy4Img.src = "./img/Josie.png";

    requestAnimationFrame(update);
    setInterval(placeEnemy, 1000); 
    document.addEventListener("keydown", moveArjan);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, game.width, game.height);

    //dino
    velocityY += gravity;
    arjan.y = Math.min(arjan.y + velocityY, arjanY); 
    context.drawImage(arjanImg, arjan.x, arjan.y, arjan.width, arjan.height);

    //cactus
    for (let i = 0; i < enemyArray.length; i++) {
        let enemy = enemyArray[i];
        enemy.x += velocityX;
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);

        if (detectCollision(arjan, enemy)) {
            gameOver = true;
            arjanImg.src = "./img/DedArjan.png";
            arjanImg.onload = function() {
                context.drawImage(arjanImg, arjan.x, arjan.y, arjan.width, arjan.height);
            };
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveArjan(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && arjan.y == arjanY) {
        // jump
        velocityY = -10;
    }
}

function placeEnemy() {
    if (gameOver) {
        return;
    }

    
    if (enemyArray.length > 0) {
        let lastEnemy = enemyArray[enemyArray.length - 1];
        if (lastEnemy.x > gamewidth - minEnemySpacing) {
            return; 
        }
    }

   
    let enemy = {
        img: null,
        x: gamewidth, 
        y: enemyY,
        width: null,
        height: enemyHeight
    };

    let placeEnemyChance = Math.random(); 

    if (placeEnemyChance > 0.75) { 
        enemy.img = enemy3Img;
        enemy.width = enemy3Width;
    } else if (placeEnemyChance > 0.5) {
        enemy.img = enemy2Img;
        enemy.width = enemy2Width;
    } else if (placeEnemyChance > 0.25) { 
        enemy.img = enemy1Img;
        enemy.width = enemy1Width;
    } else { 
        enemy.img = enemy4Img;
        enemy.width = enemy4Width;
    }

    enemyArray.push(enemy);

    if (enemyArray.length > 5) {
        enemyArray.shift(); 
    }
}

function detectCollision(a, b) {
    let aHitbox = {
        x: a.x + 5,
        y: a.y + 5,
        width: a.width - 50,
        height: a.height - 50
    };
    
    let bHitbox = {
        x: b.x + 5,
        y: b.y + 5,
        width: b.width - 50,
        height: b.height - 50
    };
    
    return aHitbox.x < bHitbox.x + bHitbox.width && 
           aHitbox.x + aHitbox.width > bHitbox.x && 
           aHitbox.y < bHitbox.y + bHitbox.height && 
           aHitbox.y + aHitbox.height > bHitbox.y;  
}

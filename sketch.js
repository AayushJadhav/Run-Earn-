var START = 2;
var PLAY = 1;
var END = 0;
var gameState = 2;

var man, man2, runningMan, fracturedMan;
var ground, groundImage;
var moneyGroup, moneyImage;
var treasureBoxGroup, treasureBoxImage;
var obstacleGroup, obstacleImage1, obstacleImage2, obstacleImage3;
var cloudGroup, cloud1, cloud2, cloud3;

var score = 0;

function preload() {
  runningMan = loadAnimation('running_man1.png', 'running_man2.png', 'running_man3.png', 'running_man4.png', 'running_man5.png', 'running_man6.png', 'running_man7.png', 'running_man8.png', 'running_man9.png');
  fracturedMan = loadAnimation("fractured.png");

  groundImage = loadImage('ground.png');

  obstacleImage1 = loadImage('obstacle1.png');
  obstacleImage2 = loadImage('obstacle2.png');
  obstacleImage3 = loadImage('obstacle3.png');

  moneyImage = loadImage('money.png');

  treasureBoxImage = loadImage('treasure_box.png');

  cloud1 = loadImage("cloud1.png");
  cloud2 = loadImage("cloud2.png");
  cloud3 = loadImage("cloud3.png")
}

function setup() {
  createCanvas(600, 200);

  man = createSprite(50, 160, 20, 20);
  man.addAnimation('running', runningMan);
  man.scale = 0.7;

  man2 = createSprite(100, 100, 10, 10);
  man2.addAnimation("fractured", fracturedMan);
  man2.scale = 0.1;
  man2.visible = false;

  ground = createSprite(200, 210, 400, 20);
  ground.addImage(groundImage);
  ground.scale = 1;
  ground.visible = true;

  invisibleGround = createSprite(300, 195, 600, 20);
  invisibleGround.visible = false;

  cloudGroup = createGroup();
  obstacleGroup = createGroup();
  moneyGroup = createGroup();
  treasureBoxGroup = createGroup();
}

function draw() {
  background('white');
  // text(mouseX + ',' + mouseY, mouseX, mouseY);

  if(gameState === START) {
    fill('orange');
    textSize(25);
    textFont('Comic Sans MS');
    text('RUN, EARN!!', 210, 80);
    fill('black');
    text('Press space to start', 180, 120);
      if(keyDown('space')) {
        gameState = PLAY;
      }
   }else if (gameState === PLAY) {
    man.visible = true;
    man2.visible = false;
    
    fill("red");
    text("Money collected : " + score, 460, 16);

    ground.velocityX = -4;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (keyDown('space') && man.y >= 100) {
      man.velocityY = -8;
    }
    
    if (frameCount % 100 === 0) {
      var rand = Math.round(random(1, 2));
      switch (rand) {
        case 1:
          spawnObstacle();
          break;
        case 2:
          spawnMoney();
          break;
        default:
          break;
      }
    }

    if (moneyGroup.isTouching(man)) {
      score = score + 100;
      moneyGroup.destroyEach();
    }

    if (treasureBoxGroup.isTouching(man)) {
      score = score + 200;
      treasureBoxGroup.destroyEach();
    }

    if (obstacleGroup.isTouching(man)) {
      gameState = END;
    }

    spawnCloud();
    spawnTreasure();

    man.velocityY = man.velocityY + 0.6;
  } else if (gameState === END) {
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach = 0;
    moneyGroup.setVelocityXEach = 0;
    treasureBoxGroup.setVelocityXEach = 0;
    obstacleGroup.setVelocityXEach = 0;

    cloudGroup.setLifetimeEach = -1;
    moneyGroup.setLifetimeEach = -1;
    treasureBoxGroup.setLifetimeEach = -1;
    obstacleGroup.setLifetimeEach = -1;

    moneyGroup.destroyEach();
    cloudGroup.destroyEach();
    treasureBoxGroup.destroyEach();
    obstacleGroup.destroyEach();

    man.visible = false;
    man2.visible = true;

    fill('black');
    textSize(20);
    text('YOU FRACTURED YOUR LEG...', 150, 100);
    
    fill('red');
    text('press space to start...', 150, 120);
    
      if(keyDown("space")) {
        gameState = PLAY;
        score = 0;
      }
  }

  man.collide(invisibleGround);

  drawSprites();
}

function spawnCloud() {
  if (frameCount % 120 === 0) {
    var cloud = createSprite(600, 100, 20, 20);
    cloud.velocityX = -2;
    cloud.y = Math.round(random(0, 60));
    var randd = Math.round(random(1, 3));
    switch (randd) {
      case 1:
        cloud.addImage(cloud1);
        break;
      case 2:
        cloud.addImage(cloud2);
        break;
      case 3:
        cloud.addImage(cloud3);
        break;
      default:
        break;
    }
    cloud.scale = 0.1;
    cloud.lifetime = 320;
    cloud.depth = man.depth;
    man.depth = cloud.depth + 1;
    cloudGroup.add(cloud);
  }
}

function spawnObstacle() {
  var obstacle = createSprite(600, 174, 10, 30);
  obstacle.velocityX = -3;

  //generate random obstacles
  var randomm = Math.round(random(1, 3));
  switch (randomm) {
    case 1:
      obstacle.addImage(obstacleImage1);
      break;
    case 2:
      obstacle.addImage(obstacleImage2);
      break;
    case 3:
      obstacle.addImage(obstacleImage3);
      break;
    default:
      break;
  }
  obstacle.scale = 0.2;
  obstacle.lifetime = 220;
  obstacle.depth = man.depth;
  man.depth = obstacle.depth + 1;
  obstacleGroup.add(obstacle);

}

function spawnMoney() {
  var money = createSprite(600, 174, 10, 30);
  money.velocityX = -3;
  money.addImage(moneyImage);
  money.lifetime = 220;
  money.scale = 0.1;
  moneyGroup.add(money);
}

function spawnTreasure() {
  if (frameCount % 440 === 0) {
    var treasure = createSprite(600, 164, 10, 30);
    treasure.velocityX = -3;
    treasure.addImage(treasureBoxImage);
    treasure.scale = 0.2;
    treasure.lifetime = 220;
    treasureBoxGroup.add(treasure);
    treasure.depth = ground.depth;
    treasure.depth = ground.depth + 1;
  }
}
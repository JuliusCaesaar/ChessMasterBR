var test;
var moving = false;

var tileSize = 100;
var movingPiece;
var whitesMove = true;
var moveCounter = 10;
var images = [];
var whiteAI = false;
var blackAI = true;

var depthPara;
var depthPlus;
var depthMinus;
var tempMaxDepth = 3;
//Tudo aqui embaixo é pra criar um tabuleiro.
function setup() {
  createCanvas(800, 800);
  htmlStuff();
//Puxando as imagens das peças da minha pasta assets 
  for (var i = 1; i < 10; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_0" + i + ".png"));
  }
  for (var i = 10; i < 13; i++) {
    images.push(loadImage("assets/2000px-Chess_Pieces_Sprite_" + i + ".png"));
  }
  test = new Board();
}
//Mandando o Chrome desenhar o tabuleiro e ligar as inteligencias artificiais. 
function draw() {

  background(100);
  showGrid();
  test.show();

  runAIs();

}

function runAIs() {
  maxDepth = tempMaxDepth;
  if (!test.isDead() && !test.hasWon()) {
    if (blackAI) {
      if (!whitesMove) {
        if (moveCounter < 0) {
          test = maxFunAB(test, -400, 400, 0);
          
          print(test);
          whitesMove = true;
          moveCounter = 10;
        } else {
          moveCounter--;
        }
      }
    }
    if (whiteAI) {
      if (whitesMove) {
        if (moveCounter < 0) {
          test = minFunAB(test, -400, 400, 0);
          

          print("test", test);

          whitesMove = false;
          moveCounter = 10;
        } else {
          moveCounter--;
        }
      }
    }
  }
}

function showGrid() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if ((i + j) % 2 == 1) {
        fill(0);
      } else {
        fill(240);
      }
      noStroke();
      rect(i * tileSize, j * tileSize, tileSize, tileSize);

    }
  }


}

function keyPressed() {

}

function mousePressed() {
  var x = floor(mouseX / tileSize);
  var y = floor(mouseY / tileSize);
  if (!test.isDone()) {
    if (!moving) {
      movingPiece = test.getPieceAt(x, y);
      if (movingPiece != null && movingPiece.white == whitesMove) {

        movingPiece.movingThisPiece = true;
      } else {
        return;
      }
    } else {
      if (movingPiece.canMove(x, y, test)) {
        movingPiece.move(x, y, test);
        movingPiece.movingThisPiece = false;
        whitesMove = !whitesMove;
      } else {
        movingPiece.movingThisPiece = false;

      }
    }
    moving = !moving;
  }
}
//---------------------------------------------------------------------------------------------------------------------
function htmlStuff() {
  createP(
    ""
  )
  depthPara = createDiv("Pensando " + maxDepth + " movimentos a frente");
  depthMinus = createButton("-");
  depthPlus = createButton('+');
// Setando os níveis de dificuldade
  depthPlus.mousePressed(plusDepth);
  depthMinus.mousePressed(minusDepth);

}
//Dificuldade minima
function minusDepth() {
  if (tempMaxDepth > 1) {
    tempMaxDepth -= 1;
    depthPara.html("Pensando " + tempMaxDepth + " movimentos a frente");
  }
}
//Dificuldade maxima
function plusDepth() {
  if (tempMaxDepth < 5) {
    tempMaxDepth += 1;
    depthPara.html("Pensando " + tempMaxDepth + " movimentos a frente");
  }
}

class Piece {
  constructor(x, y, isWhite, letter, pic) {
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *
      tileSize + tileSize / 2);
// Configurando como as peças podem se mover 
    this.taken = false;
    this.white = isWhite;
    this.letter = letter;
    this.pic = pic;
    this.movingThisPiece = false;
    this.value = 0;
  }

  //Julio tu precisa dar uma extendida aqui
  show() {
    if (!this.taken) {


      imageMode(CENTER);
      if (this.movingThisPiece) {
        // Aqui precisa ser um pouco maior
        image(this.pic, mouseX, mouseY, tileSize * 1.5, tileSize * 1.5);

      } else {
        image(this.pic, this.pixelPosition.x, this.pixelPosition.y, tileSize,
          tileSize);

      }
    }
  }


  generateNewBoards(currentBoard) {
    var boards = []; //todos os tabuleiros criados por esse método
    var moves = this.generateMoves(currentBoard); //todos os movimentos possiveis de cada peça
    for (var i = 0; i < moves.length; i++) { //cada movimento
      boards[i] = currentBoard.clone(); //criar um novo tabuleiro
      boards[i].move(this.matrixPosition, moves[i]); //mover a peça para o local escolhido
    }

    return boards;
  }


  withinBounds(x, y) {

    if (x >= 0 && y >= 0 && x < 8 && y < 8) {
      return true;
    }
    return false;

  }



  move(x, y, board) {
    var attacking = board.getPieceAt(x, y);
    if (attacking != null) {
      attacking.taken = true;
    }
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *
      tileSize + tileSize / 2);

  }
  attackingAllies(x, y, board) {
    var attacking = board.getPieceAt(x, y);
    if (attacking != null) {
      if (attacking.white == this.white) {
        //isso aqui é pra o robô não comer as proprias peças
        return true;
      }
    }
    return false;
  }
  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    return true;
  }

  moveThroughPieces(x, y, board) {
    var stepDirectionX = x - this.matrixPosition.x;
    if (stepDirectionX > 0) {
      stepDirectionX = 1;
    } else if (stepDirectionX < 0) {
      stepDirectionX = -1;
    }
    var stepDirectionY = y - this.matrixPosition.y;
    if (stepDirectionY > 0) {
      stepDirectionY = 1;
    } else if (stepDirectionY < 0) {
      stepDirectionY = -1;
    }
    var tempPos = createVector(this.matrixPosition.x, this.matrixPosition.y);
    tempPos.x += stepDirectionX;
    tempPos.y += stepDirectionY;
    while (tempPos.x != x || tempPos.y != y) {

      if (board.getPieceAt(tempPos.x, tempPos.y) != null) {
        return true;
      }
      tempPos.x += stepDirectionX;
      tempPos.y += stepDirectionY;
    }

    return false;
  }



}

class King extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "K";
    if (isWhite) {
      this.pic = images[0];

    } else {
      this.pic = images[6];
    }
    this.value = 99;
  }

  clone() {
    var clone = new King(this.matrixPosition.x, this.matrixPosition.y, this.white);
    clone.taken = this.taken;
    return clone;

  }



  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }
    if (abs(x - this.matrixPosition.x) <= 1 && abs(y - this.matrixPosition.y) <=
      1) {
      return true;
    }
    return false;
  }

  generateMoves(board) {
    var moves = [];
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        var x = this.matrixPosition.x + i;
        var y = this.matrixPosition.y + j;
        if (this.withinBounds(x, y)) {
          if (i != 0 || j != 0) {
            if (!this.attackingAllies(x, y, board)) {
              moves.push(createVector(x, y))
            }
          }
        }
      }

    }
    return moves;

  }
}

class Queen extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "Q";
    if (isWhite) {
      this.pic = images[1];

    } else {
      this.pic = images[7];
    }
    this.value = 9;

  }
  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }

    if (x == this.matrixPosition.x || y == this.matrixPosition.y) {
      if (this.moveThroughPieces(x, y, board)) {
        return false;
      }

      return true;
    }
    //diagonal
    if (abs(x - this.matrixPosition.x) == abs(y - this.matrixPosition.y)) {
      if (this.moveThroughPieces(x, y, board)) {
        return false;
      }

      return true;
    }
    return false;
  }
  generateMoves(board) {
    var moves = [];

    //isso aqui vai gerar movimentos horizontais
    for (var i = 0; i < 8; i++) {
      var x = i;
      var y = this.matrixPosition.y;
      if (x != this.matrixPosition.x) {
        if (!this.attackingAllies(x, y, board)) {
          if (!this.moveThroughPieces(x, y, board)) {
            moves.push(createVector(x, y));
          }
        }
      }
    }
    //isso aqui vai gerar movimentos verticais
    for (var i = 0; i < 8; i++) {
      var x = this.matrixPosition.x;;
      var y = i;
      if (i != this.matrixPosition.y) {
        if (!this.attackingAllies(x, y, board)) {
          if (!this.moveThroughPieces(x, y, board)) {
            moves.push(createVector(x, y));
          }
        }
      }
    }

    //isso aqui vai gerar movimentos diagonais
    for (var i = 0; i < 8; i++) {
      var x = i;
      var y = this.matrixPosition.y - (this.matrixPosition.x - i);
      if (x != this.matrixPosition.x) {
        if (this.withinBounds(x, y)) {
          if (!this.attackingAllies(x, y, board)) {
            if (!this.moveThroughPieces(x, y, board)) {
              moves.push(createVector(x, y));
            }
          }
        }
      }
    }

    for (var i = 0; i < 8; i++) {
      var x = this.matrixPosition.x + (this.matrixPosition.y - i);
      var y = i;
      if (x != this.matrixPosition.x) {
        if (this.withinBounds(x, y)) {
          if (!this.attackingAllies(x, y, board)) {
            if (!this.moveThroughPieces(x, y, board)) {
              moves.push(createVector(x, y));
            }
          }
        }
      }
    }
    
    return moves;
  }
  clone() {
    var clone = new Queen(this.matrixPosition.x, this.matrixPosition.y,
      this.white);
    clone.taken = this.taken;
    return clone;

  }
}
class Bishop extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "B";
    if (isWhite) {
      this.pic = images[2];

    } else {
      this.pic = images[8];
    }
    this.value = 3;

  }
  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }


    //diagonal
    if (abs(x - this.matrixPosition.x) == abs(y - this.matrixPosition.y)) {
      if (this.moveThroughPieces(x, y, board)) {
        return false;
      }

      return true;
    }
    return false;
  }

  generateMoves(board) {
    var moves = [];
    //isso aqui vai gerar movimentos diagonais
    for (var i = 0; i < 8; i++) {
      var x = i;
      var y = this.matrixPosition.y - (this.matrixPosition.x - i);
      if (x != this.matrixPosition.x) {
        if (this.withinBounds(x, y)) {
          if (!this.attackingAllies(x, y, board)) {
            if (!this.moveThroughPieces(x, y, board)) {
              moves.push(createVector(x, y));
            }
          }
        }
      }
    }

    for (var i = 0; i < 8; i++) {
      var x = this.matrixPosition.x + (this.matrixPosition.y - i);
      var y = i;
      if (x != this.matrixPosition.x) {
        if (this.withinBounds(x, y)) {
          if (!this.attackingAllies(x, y, board)) {
            if (!this.moveThroughPieces(x, y, board)) {
              moves.push(createVector(x, y));
            }
          }
        }
      }
    }
    
    return moves;
  }
  clone() {
    var clone = new Bishop(this.matrixPosition.x, this.matrixPosition.y,
      this.white);
    clone.taken = this.taken;
    return clone;

  }
}
class Rook extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "R";
    if (isWhite) {
      this.pic = images[4];

    } else {
      this.pic = images[10];
    }
    this.value = 5;

  }
  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }


    if (x == this.matrixPosition.x || y == this.matrixPosition.y) {
      if (this.moveThroughPieces(x, y, board)) {
        return false;
      }

      return true;
    }
    return false;
  }

  generateMoves(board) {
    var moves = [];

    
    for (var i = 0; i < 8; i++) {
      var x = i;
      var y = this.matrixPosition.y;
      if (x != this.matrixPosition.x) {
        if (!this.attackingAllies(x, y, board)) {
          if (!this.moveThroughPieces(x, y, board)) {
            moves.push(createVector(x, y));
          }
        }
      }
    }
    
    for (var i = 0; i < 8; i++) {
      var x = this.matrixPosition.x;;
      var y = i;
      if (i != this.matrixPosition.y) {
        if (!this.attackingAllies(x, y, board)) {
          if (!this.moveThroughPieces(x, y, board)) {
            moves.push(createVector(x, y));
          }
        }
      }
    }
    

    return moves;


  }

  clone() {
    var clone = new Rook(this.matrixPosition.x, this.matrixPosition.y, this
      .white);
    clone.taken = this.taken;
    return clone;

  }
}
class Knight extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "Kn";
    if (isWhite) {
      this.pic = images[3];

    } else {
      this.pic = images[9];
    }
    this.value = 3;

  }

  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }


    if ((abs(x - this.matrixPosition.x) == 2 && abs(y - this.matrixPosition
        .y) == 1) || (abs(x - this.matrixPosition.x) == 1 && abs(y - this.matrixPosition
        .y) == 2)) {
      return true;
    }
    return false;
  }



  generateMoves(board) {
    var moves = [];
    for (var i = -2; i < 3; i += 4) {
      for (var j = -1; j < 2; j += 2) {

        var x = i + this.matrixPosition.x;
        var y = j + this.matrixPosition.y;
        if (!this.attackingAllies(x, y, board)) {
          if (this.withinBounds(x, y)) {
            moves.push(createVector(x, y));

          }
        }
      }
    }
    for (var i = -1; i < 2; i += 2) {
      for (var j = -2; j < 3; j += 4) {

        var x = i + this.matrixPosition.x;
        var y = j + this.matrixPosition.y;

        if (this.withinBounds(x, y)) {
          if (!this.attackingAllies(x, y, board)) {
            moves.push(createVector(x, y));

          }
        }
      }
    }
    

    return moves;

  }
  clone() {
    var clone = new Knight(this.matrixPosition.x, this.matrixPosition.y,
      this.white);
    clone.taken = this.taken;
    return clone;

  }
}
class Pawn extends Piece {
  constructor(x, y, isWhite) {
    super(x, y, isWhite);
    this.letter = "p";
    this.firstTurn = true;
    if (isWhite) {
      this.pic = images[5];

    } else {
      this.pic = images[11];
    }
    this.value = 1;

  }

  canMove(x, y, board) {
    if (!this.withinBounds(x, y)) {
      return false;
    }
    if (this.attackingAllies(x, y, board)) {
      return false;
    }
    var attacking = board.isPieceAt(x, y);
    if (attacking) {
      //Robo atacando um jogador
      if (abs(x - this.matrixPosition.x) == abs(y - this.matrixPosition.y) &&
        ((this.white && (y - this.matrixPosition.y) == -1) || (!this.white &&
          (y - this.matrixPosition.y) == 1))) {
        this.firstTurn = false;
        return true;
      }
      return false;
    }
    if (x != this.matrixPosition.x) {
      return false;
    }
    if ((this.white && y - this.matrixPosition.y == -1) || (!this.white &&
        y - this.matrixPosition.y == 1)) {
      this.firstTurn = false;
      return true;
    }
    if (this.firstTurn && ((this.white && y - this.matrixPosition.y == -2) ||
        (!this.white && y - this.matrixPosition.y == 2))) {
      if (this.moveThroughPieces(x, y, board)) {
        return false;
      }

      this.firstTurn = false;
      return true;
    }
    return false;
  }


  generateMoves(board) {
    var moves = [];

    for (var i = -1; i < 2; i += 2) {
      var x = this.matrixPosition.x + i;
      if (this.white) {
        var y = this.matrixPosition.y - 1;
      } else {
        var y = this.matrixPosition.y + 1;
      }
      var attacking = board.getPieceAt(x, y);
      if (attacking) {
        if (!this.attackingAllies(x, y, board)) {
          moves.push(createVector(x, y));
        }
      }
    }

    var x = this.matrixPosition.x;
    if (this.white) {
      var y = this.matrixPosition.y - 1;
    } else {
      var y = this.matrixPosition.y + 1;
    }
    if (!board.isPieceAt(x, y) && this.withinBounds(x, y)) {
      moves.push(createVector(x, y));
    }

    if (this.firstTurn) {

      if (this.white) {
        var y = this.matrixPosition.y - 2;
      } else {
        var y = this.matrixPosition.y + 2;
      }
      if (!board.isPieceAt(x, y) && this.withinBounds(x, y)) {
        if (!this.moveThroughPieces(x, y, board)) {
          moves.push(createVector(x, y));
        }
      }
    }
    
    return moves;
  }
  clone() {
    var clone = new Pawn(this.matrixPosition.x, this.matrixPosition.y, this
      .white);
    clone.taken = this.taken;
    clone.firstTurn = this.firstTurn;
    return clone;
  }

  move(x, y, board) {
    var attacking = board.getPieceAt(x, y);
    if (attacking != null) {
      attacking.taken = true;
    }
    this.matrixPosition = createVector(x, y);
    this.pixelPosition = createVector(x * tileSize + tileSize / 2, y *
      tileSize + tileSize / 2);
    this.firstTurn = false;
  }
}

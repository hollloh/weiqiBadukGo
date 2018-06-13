
/*

TODO

1) UNDO BUTTON
     if i figure this out, the project's done in my eyes

2) KO RULE
     this boils down to the game recognizing a unique board
     kos don't break the game so it's not absolutely necessary

*/






let board = document.querySelectorAll('.board');

$(board).on('click', initialize);


let moves = [];

let bPris = 0;
let wPris = 0;

for (let i = 0; i < board.length; i++) {
  board[i].color = 'neutral';
}

function checkSuicide(x) {

  x.libertiesDemo = [];

  if (moves.length % 2 === 0) { // before actually logging moves
    x.colorDemo = 'b';          // so this will be reversed
  }
  if (moves.length % 2 !== 0) {
    x.colorDemo = 'w';
  }
          
  let coords = x.id.split('x').join('').split('y');

  let top = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) + 1));
  let right = document.getElementById('x' + (parseFloat(coords[0]) + 1) + 'y' + coords[1]);
  let bottom = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) - 1));
  let left = document.getElementById('x' + (parseFloat(coords[0]) - 1) + 'y' + coords[1]);

  function layer(adj) {
    if (adj !== null) {
      if (adj.color === 'neutral') {
        x.libertiesDemo.push(adj.id);
      }
      if (adj.color !== 'neutral') {
        if (x.colorDemo === adj.color) {
          x.libertiesDemo = x.libertiesDemo.concat(adj.liberties);
          x.libertiesDemo = x.libertiesDemo.filter(function(e) {
            return e !== x.id;
          });
          x.libertiesDemo = Array.from(new Set(x.libertiesDemo));
        }
        if (x.colorDemo !== adj.color) {
          adj.libertiesDemo = adj.liberties;
          adj.libertiesDemo = adj.libertiesDemo.filter(function(e) {
            return e !== x.id;
          });          
          if (adj.libertiesDemo < 1) {
            x.libertiesDemo.push(adj.id);
          }
        }
      }
    }
  }
  layer(top);
  layer(right);
  layer(bottom);
  layer(left);


  if (x.libertiesDemo < 1) {
    x.suicide = true;
    console.log('x.suicide = '+x.suicide);
  }
  for (let i = 0; i < board.length; i++) {
    board[i].colorDemo = '';
    board[i].libertiesDemo = [];
  }
}

function addStones(x) {

  if (x.color === 'neutral') {
    moves.push(x.id);

    let moveCount = document.querySelector('#moveCount');
    moveCount.innerHTML = 'MOVE : ' + moves.length;
    if (moves.length % 2 !== 0) {
      x.color = 'b';
      x.style.backgroundImage = "url('assets/bbs.png')";
    }
    if (moves.length % 2 === 0) {
      x.color = 'w';
      x.style.backgroundImage = "url('assets/bws.png')";
    }
  }
}

function addConnectionsAndLiberties() {
  let x = document.getElementById(moves[moves.length-1]);

  x.liberties = [];
  x.connected = [];

  let coords = x.id.split('x').join('').split('y');

  let top = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) + 1));
  let right = document.getElementById('x' + (parseFloat(coords[0]) + 1) + 'y' + coords[1]);
  let bottom = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) - 1));
  let left = document.getElementById('x' + (parseFloat(coords[0]) - 1) + 'y' + coords[1]);

  function layer(adj) {
    if (adj !== null) {
      if (adj.color === 'neutral') {
        x.liberties.push(adj.id);
      }
      if (x.color === adj.color) {
        x.connected.push(adj.id);
        x.connected = x.connected.concat(adj.connected);
        x.connected = x.connected.filter(function(e) {
          return e !== x.id;
        });
        x.connected = Array.from(new Set(x.connected));

        x.liberties = x.liberties.concat(adj.liberties);
        x.liberties = x.liberties.filter(function(e) {
          return e !== x.id;
        });
        x.liberties = Array.from(new Set(x.liberties));
      }
      // redundant but necessary
      if (adj.color !== 'neutral') {
        if (x.color !== adj.color) {
          adj.liberties = adj.liberties.filter(function(e) {
            return e !== x.id;
          });
          //especially this part
          for (let i = 0; i < adj.connected.length; i++) {
            let y = document.getElementById(adj.connected[i]);
            y.liberties = adj.liberties;
          }
        }
      }

    }
  }
  layer(top);
  layer(right);
  layer(bottom);
  layer(left);
  for (let i = 0; i < x.connected.length; i++) {
    let y = document.getElementById(x.connected[i]);
    y.connected = x.connected;
    y.connected.push(x.id);
    y.connected = y.connected.filter(function(e) {
      return e !== y.id;
    });
    y.connected = Array.from(new Set(y.connected));
    y.liberties = x.liberties;
  }
}

function removeStones() {
  let x = document.getElementById(moves[moves.length-1]);
  let coords1 = x.id.split('x').join('').split('y');
  let top1 = document.getElementById('x' + coords1[0] + 'y' + (parseFloat(coords1[1]) + 1));
  let right1 = document.getElementById('x' + (parseFloat(coords1[0]) + 1) + 'y' + coords1[1]);
  let bottom1 = document.getElementById('x' + coords1[0] + 'y' + (parseFloat(coords1[1]) - 1));
  let left1 = document.getElementById('x' + (parseFloat(coords1[0]) - 1) + 'y' + coords1[1]);

  function layer1(adj1) {
    if (adj1 !== null) {
      if (adj1.color !== 'neutral') {
        if (adj1.color !== x.color) {
          adj1.liberties = adj1.liberties.filter(function(e) {
            return e !== x.id;
          });
          if (adj1.liberties < 1) {
            x.liberties.push(adj1.id);
            adj1.style.backgroundImage = "url('assets/"+adj1.classList[2]+".png')";

            let blackPrisoners = document.querySelector('#blackPrisoners');
            let whitePrisoners = document.querySelector('#whitePrisoners');
            if (moves.length % 2 !== 0) {
              if (adj1.connected === 0) {
                bPris += 1;
              } else {
                bPris += adj1.connected.length + 1;
              }
            }
            if (moves.length % 2 === 0) {
              if (adj1.connected === 0) {
                wPris += 1;
              } else {
                wPris += adj1.connected.length + 1;
              }
            }
            blackPrisoners.innerHTML = 'BLACK PRISONERS : ' + bPris;
            whitePrisoners.innerHTML = 'WHITE PRISONERS : ' + wPris;
          }
        }
      }
    }
  }
  layer1(top1);
  layer1(right1);
  layer1(bottom1);
  layer1(left1);

  for (let i = 0; i < board.length; i++) {
    let y = document.getElementById(board[i].id);
    if (y.liberties < 1) {
      let coords2 = y.id.split('x').join('').split('y');
      let top2 = document.getElementById('x' + coords2[0] + 'y' + (parseFloat(coords2[1]) + 1));
      let right2 = document.getElementById('x' + (parseFloat(coords2[0]) + 1) + 'y' + coords2[1]);
      let bottom2 = document.getElementById('x' + coords2[0] + 'y' + (parseFloat(coords2[1]) - 1));
      let left2 = document.getElementById('x' + (parseFloat(coords2[0]) - 1) + 'y' + coords2[1]);

      function layer2(adj2) {
        if (adj2 !== null) {
          if (adj2.color !== 'neutral') {
            if (adj2.color !== y.color) {
              adj2.liberties.push(y.id);
              y.style.backgroundImage = "url('assets/"+y.classList[2]+".png')";
            }
            if (adj2.color === y.color) {
              y.style.backgroundImage = "url('assets/"+y.classList[2]+".png')";
            }
          }
        }
      }
      layer2(top2);
      layer2(right2);
      layer2(bottom2);
      layer2(left2);

      y.color = 'neutral';
      y.connected = [];
    }
  }
  for (let i = 0; i < board.length; i++) {
    board[i].liberties = Array.from(new Set(board[i].liberties));
  }
}

function displayLastMove() {
  let x = document.getElementById(moves[moves.length-1]);
  let penultimate = document.getElementById(moves[moves.length-2]);
  if (x.id === moves[0]) {
    // black should always go first, but i thought i'd be thorough
    if (moves.length % 2 !== 0) {
      x.style.backgroundImage = "url('assets/blackLastPlayed.png')";
    }
    if (moves.length % 2 === 0) {
      x.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
    }
  }
  if (penultimate !== null) {
    if (x.id === moves[moves.length-1]) {
      if (moves.length % 2 !== 0) {
        x.style.backgroundImage = "url('assets/blackLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bws.png')";
      }
      if (moves.length % 2 === 0) {
        x.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bbs.png')";
      }
    }
    if (penultimate.liberties.length < 1) {
      penultimate.style.backgroundImage = "url('assets/"+penultimate.classList[2]+".png')";
    }
  }
}

function initialize(x) {
  x = this;
  checkSuicide(x);
  if (x.suicide !== true) {
    addStones(x);
    addConnectionsAndLiberties();
    removeStones();
    displayLastMove();
  }
  x.suicide = '';

}


function undo() {
  moves.pop();

  for (let i = 0; i < board.length; i++) {
    let x = board[i];
    x.color = 'neutral';
    x.style = "url('assets/"+x.classList[2]+".png')";
    x.liberties = [];
    x.connected = [];
    bPris = 0;
    wPris = 0;
  }
  if (moves.length > 0) {
    for (let i = 0; i < moves.length; i++) {
      let x = document.getElementById(moves[i]);
      console.log(moves);
    }
  }
}

let undoDiv = document.getElementById('undoDiv');
undoDiv.addEventListener('click', undo);






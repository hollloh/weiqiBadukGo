
/*

TODO

1) MAKE AI
     start with random moves, work from there


2) CHROME DOESN'T LIKE VERTICAL CHINESE

     writes vertically, but direction as a whole goes left to right (rather than top to bottom)

     numbers aren't completely at fault, but when zooming out to the maximum (on desktop), numbers make it VERY warped
     font size stays at a readable size even if zoomed completely out

     but even without chinese unicode, chrome stretches 'table' vertically roughly 10px

*/

let board = document.querySelectorAll('.board');
$(board).on('mouseup', initialize);

let moves = [];
let snapshot = [];

for (let i = 0; i < board.length; i++) {
  board[i].color = 'neutral';
  board[i].addEventListener('mouseenter', function(e) {
    if (e.target.color === 'neutral') {
      if (moves.length % 2 === 0) {
        e.target.style.backgroundImage = "url('assets/blackHover.png')";
      }
      if (moves.length % 2 !== 0) {
        e.target.style.backgroundImage = "url('assets/whiteHover.png')";
      }
    }
  });
  board[i].addEventListener('mouseleave', function(e) {
    if (e.target.color === 'neutral') {
      e.target.style.backgroundImage = "url('assets/"+e.target.classList[2]+".png')";
    }
  });
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
    console.log('suicide');
    x.suicide = true;
  }
  for (let i = 0; i < board.length; i++) {
    board[i].colorDemo = '';
    board[i].libertiesDemo = [];
  }
}

let moveCount = document.querySelector('#moveCount');
function addStones(x) {
  if (x.color === 'neutral') {
    moves.push(x.id);
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

let blackPrisoners = document.querySelector('#blackPrisoners');
let whitePrisoners = document.querySelector('#whitePrisoners');
let bPris = 0;
let wPris = 0;
function removeStones() {
  let x = document.getElementById(moves[moves.length-1]);
  let coords1 = x.id.split('x').join('').split('y');
  let top1 = document.getElementById('x' + coords1[0] + 'y' + (parseFloat(coords1[1]) + 1));
  let right1 = document.getElementById('x' + (parseFloat(coords1[0]) + 1) + 'y' + coords1[1]);
  let bottom1 = document.getElementById('x' + coords1[0] + 'y' + (parseFloat(coords1[1]) - 1));
  let left1 = document.getElementById('x' + (parseFloat(coords1[0]) - 1) + 'y' + coords1[1]);

  // layer1 removes liberties from stones
  // and collects prisoners if adjacent stone's liberties reach zero
  function layer1(adj1) {
    if (adj1 !== null) {
      if (adj1.color !== 'neutral') {
        if (adj1.color !== x.color) {
          adj1.liberties = adj1.liberties.filter(function(e) {
            return e !== x.id;
          });
          for (let i = 0; i < adj1.connected.length; i++) {
            let y = document.getElementById(adj1.connected[i]);
            y.liberties = adj1.liberties;
          }
          if (adj1.liberties < 1) {
            // "magic window" where the capturing stone's liberty will be where the captured stones are
            // will not pass layer2 correctly otherwise
            x.liberties.push(adj1.id);

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

  // the for loop checks the whole board for stones with zero liberties
  // layer2 "gives" the captured stone's positions as liberties to the appropriate adjacent stones
  for (let i = 0; i < board.length; i++) {
    let y = document.getElementById(board[i].id);
    if (y !== null) {
      if (y.color !== 'neutral') {
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
                  for (let j = 0; j < adj2.connected.length; j++) {
                    let z = document.getElementById(adj2.connected[j]);
                    z.liberties = adj2.liberties;
                  }
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
    }
  }
  for (let i = 0; i < board.length; i++) {
    board[i].liberties = Array.from(new Set(board[i].liberties));
  }
}

function displayLastMove() {
  let x = document.getElementById(moves[moves.length-1]);
  let penultimate = document.getElementById(moves[moves.length-2]);
  let passPen = document.getElementById(moves[moves.length-3]);

  if (moves[moves.length-1] === 'pass' && moves.length < 2) {
    return;
  }
  if (moves.length < 3) {
    if (moves[moves.length-1] === 'pass') {
      if (moves.length % 2 !== 0) {
        penultimate.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
      }
      if (moves.length % 2 === 0) {
        penultimate.style.backgroundImage = "url('assets/blackLastPlayed.png')";      
      }
    }
    if (moves[moves.length-2] === 'pass') {
      if (moves.length % 2 !== 0) {
        x.style.backgroundImage = "url('assets/blackLastPlayed.png')";
      }
      if (moves.length % 2 === 0) {
        x.style.backgroundImage = "url('assets/whiteLastPlayed.png')";      
      }
    }  
  }

  if (moves.length > 2) {
    if (moves[moves.length-1] === 'pass') {
      if (moves.length % 2 !== 0) {
        penultimate.style.backgroundImage = "url('assets/whiteLastPlayed.png')"; 
      }
      if (moves.length % 2 === 0) {
        penultimate.style.backgroundImage = "url('assets/blackLastPlayed.png')"; 
      }
    }
    if (moves[moves.length-2] === 'pass') {
      if (moves.length % 2 !== 0 ) {
        x.style.backgroundImage = "url('assets/blackLastPlayed.png')";
        passPen.style.backgroundImage = "url('assets/bbs.png')";
      }
      if (moves.length % 2 === 0) {
        x.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
        passPen.style.backgroundImage = "url('assets/bws.png')";
      }
    }
  }

  if (x !== null) {
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
      if (moves.length % 2 !== 0) {
        x.style.backgroundImage = "url('assets/blackLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bws.png')";
      }
      if (moves.length % 2 === 0) {
        x.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bbs.png')";
      }
  
      if (penultimate.liberties.length < 1) {
        penultimate.style.backgroundImage = "url('assets/"+penultimate.classList[2]+".png')";
      }
    }
  }
}

function takeSnapshot() {
  let y = [];
  function layer() {
    let bs = [];
    let ws = [];  

    for (let i = 0; i < board.length; i++) {
      if (board[i].color !== 'neutral') {
        if (board[i].color === 'b') {
          bs.push(board[i].id);
        }
        if (board[i].color === 'w') {
          ws.push(board[i].id);
        }
      }
    }
    y.push(bs);
    y.push(ws)
  }
  layer();

  snapshot.push(y);
  let last = snapshot[snapshot.length-1];
  if (snapshot.length > 1) {
    let pen = snapshot[snapshot.length-2];
    if (pen[0].length === last[0].length) {
      if (pen[1].length === last[1].length) {
        snapshot.pop();
      }
    }
  }
}

// many rules pertain to ko but i went with the elegant and universal:
// check to see each new stone creates a unique board
// otherwise fix the mistake with undo()
function ko() {
  let last = snapshot[snapshot.length-1];
  for (let i = 0; i < snapshot.length-1; i++) {
    if (last[0].length === snapshot[i][0].length) {
      if (last[1].length === snapshot[i][1].length) {
        // storing the value of halfway is key here
        // check if 'last' is an exact duplicate of 'halfway'
        let halfway = snapshot[i];
        for (let j = 0; j < last[0].length; j++) {
          if (last[0][j] !== halfway[0][j]) {
            return false;
          }
          for (let n = 0; n < last[1].length; n++) {
            if (last[1][n] !== halfway[1][n]) {
              return false;
            }
          }
          console.log('ko');
          return true;
        }
      }
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
    takeSnapshot();
    ko();
    if (ko()) {
      undo();
    }
  }
  else {
    x.suicide = false;
  }
}


function pass() {
  moves.push('pass');
  if (moves[moves.length-2] === 'pass') {
    moves.pop();
  }
  moveCount.innerHTML = 'MOVE : ' + moves.length;
  displayLastMove();
}

let passDiv = document.getElementById('passDiv');
passDiv.addEventListener('click', pass);

function undo() {
  if (moves[moves.length-1] === 'pass') {
    moves.pop();
    moveCount.innerHTML = 'MOVE : ' + moves.length;
    return;
  }
  moves.pop();
  moveCount.innerHTML = 'MOVE : ' + moves.length;

  for (let i = 0; i < board.length; i++) {
    let x = board[i];
    x.color = 'neutral';
    x.style = "url('assets/"+x.classList[2]+".png')";
    x.liberties = [];
    x.connected = [];
  }
  if (moves.length < 1) {
    snapshot.pop();
    displayLastMove();
    return;
  }
  if (moves.length < 2 && moves[0] === 'pass') {
    snapshot.pop();
    displayLastMove();
    return;
  }
  let pen = snapshot[snapshot.length-2];

  for (let i = 0; i < pen[0].length; i++) {
    let x = document.getElementById(pen[0][i]);
    x.color = 'b';
    x.style.backgroundImage = "url('assets/bbs.png')";
  }
  for (let i = 0; i < pen[1].length; i++) {
    let x = document.getElementById(pen[1][i]);
    x.color = 'w';
    x.style.backgroundImage = "url('assets/bws.png')";
  }
  // forward iteration
  for (let i = 0; i < pen.length; i++) {
    for (let j = 0; j < pen[i].length; j++) {
      let x = document.getElementById(pen[i][j]);
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
          if (adj.color !== 'neutral') {
            if (adj.color === x.color) {
              x.connected.push(adj.id);
              x.connected = x.connected.concat(adj.connected);
              // remove itself and duplicates from x.connected on the backward iteration
            }
          }  
        }
      }
      layer(top);
      layer(right);
      layer(bottom);
      layer(left);
    }
  }
  // backward iteration to get appropriate connections for stones
  // also handles reapplying liberties in a slightly different way than previous functions
  for (let i = pen.length-1; i >= 0; i--) {
    for (let j = pen[i].length-1; j >= 0; j--) {
      let x = document.getElementById(pen[i][j]);
      let coords = x.id.split('x').join('').split('y');
      let top = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) + 1));
      let right = document.getElementById('x' + (parseFloat(coords[0]) + 1) + 'y' + coords[1]);
      let bottom = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) - 1));
      let left = document.getElementById('x' + (parseFloat(coords[0]) - 1) + 'y' + coords[1]);

      function layer(adj) {
        if (adj !== null) {
          if (adj.color !== 'neutral') {
            if (adj.color === x.color) {
              x.connected.push(adj.id);
              x.connected = x.connected.concat(adj.connected);
              x.connected = x.connected.filter(function(e) {
                return e !== x.id;
              });
              x.connected = Array.from(new Set(x.connected));            
            }
            if (adj.color !== x.color) {
              x.liberties = x.liberties.filter(function(e) {
                return e !== adj.id;
              });
            }
          }  
        }
      }
      layer(top);
      layer(right);
      layer(bottom);
      layer(left);

      for (let n = 0; n < x.connected.length; n++) {
        let y = document.getElementById(x.connected[n]);
        y.connected = x.connected;
        y.connected.push(x.id);
        y.connected = y.connected.filter(function(e) {
          return e !== y.id;
        });
        y.connected = Array.from(new Set(y.connected));

        y.liberties = y.liberties.concat(x.liberties);
        y.liberties = Array.from(new Set(y.liberties));
      }
    }
  }
  // reduce prisoners, if any, here
  let last = snapshot[snapshot.length-1];
  if (pen[0].length > last[0].length) {
    wPris -= pen[0].length - last[0].length;
    whitePrisoners.innerHTML = 'WHITE PRISONERS : ' + wPris;
  }
  if (pen[1].length > last[1].length) {
    bPris -= pen[1].length - last[1].length;
    blackPrisoners.innerHTML = 'BLACK PRISONERS : ' + bPris;
  }

  snapshot.pop();
  displayLastMove(); 
}

let undoDiv = document.getElementById('undoDiv');
undoDiv.addEventListener('click', undo);






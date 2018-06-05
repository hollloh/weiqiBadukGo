
/*
TODO :
  1) turtle shape can be recaptured with incorrect amount of stones
       well, at one point this was a bug, but i can't replicate it
       and i didn't change anything.
       best guess : i played too fast and it didn't get all the connections.

  2) make faster functions
       if stones aren't added or replaced properly because it can't keep up
       that's a big problem.
       i'm pretty sure the functions and methods in 'checkLiberties()' can be optimized

  3) undo button

  4) THAT'S terror

  5) wouldn't mind making a new go project that runs mainly on
       keeping track of the move coordinates played             <--
       and adjusting the board as such                          <-- i think this is key
         (currently this project just messily
          does everything all at the same time).
      everything is very permanent.
      new project goals : make game state more lucid.
        be able to edit game state easily
          e.g. undos
               move trees

  6) 
*/


let cells = document.querySelectorAll('.cell');

$(cells).on('click', placeStone);

let moves = [];

let blackPrisoners = 0;
let whitePrisoners = 0;


let turn = 'b';
let oppose = 'w';
if (turn === 'b') {
  oppose = 'w';
}
if (turn === 'w') {
  oppose = 'b';
}
function placeStone() {
  if (!this.classList.contains('label')
  && (!this.classList.contains('b'))
  && (!this.classList.contains('w'))) {
    if (turn === 'b') {
      if (!this.classList.contains('w')) {                // idk why it only works
        this.style.backgroundImage = "url('bbs.png')";    // if i check this twice
        this.classList.add('b');
        checkLiberties(this);
        checkCount(this);
        turn = 'w';
        oppose = 'b';
      }
    }
    if (turn === 'w') {
      if (!this.classList.contains('b')) {
        this.style.backgroundImage = "url('bws.png')";
        this.classList.add('w');
        checkLiberties(this);
        checkCount(this);
        turn = 'b';
        oppose = 'w';
      }
    }
  }
}

function checkLiberties(xNode) {
  let coords = xNode.id.split('x').join('').split('y');

  let top = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) + 1));
  let right = document.getElementById('x' + (parseFloat(coords[0]) + 1) + 'y' + coords[1]);
  let bottom = document.getElementById('x' + coords[0] + 'y' + (parseFloat(coords[1]) - 1));
  let left = document.getElementById('x' + (parseFloat(coords[0]) - 1) + 'y' + coords[1]);

  xNode.liberties = [];
  xNode.connected = [];

  function updateLiberties(poten) {
    if (poten !== null) {
      if (!poten.classList.contains(oppose)) {
        xNode.liberties.push(poten.id);
        if (poten.classList.contains(turn)) {
          xNode.liberties = xNode.liberties.concat(poten.liberties);
          xNode.liberties = xNode.liberties.filter(function(e) {
            if (e !== xNode.id && e !== poten.id) {
              return e;
            }
          });
          xNode.liberties = Array.from(new Set(xNode.liberties));

          xNode.connected.push(poten.id);
          xNode.connected = xNode.connected.concat(poten.connected);
          xNode.connected = xNode.connected.filter(function(e) {
            return e !== xNode.id;
          });
          xNode.connected = Array.from(new Set(xNode.connected));
          for (let i = 0; i < xNode.connected.length; i++) {
            let x = xNode.connected[i];
            let y = document.getElementById(x);
            y.connected = xNode.connected;
            y.connected = y.connected.filter(function(e) {
              return e !== y.id;
            });
            y.connected.push(xNode.id);
            y.connected = Array.from(new Set(y.connected));
          }
        }
      }
      if (poten.classList.contains(oppose)) {
        poten.liberties = poten.liberties.filter(function(e) {
          return e !== xNode.id;
        });
        for (let i = 0; i < poten.connected.length; i++) {
          let x = poten.connected[i];
          let y = document.getElementById(x);
          y.liberties = poten.liberties;
        }
      }
      if (poten.liberties < 1) {
        let capturedCoords = poten.id.split('x').join('').split('y');

        let topCaptured = document.getElementById('x' + capturedCoords[0] + 'y' + (parseFloat(capturedCoords[1]) + 1));
        let rightCaptured = document.getElementById('x' + (parseFloat(capturedCoords[0]) + 1) + 'y' + capturedCoords[1]);
        let bottomCaptured = document.getElementById('x' + capturedCoords[0] + 'y' + (parseFloat(capturedCoords[1]) - 1));
        let leftCaptured = document.getElementById('x' + (parseFloat(capturedCoords[0]) - 1) + 'y' + capturedCoords[1]);

        function removeStones(cap) {
          if (cap !== null) {
            if (cap.classList.contains(turn)) {
              cap.liberties.push(poten.id);
            }
            if (cap.classList.contains(oppose)) {
              for (let i = 0; i < poten.connected.length; i++) {
                let x = poten.connected[i];
                let y = document.getElementById(x);
  
                let connectedCapturedCoords = y.id.split('x').join('').split('y');
  
                let connectedTop = document.getElementById('x' + connectedCapturedCoords[0] + 'y' + (parseFloat(connectedCapturedCoords[1]) + 1));
                let connectedRight = document.getElementById('x' + (parseFloat(connectedCapturedCoords[0]) + 1) + 'y' + connectedCapturedCoords[1]);
                let connectedBottom = document.getElementById('x' + connectedCapturedCoords[0] + 'y' + (parseFloat(connectedCapturedCoords[1]) - 1));
                let connectedLeft = document.getElementById('x' + (parseFloat(connectedCapturedCoords[0]) - 1) + 'y' + connectedCapturedCoords[1]);
        
                function handleConnectedStones(con) {
                  if (con !== null) {
                    if (con.classList.contains(turn)) {
                      con.liberties.push(y.id);
                    }
                  }
                }
                handleConnectedStones(connectedTop);
                handleConnectedStones(connectedRight);
                handleConnectedStones(connectedBottom);
                handleConnectedStones(connectedLeft);
              }
            }
          }
        }
        removeStones(topCaptured);
        removeStones(rightCaptured);
        removeStones(bottomCaptured);
        removeStones(leftCaptured);

        poten.style.backgroundImage = "url('grid.png')";
        if (poten.classList.contains('starPoint')) {
          poten.style.backgroundImage = "url('starPoint.png')";
        }
        if (poten.classList.contains('topLeftCorner')) {
          poten.style.backgroundImage = "url('topLeftCorner.png')";
        }
        if (poten.classList.contains('topEdge')) {
          poten.style.backgroundImage = "url('topEdge.png')";
        }
        if (poten.classList.contains('topRightCorner')) {
          poten.style.backgroundImage = "url('topRightCorner.png')";
        }
        if (poten.classList.contains('rightEdge')) {
          poten.style.backgroundImage = "url('rightEdge.png')";
        }
        if (poten.classList.contains('bottomRightCorner')) {
          poten.style.backgroundImage = "url('bottomRightCorner.png')";
        }
        if (poten.classList.contains('bottomEdge')) {
          poten.style.backgroundImage = "url('bottomEdge.png')";
        }
        if (poten.classList.contains('bottomLeftCorner')) {
          poten.style.backgroundImage = "url('bottomLeftCorner.png')";
        }
        if (poten.classList.contains('leftEdge')) {
          poten.style.backgroundImage = "url('leftEdge.png')";
        }

        if (turn === 'b') {
          if (poten.connected === 0) {
            blackPrisoners += 1;
          } else {
            blackPrisoners += poten.connected.length + 1;
          }
        }
        if (turn === 'w') {
          if (poten.connected === 0) {
            whitePrisoners += 1;
          } else {
            whitePrisoners += poten.connected.length + 1;
          }
        }

        poten.classList.remove(oppose);

        for (let i = 0; i < poten.connected.length; i++) {
          let x = poten.connected[i];
          let y = document.getElementById(x);

          y.style.backgroundImage = "url('grid.png')";
          if (y.classList.contains('starPoint')) {
            y.style.backgroundImage = "url('starPoint.png')";
          }
          if (y.classList.contains('topLeftCorner')) {
            y.style.backgroundImage = "url('topLeftCorner.png')";
          }
          if (y.classList.contains('topEdge')) {
            y.style.backgroundImage = "url('topEdge.png')";
          }
          if (y.classList.contains('topRightCorner')) {
            y.style.backgroundImage = "url('topRightCorner.png')";
          }
          if (y.classList.contains('rightEdge')) {
            y.style.backgroundImage = "url('rightEdge.png')";
          }
          if (y.classList.contains('bottomRightCorner')) {
            y.style.backgroundImage = "url('bottomRightCorner.png')";
          }
          if (y.classList.contains('bottomEdge')) {
            y.style.backgroundImage = "url('bottomEdge.png')";
          }
          if (y.classList.contains('bottomLeftCorner')) {
            y.style.backgroundImage = "url('bottomLeftCorner.png')";
          }
          if (y.classList.contains('leftEdge')) {
            y.style.backgroundImage = "url('leftEdge.png')";
          }

          y.classList.remove(oppose);
          y.connected = [];
        }
        poten.connected = [];
      }
    }
  }
  updateLiberties(top);
  updateLiberties(right);
  updateLiberties(bottom);
  updateLiberties(left);
  for (let i = 0; i < xNode.connected.length; i++) {
    let x = xNode.connected[i];
    let y = document.getElementById(x);
    y.liberties = xNode.liberties;
  }
}

function checkCount(xNode) {
  moves.push(xNode.id);
  let moveCount = document.querySelector('#moveCount');
  moveCount.innerHTML = moves.length;
  let penultimate = document.getElementById(moves[moves.length-2]);
  if (xNode.id === moves[0]) {
    if (turn === 'b') {
      xNode.style.backgroundImage = "url('blackLastPlayed.png')";
    }
    if (turn === 'w') {
      xNode.style.backgroundImage = "url('whiteLastPlayed.png')";
    }
  }
  if (penultimate !== null) {
    if (xNode.id === moves[moves.length-1]) {
      if (turn === 'b') {
        xNode.style.backgroundImage = "url('blackLastPlayed.png')";
        penultimate.style.backgroundImage = "url('bws.png')";
      }
      if (turn === 'w') {
        xNode.style.backgroundImage = "url('whiteLastPlayed.png')";
        penultimate.style.backgroundImage = "url('bbs.png')";
      }
    }  
  }
}


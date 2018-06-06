
/*
TODO :
  1) ko rule
    should be able to support 'super ko' as well

  2) undo button

*/


let cells = document.querySelectorAll('.cell');

$(cells).on('click', placeStone);

let moves = [];

let bPris = 0;
let wPris = 0;

let turn = 'b';
let oppose = 'w';
if (turn === 'b') {
  oppose = 'w';
}
if (turn === 'w') {
  oppose = 'b';
}

function placeStone() {
  if (!this.classList.contains('label')) {
    if (!this.classList.contains('b') && !this.classList.contains('w')) {
      if (turn === 'b') {
        this.style.backgroundImage = "url('assets/bbs.png')";
        this.classList.add('b');
        checkLiberties(this);
        checkCount(this);
        turn = 'w';
        oppose = 'b';
        checkSuicide(this);        
      }
    }
    if (!this.classList.contains('b') && !this.classList.contains('w')) {
      if (turn === 'w') {
        this.style.backgroundImage = "url('assets/bws.png')";
        this.classList.add('w');
        checkLiberties(this);
        checkCount(this);
        turn = 'b';
        oppose = 'w';
        checkSuicide(this);        
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

        poten.style.backgroundImage = "url('assets/grid.png')";
        if (poten.classList.contains('starPoint')) {
          poten.style.backgroundImage = "url('assets/starPoint.png')";
        }
        if (poten.classList.contains('topLeftCorner')) {
          poten.style.backgroundImage = "url('assets/topLeftCorner.png')";
        }
        if (poten.classList.contains('topEdge')) {
          poten.style.backgroundImage = "url('assets/topEdge.png')";
        }
        if (poten.classList.contains('topRightCorner')) {
          poten.style.backgroundImage = "url('assets/topRightCorner.png')";
        }
        if (poten.classList.contains('rightEdge')) {
          poten.style.backgroundImage = "url('assets/rightEdge.png')";
        }
        if (poten.classList.contains('bottomRightCorner')) {
          poten.style.backgroundImage = "url('assets/bottomRightCorner.png')";
        }
        if (poten.classList.contains('bottomEdge')) {
          poten.style.backgroundImage = "url('assets/bottomEdge.png')";
        }
        if (poten.classList.contains('bottomLeftCorner')) {
          poten.style.backgroundImage = "url('assets/bottomLeftCorner.png')";
        }
        if (poten.classList.contains('leftEdge')) {
          poten.style.backgroundImage = "url('assets/leftEdge.png')";
        }


        let blackPrisoners = document.querySelector('#blackPrisoners');
        let whitePrisoners = document.querySelector('#whitePrisoners');
        if (turn === 'b') {
          if (poten.connected === 0) {
            bPris += 1;
          } else {
            bPris += poten.connected.length + 1;
          }
        }
        if (turn === 'w') {
          if (poten.connected === 0) {
            wPris += 1;
          } else {
            wPris += poten.connected.length + 1;
          }
        }
        blackPrisoners.innerHTML = 'black prisoners : ' + bPris;
        whitePrisoners.innerHTML = 'white prisoners : ' + wPris;

        poten.classList.remove(oppose);

        for (let i = 0; i < poten.connected.length; i++) {
          let x = poten.connected[i];
          let y = document.getElementById(x);

          y.style.backgroundImage = "url('assets/grid.png')";
          if (y.classList.contains('starPoint')) {
            y.style.backgroundImage = "url('assets/starPoint.png')";
          }
          if (y.classList.contains('topLeftCorner')) {
            y.style.backgroundImage = "url('assets/topLeftCorner.png')";
          }
          if (y.classList.contains('topEdge')) {
            y.style.backgroundImage = "url('assets/topEdge.png')";
          }
          if (y.classList.contains('topRightCorner')) {
            y.style.backgroundImage = "url('assets/topRightCorner.png')";
          }
          if (y.classList.contains('rightEdge')) {
            y.style.backgroundImage = "url('assets/rightEdge.png')";
          }
          if (y.classList.contains('bottomRightCorner')) {
            y.style.backgroundImage = "url('assets/bottomRightCorner.png')";
          }
          if (y.classList.contains('bottomEdge')) {
            y.style.backgroundImage = "url('assets/bottomEdge.png')";
          }
          if (y.classList.contains('bottomLeftCorner')) {
            y.style.backgroundImage = "url('assets/bottomLeftCorner.png')";
          }
          if (y.classList.contains('leftEdge')) {
            y.style.backgroundImage = "url('assets/leftEdge.png')";
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
  moveCount.innerHTML = 'move : ' + moves.length;
  let penultimate = document.getElementById(moves[moves.length-2]);
  if (xNode.id === moves[0]) {
    // black should always go first, but i thought i'd be thorough
    if (turn === 'b') {
      xNode.style.backgroundImage = "url('assets/blackLastPlayed.png')";
    }
    if (turn === 'w') {
      xNode.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
    }
  }
  if (penultimate !== null) {
    if (xNode.id === moves[moves.length-1]) {
      if (turn === 'b') {
        xNode.style.backgroundImage = "url('assets/blackLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bws.png')";
      }
      if (turn === 'w') {
        xNode.style.backgroundImage = "url('assets/whiteLastPlayed.png')";
        penultimate.style.backgroundImage = "url('assets/bbs.png')";
      }
    }

    if (penultimate.liberties.length < 1) {
      penultimate.style.backgroundImage = "url('assets/grid.png')";
      if (penultimate.classList.contains('starPoint')) {
        penultimate.style.backgroundImage = "url('assets/starPoint.png')";
      }
      if (penultimate.classList.contains('topLeftCorner')) {
        penultimate.style.backgroundImage = "url('assets/topLeftCorner.png')";
      }
      if (penultimate.classList.contains('topEdge')) {
        penultimate.style.backgroundImage = "url('assets/topEdge.png')";
      }
      if (penultimate.classList.contains('topRightCorner')) {
        penultimate.style.backgroundImage = "url('assets/topRightCorner.png')";
      }
      if (penultimate.classList.contains('rightEdge')) {
        penultimate.style.backgroundImage = "url('assets/rightEdge.png')";
      }
      if (penultimate.classList.contains('bottomRightCorner')) {
        penultimate.style.backgroundImage = "url('assets/bottomRightCorner.png')";
      }
      if (penultimate.classList.contains('bottomEdge')) {
        penultimate.style.backgroundImage = "url('assets/bottomEdge.png')";
      }
      if (penultimate.classList.contains('bottomLeftCorner')) {
        penultimate.style.backgroundImage = "url('assets/bottomLeftCorner.png')";
      }
      if (penultimate.classList.contains('leftEdge')) {
        penultimate.style.backgroundImage = "url('assets/leftEdge.png')";
      }
    }
  }
}

function checkSuicide(xNode) {
  if (xNode.liberties.length < 1) {
    console.log('test');
    xNode.classList.remove(oppose);
    xNode.style.backgroundImage = "url('assets/grid.png')";
    if (xNode.classList.contains('starPoint')) {
      xNode.style.backgroundImage = "url('assets/starPoint.png')";
    }
    if (xNode.classList.contains('topLeftCorner')) {
      xNode.style.backgroundImage = "url('assets/topLeftCorner.png')";
    }
    if (xNode.classList.contains('topEdge')) {
      xNode.style.backgroundImage = "url('assets/topEdge.png')";
    }
    if (xNode.classList.contains('topRightCorner')) {
      xNode.style.backgroundImage = "url('assets/topRightCorner.png')";
    }
    if (xNode.classList.contains('rightEdge')) {
      xNode.style.backgroundImage = "url('assets/rightEdge.png')";
    }
    if (xNode.classList.contains('bottomRightCorner')) {
      xNode.style.backgroundImage = "url('assets/bottomRightCorner.png')";
    }
    if (xNode.classList.contains('bottomEdge')) {
      xNode.style.backgroundImage = "url('assets/bottomEdge.png')";
    }
    if (xNode.classList.contains('bottomLeftCorner')) {
      xNode.style.backgroundImage = "url('assets/bottomLeftCorner.png')";
    }
    if (xNode.classList.contains('leftEdge')) {
      xNode.style.backgroundImage = "url('assets/leftEdge.png')";
    }
    turn = oppose;
    if (turn === 'b') {
      oppose = 'w';
    }
    if (turn === 'w') {
      oppose = 'b';
    }
    moves.pop();
  }
}


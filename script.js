





let cells = document.querySelectorAll('.cell');

$(cells).on('click', placeStone);

let moves = [];

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
    if (turn === 'b') {
      if (!this.classList.contains('w')) {
        this.style.backgroundImage = "url('blackStone.png')";
        this.classList.add('b');
        checkLiberties(this);
        turn = 'w';
        oppose = 'b';
      }
    }
    if (turn === 'w') {
      if (!this.classList.contains('b')) {
        this.style.backgroundImage = "url('whiteStone.png')";
        this.classList.add('w');
        checkLiberties(this);
        turn = 'b';
        oppose = 'w';
      }
    }

    moves.push(this.id);
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
                  if (con.classList.contains(turn)) {
                    con.liberties.push(y.id);
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

        poten.style.backgroundImage = "url(grid.png)";
        poten.classList.remove(oppose);

        for (let i = 0; i < poten.connected.length; i++) {
          let x = poten.connected[i];
          let y = document.getElementById(x);

          y.style.backgroundImage = "url(grid.png)";
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




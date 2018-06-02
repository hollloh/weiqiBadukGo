





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

  function addConnectionsAndLiberties(poten) {
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
            y.connected.push(xNode.id);
            y.connected = Array.from(new Set(y.connected));
          }
        }
      }
    }
  }



  addConnectionsAndLiberties(top);
  addConnectionsAndLiberties(right);
  addConnectionsAndLiberties(bottom);
  addConnectionsAndLiberties(left);
  //console.log(xNode.liberties);
  for (let i = 0; i < xNode.connected.length; i++) {
    let x = xNode.connected[i];
    let y = document.getElementById(x);
    y.liberties = xNode.liberties;
  }
}
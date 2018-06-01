const GameGenerator = function( height = 10, width = 10, numOfMines = 10 ) {
    this.height = height;
    this.width = width;
    this.numOfMines = numOfMines;
};

// Create the board class with given size
//
const Board = function ( height = 10, width = 10, numOfMines = 10 ) {
    GameGenerator.call( this, height, width, numOfMines );

    this.gameArray = new Array();
    for ( let count = 0; count < this.width; count += 1 ) {
        this.gameArray.push(new Array( this.height ).fill( 0 ));
    }
};

    /*
    *   add methods to obj
    *   This set is for methods used in other methods
    */

Board.prototype.setBoardValue = function ( row, col, value ) {
    this.gameArray[row][col] = value;
    return this;
};

Board.prototype.getBoardValue = function ( row, col ) {
    return this.gameArray[row][col];
};

    /*
    *  this is the set of functions that setup the board
    */

Board.prototype.setMines = function ( initRow, initCol, numOfMines ) {
    // set init point to something other than 0
    this.setBoardValue( initRow, initCol, 'I' );
    for ( let index = 0; index < numOfMines + 1; ) {
        let [ row, col ] = [ Math.floor( Math.random() * this.width ), Math.floor( Math.random() * this.height ) ];
        if ( this.getBoardValue( row, col) === 0 ) {
            this.setBoardValue( row, col, 'M' );
            index += 1;
        }
    }

    // set init point back to 0
    this.setBoardValue( initRow, initCol, 0 );
    return this;
};

Board.prototype.replaceState = function ( newState ) {
    this.height = newState.height;
    this.width = newState.width;
    this.numOfMines = newState.numOfMines;

    this.gameArray = new Array();
    for ( let count = 0; count < state.width; count += 1 ) {
        this.gameArray.push(new Array( this.height ).fill( 0 ));
    }

    return this;
};

Board.prototype.setGridNumbers = function() {
    for ( let rowIndex in this.gameArray ) {
        for ( let cellIndex in this.gameArray[ rowIndex ] ) {
            let numOfSurroundingMines = 0;
            // If this cell is not a mine set the number
            if ( this.gameArray[ rowIndex ][ cellIndex ] === 0 ) {
                for ( let [ rowOffset, colOffset ] of [
                    [ -1,1 ],[ -1,0 ],[ -1,-1 ],[ 0,-1 ],
                    [ 0,1 ],[ 1,1 ],[ 1,0 ],[ 1,-1 ] ] ) {
                    let rowIndexWithOffset = Number( rowIndex ) + rowOffset;
                    let colIndexWithOffset = Number( cellIndex ) + colOffset;
                    if ( rowIndexWithOffset >= 0 && rowIndexWithOffset < this.gameArray.length && colIndexWithOffset >= 0 && colIndexWithOffset < this.gameArray[ rowIndex ].length ) {
                        if ( this.gameArray[ rowIndexWithOffset ][ colIndexWithOffset ] === 'M' ) {
                            numOfSurroundingMines += 1;
                        }
                    }
                }
            }
            if ( this.gameArray[ rowIndex ][ cellIndex ] === 0 ) {
                this.gameArray[ rowIndex ][ cellIndex ] = numOfSurroundingMines;
            }
        }
    }
    return this;
};

Board.prototype.checkEmpty = function( cellClickedObj ) {
    let row = Number(cellClickedObj.gridRow) - 1;
    let col = Number(cellClickedObj.gridCol) - 1;
    let offset = 1;
    // The rest of the flood fill algorithm is given in pseudo-code below.
    // Convert the following pseudo-code comments into javascript
    // to complete the implementation of this method.
    //

    if ( this.gameArray[row][col] > 0 ) {
        this.gameScreen[row][col].html.textContent = this.gameArray[row][col];
        this.gameScreen[row][col].html.dataset.value = this.gameArray[row][col];
    }
    this.gameScreen[row][col].html.dataset.turned = 'true';
    // Push the coordinates [row, col] onto the queue.
    // While the queue is not empty:
    let queue = [ [row, col] ];
    while ( queue.length > 0 ) {
        //    Shift a pair of coordinates [r,c] off the front of the queue.
        let [c_row, c_col] = queue.shift();
        //    The 4-connected neighbors are the cells above, below, left, and right.
        for ( let [d_row, d_col] of [
            [Number(c_row) + offset , c_col],
            [c_row, Number(c_col) + offset],
            [Number(c_row) - offset, c_col],
            [c_row, Number(c_col) - offset],
            [Number(c_row) + offset, Number(c_col) + offset],
            [Number(c_row) - offset, Number(c_col) + offset],
            [Number(c_row) - offset, Number(c_col) + offset],
            [Number(c_row) + offset, Number(c_col) - offset] ] ) {
            //    Make sure you dont go off the board
            debugger
            if ( this.gameArray[d_row][d_col] >= 0 && d_row >= 0 && d_row < this.gameArray.length && d_col >= 0 && d_col < this.gameArray[0].length && !this.gameScreen[d_row][d_col].html.classList.contains('flag') ) {
                //    Check each of those 4 neighbors:
                //       If the neighbor is oldState:
                if ( this.gameScreen[d_row][d_col].html.dataset.turned == 'false' && this.gameArray[d_row][d_col] !== 'M' ) {
                    //          Set the neighbor to new_color.
                    // this.gameArray[d_row][d_col].textContent = this.gameArray[d_row][d_col].dataset.value;
                    this.gameScreen[d_row][d_col].html.dataset.turned = 'true';
                    //          Add the neighbors coordinates to the queue
                    //          (to ensure we later check its neighbors as well).
                    if ( this.gameArray[d_row][d_col] === 0 ) {
                        queue.push( [d_row, d_col] );
                    }

                    if ( this.gameArray[d_row][d_col] > 0 ) {
                        this.gameScreen[d_row][d_col].html.textContent = this.gameArray[d_row][d_col];
                        this.gameScreen[d_row][d_col].html.dataset.value = this.gameArray[d_row][d_col];
                    }
                }
            }
        }
    }
};

    /*
    *  These functions handle gameplay and user interaction in html
    */

const gameHTML = function( height = 10, width = 10, numOfMines = 10, parent ) {
    Board.call(this, height, width, numOfMines );

    this.moveNumber = 0;
    this.clock = 0;

    this.game = document.createElement('div');
    this.game.id = 'game';

    if ( parent ) {
        this.parent = parent;
    } else {
        this.parent = document.getElementsByTagName('body')[0];
    }

    this.gameScreen = new Array();
    for ( let rowCount = 0; rowCount < this.width; rowCount += 1 ) {
        let cells = new Array();
        for ( let cellCount = 0; cellCount < this.width; cellCount += 1 ) {
            cells.push( new Cell( rowCount, cellCount, this.gameArray[ rowCount ][ cellCount ] ) );
            this.game.appendChild( cells[ cells.length - 1 ].getHTML() );
        }
        this.gameScreen.push( cells );
    }

    this.parent.appendChild( this.game );
    return this;
};

gameHTML.prototype = Object.create( Board.prototype );
gameHTML.prototype.constructor = gameHTML;

gameHTML.prototype.eventHandler = function( event ) {
    if ( event.type === 'click' && event.target.dataset.value !== 'F' ) {
        if ( this.moveNumber === 0 ) {
            this.setMines( Number(event.target.dataset.gridRow) - 1, Number(event.target.dataset.gridCol) - 1, this.numOfMines).setGridNumbers();
            this.checkEmpty( { gridRow: event.target.dataset.gridRow , gridCol: event.target.dataset.gridCol } );
            // event.target.dataset.turned = 'true';
            setInterval( () => {
                this.clock += 1;
            }, 1000);
            this.moveNumber += 1;
            // this.gameArray[ Number(event.target.dataset.gridRow) - 1 ][ Number(event.target.dataset.gridCol) - 1 ]
        } else {
            this.moveNumber += 1;
            if ( this.gameArray[event.target.dataset.row][event.target.dataset.col] === 'M' ) {
                alert('you lose');
            } else {
                this.checkEmpty( {
                    gridRow: event.target.dataset.gridRow,
                    gridCol: event.target.dataset.gridCol,
                } );
            }
        }
    } else if ( event.type === 'contextmenu' ) {
        event.preventDefault();
        event.target.dataset.value = 'F';
        event.target.classList.add('flag');
    }
};

gameHTML.prototype.addList = function() {
    this.binded = this.eventHandler.bind( this );
    this.game.addEventListener('click', this.binded );
    this.game.addEventListener('contextmenu', this.binded );
};

const game = new gameHTML( 8,8,10,document.getElementById('main') );
game.addList();

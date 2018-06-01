const dirs = [ [ -1 , 1 ] , [ -1 , 0 ] , [ -1 , -1 ] , [ 0 , -1 ] , [ 0 , 1 ] , [ 1 , 1 ] , [ 1 , 0 ] , [ 1 , -1 ] ];

const Board = function( height, width, parent ) {

    // add params to obj
    this.height = height;
    this.width = width;
    this.parent = parent;

    // Header of board
    // The clock sits in the right hand corner and counts in seconds.
    this.clock = 0;
    // reset sits in the middle of the board and has an image depicting game state
    // 0 == game hasn't started
    // 1 == game in progress
    // 2 == game over player lost
    // 3 == game over player won
    this.resetStatus = 0;
    // flags left
    this.flags = 0;

    // set row / col in onClick
    this.boardHTML = new Array();

    return this;
};

Board.prototype.createHeaderHTML = function() {
    // create the header
};

// add methods to obj
Board.prototype.setBoardValue = function ( row, col, value ) {
    this.boardModel[row][col] = value;
    return this;
};

Board.prototype.getBoardValue = function ( row, col ) {
    return this.boardModel[row][col];
};

//
Board.prototype.layMinefield = function( initRow, initCol, numOfMines ) {
    let minePositions = [ [ initRow, initCol ] ];
    this.flags = numOfMines;
    this.setBoardValue( initRow, initCol, 'I' );
    for ( let index = 0; index <= numOfMines + 1; ) {
        let [ row, col ] = [ Math.floor( Math.random() * this.width ), Math.floor( Math.random() * this.height ) ];
        if ( this.getBoardValue( row, col) !== 'M' && this.getBoardValue( row, col ) !== 'I' ) {
            minePositions.push( [ row, col ] );
            this.setBoardValue( row, col, 'M' );
            index += 1;
        }
    }
    this.setBoardValue( initRow, initCol, '0' );
    return this;
};


Board.prototype.createBoard = function() {
    this.boardModel = new Array( this.height );
    for ( let rowIndex = 0; rowIndex < this.height; rowIndex += 1 ) {
        this.boardModel[rowIndex] = new Array( this.width );
        this.boardModel[rowIndex].fill( '0' );
    }
    return this;
};

// html board
Board.prototype.createBoardHTML = function() {
    for ( let rowIndex in this.boardModel ) {
        this.boardHTML.push( new Array() );
        for ( let colIndex in this.boardModel[rowIndex] ) {
            let cell = new Cell( rowIndex, colIndex, this.boardModel[rowIndex][colIndex] );
            this.boardHTML[ this.boardHTML.length - 1 ].push( cell );
            this.parent.appendChild( cell.getHTML() );
        }
    }
    return this;
};

Board.prototype.setGridNumbers = function() {
    for ( let rowIndex in this.boardModel ) {
        for ( let cellIndex in this.boardModel[rowIndex] ) {
            let numOfSurroundingMines = 0;
            // If this cell is not a mine set the number
            if ( this.boardModel[rowIndex][cellIndex] === '0' ) {
                for ( let [ rowOffset, colOffset ] of dirs ) {
                    let rowIndexWithOffset = Number(rowIndex) + rowOffset;
                    let colIndexWithOffset = Number(cellIndex) + colOffset;
                    if ( rowIndexWithOffset >= 0 && rowIndexWithOffset < this.boardModel.length && colIndexWithOffset >= 0 && colIndexWithOffset < this.boardModel[rowIndex].length ) {
                        if ( this.boardModel[ rowIndexWithOffset ][ colIndexWithOffset ] === 'M' ) {
                            numOfSurroundingMines += 1;
                        }
                    }
                }
            }
            if ( this.boardModel[rowIndex][cellIndex] === '0' ) {
                this.boardModel[rowIndex][cellIndex] = numOfSurroundingMines.toString();
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
    this.boardHTML[row][col].html.textContent = this.boardHTML[row][col].html.dataset.value;
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
            if ( d_row >= 0 && d_row < this.boardHTML.length && d_col >= 0 && d_col < this.boardHTML[0].length ) {
                //    Check each of those 4 neighbors:
                //       If the neighbor is oldState:
                if ( this.boardHTML[d_row][d_col].html.dataset.value === '0' && this.boardHTML[d_row][d_col].html.dataset.value !== 'M' && this.boardHTML[d_row][d_col].html.dataset.turned == 'false' ) {
                    //          Set the neighbor to new_color.
                    this.boardhtml[d_row][d_col].html.textcontent = this.boardhtml[d_row][d_col].html.dataset.value;
                    this.boardhtml[d_row][d_col].html.dataset.turned = 'true';
                    //          Add the neighbors coordinates to the queue
                    //          (to ensure we later check its neighbors as well).
                    queue.push( [d_row, d_col] );
                // } else if ( this.boardHTML[d_row][d_col].html.dataset.value !== 'M'/* && this.boardHTML[d_row][d_col].html.dataset.turned == 'false'*/) {
                // //     //          Set the neighbor to new_color.
                //     this.boardHTML[d_row][d_col].html.textContent = this.boardHTML[d_row][d_col].html.dataset.value;
                //     this.boardHTML[d_row][d_col].html.dataset.turned = 'true';
                }
            }
        }

        for ( let [d_row, d_col] of [
            [Number(c_row) + offset , c_col],
            [c_row, Number(c_col) + offset],
            [Number(c_row) - offset, c_col],
            [c_row, Number(c_col) - offset],
            [Number(c_row) + offset, Number(c_col) + offset],
            [Number(c_row) - offset, Number(c_col) + offset],
            [Number(c_row) - offset, Number(c_col) + offset],
            [Number(c_row) + offset, Number(c_col) - offset] ] ) {
            this.boardhtml[d_row][d_col].html.textcontent = this.boardhtml[d_row][d_col].html.dataset.value;
            this.boardhtml[d_row][d_col].html.dataset.turned = 'true';
        }
    }
};

Board.prototype.eventHandler = function(event) {
    if ( event.type === 'mouseup' && state.initClick === true ) {
        state.board.checkEmpty( state.cellClicked );
    } else if ( state.initClick === false ) {
        state.initClick = true;
        state.board.checkEmpty( state.cellClicked );
    }
};

const Cell = function( rowIndex, colIndex, value ) {

    this.rowIndex = Number(rowIndex);
    this.colIndex = Number(colIndex);

    this.html = document.createElement( 'div' );
    // make sure input is a number and is
    // offset for css grid
    this.html.dataset.gridRow = this.rowIndex + 1;
    this.html.dataset.gridCol = this.colIndex + 1;
    this.html.dataset.row = this.rowIndex;
    this.html.dataset.col = this.colIndex;
    this.html.dataset.value = value;
    this.html.dataset.turned = false;

    this.html.classList.add( 'cell' );
    this.html.style.gridRow = this.html.dataset.gridRow;
    this.html.style.gridColumn = this.html.dataset.gridCol;

    if ( value === 'M' ) {
        this.adjacentMines = null;
    } else if ( Number(value) >= 0 ) {
        this.adjacentMines = Number(value);
    }

    return this;
};

Cell.prototype.setValue = function( value ) {
    this.html.dataset.value = value;
    return this;
};

Cell.prototype.getHTML = function() {
    return this.html;
};


const Cell = function(rowIndex, colIndex, value, content) {

    this.rowIndex = Number(rowIndex);
    this.colIndex = Number(colIndex);

    this.html = document.createElement( 'div' );
    // make sure input is a number and is
    // offset for css grid
    this.html.dataset.gridRow = this.rowIndex + 1;
    this.html.dataset.gridCol = this.colIndex + 1;
    this.html.dataset.value = value;

    this.html.classList.add( 'cell' );
    this.html.style.gridRow = this.html.dataset.gridRow;
    this.html.style.gridColumn = this.html.dataset.gridCol;
    this.html.textContent = content;

    this.html.dataset.turned = false;

    if ( value === 'M' ) {
        this.html.dataset.isMine = true;
        this.adjacentMines = null;
    } else if ( Number(value) >= 0 ) {
        this.adjacentMines = Number(value);
        this.html.dataset.isMine = false;
    }

    return this;
};

Cell.prototype.handleEvent = function( event ) {
    if( event.type === 'mousedown' ) {
        if( this.dataset.isMine === 'true' ) {
            alert('you lose');
        } else if( this.dataset.turned === 'false' ) {
            this.dataset.turned = true;
            // this.textContent = this.dataset.value;
            // find a better way to do this
            // pass cell info to global state obj
            state.cellClicked = {
                gridRow: this.dataset.gridRow,
                gridCol: this.dataset.gridCol,
            };
        }
    }
};

Cell.prototype.getHTML = function() {
    this.html.addEventListener('mousedown', this.handleEvent );
    return this.html;
};


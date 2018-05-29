const state = {
    initClick: false,
    cellClicked: {
        gridCol: 0,
        gridRow: 0,
    },
    game: document.getElementById('game'),
    board: new Board( 8, 8, game ),
};

state.board.createBoard().layMinefield(0,0,10);
state.board.setGridNumbers().createBoardHTML();
state.board.parent.addEventListener('mouseup', state.board.eventHandler);


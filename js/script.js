var game = new Chess();
var MinimaxRoot = function(depth,game,is_max){
	var new_moves = game.ugly_moves();
	var best_move = -Math.pow(2,30);
	var best_move_found;

	for(var i=0;i<new_moves.length;i++){
		var new_move = new_moves[i];
		game.ugly_move(new_move);
		var value = Minimax(depth-1,game,-Math.pow(2,30)-1,Math.pow(2,30)+1,!is_max);
		game.undo();
		if(value >= best_move){
			best_move = value;
			best_move_found = new_move;
		}
	}
	return best_move_found;
};

var Minimax = function(depth,game,alpha,beta,is_max){
	position_count++;
	if(depth === 0){
		return -evaluate_board(game.board());
	}
	var new_moves = game.ugly_moves();

	if(is_max){
		var best_move = -Math.pow(2,30);
		for(var i=0;i<new_moves.length;i++){
			game.ugly_move(new_moves[i]);
			best_move = Math.max(best_move,Minimax(depth-1,game,alpha,beta,!is_max));
			game.undo();
			alpha = Math.max(alpha,best_move);
			if(beta <= alpha){
				return best_move;
			}
		}
		return best_move;
	} else{
		var best_move = Math.pow(2,30);
		for(var i=0;i<new_moves.length;i++){
			game.ugly_move(new_moves[i]);
			best_move = Math.min(best_move,Minimax(depth-1,game,alpha,beta,!is_max));
			game.undo();
			beta = Math.min(beta,best_move);
			if(beta <= alpha){
				return best_move;
			}
		}
		return best_move;
	}
};

var evaluate_board = function(board){
	var total = 0;
	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			total+= get_piece_value(board[i][j],i,j);
		}
	}
	return total;
};

var reverse_array = function(array){
	return array.slice().reverse();
}

var pawn_eval_white =
[
	[ 0,  0,  0,  0,  0,  0,  0,  0],
	[50, 50, 50, 50, 50, 50, 50, 50],
	[10, 10, 20, 30, 30, 20, 10, 10],
	[ 5,  5, 10, 25, 25, 10,  5,  5],
	[ 0,  0,  0, 20, 20,  0,  0,  0],
	[ 5, -5,-10,  0,  0,-10, -5,  5],
	[ 5, 10, 10,-20,-20, 10, 10,  5],
	[ 0,  0,  0,  0,  0,  0,  0,  0]
];

var pawn_eval_black = reverse_array(pawn_eval_white);

var knight_eval =
[
	[-50,-40,-30,-30,-30,-30,-40,-50],
	[-40,-20,  0,  0,  0,  0,-20,-40],
	[-30,  0, 10, 15, 15, 10,  0,-30],
	[-30,  5, 15, 20, 20, 15,  5,-30],
	[-30,  0, 15, 20, 20, 15,  0,-30],
	[-30,  5, 10, 15, 15, 10,  5,-30],
	[-40,-20,  0,  5,  5,  0,-20,-40],
	[-50,-40,-30,-30,-30,-30,-40,-50]
];

var bishop_eval_white =
[
	[-20,-10,-10,-10,-10,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5, 10, 10,  5,  0,-10],
	[-10,  5,  5, 10, 10,  5,  5,-10],
	[-10,  0, 10, 10, 10, 10,  0,-10],
	[-10, 10, 10, 10, 10, 10, 10,-10],
	[-10,  5,  0,  0,  0,  0,  5,-10],
	[-20,-10,-10,-10,-10,-10,-10,-20]
];

var bishop_eval_black = reverse_array(bishop_eval_white);

var rook_eval_white =
[
	 [ 0,  0,  0,  0,  0,  0,  0,  0],
	 [ 5, 10, 10, 10, 10, 10, 10,  5],
	 [-5,  0,  0,  0,  0,  0,  0, -5],
	 [-5,  0,  0,  0,  0,  0,  0, -5],
	 [-5,  0,  0,  0,  0,  0,  0, -5],
	 [-5,  0,  0,  0,  0,  0,  0, -5],
	 [-5,  0,  0,  0,  0,  0,  0, -5],
	 [ 0,  0,  0,  5,  5,  0,  0,  0]
];

var rook_eval_black = reverse_array(rook_eval_white);

var queen_eval =
[
	[-20,-10,-10, -5, -5,-10,-10,-20],
	[-10,  0,  0,  0,  0,  0,  0,-10],
	[-10,  0,  5,  5,  5,  5,  0,-10],
	[ -5,  0,  5,  5,  5,  5,  0, -5],
	[  0,  0,  5,  5,  5,  5,  0, -5],
	[-10,  5,  5,  5,  5,  5,  0,-10],
	[-10,  0,  5,  0,  0,  0,  0,-10],
	[-20,-10,-10, -5, -5,-10,-10,-20]
];

var king_eval_white =
[
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-30,-40,-40,-50,-50,-40,-40,-30],
	[-20,-30,-30,-40,-40,-30,-30,-20],
	[-10,-20,-20,-20,-20,-20,-20,-10],
	[ 20, 20,  0,  0,  0,  0, 20, 20],
	[ 20, 30, 10,  0,  0, 10, 30, 20]
];

var king_eval_black = reverse_array(king_eval_white);

var get_piece_value = function(piece,x,y){
	if(piece === null){
		return 0;
	}
	var get_absolute_value = function(piece,is_white,x,y){
		if(piece.type === 'p'){
			return 10+(is_white?pawn_eval_white[y][x] : pawn_eval_black[y][x]);
		} else if (piece.type === 'r'){
			return 50+(is_white?rook_eval_white[y][x] : rook_eval_black[y][x]);
		} else if (piece.type === 'n'){
			return 30+knight_eval[y][x]
		} else if (piece.type === 'b'){
			return 30+(is_white?bishop_eval_white[y][x] : bishop_eval_black[y][x]);
		} else if (piece.type === 'q'){
			return 90+queen_eval[y][x];
		} else if (piece.type === 'k'){
			return 900+(is_white?king_eval_white[y][x]:king_eval_black[y][x]);
		}
		throw "Unkown piece type: "+ piece.type;
	};

	var absolute_value = get_absolute_value(piece,piece.color === 'w',x,y);
	return piece.color === 'w'?absolute_value:-absolute_value;
};

var on_drag_start = function(source,piece,position,orientation){
	if(game.in_checkmate() ===  true || game.in_draw() === true || piece.search(/^b/) !== -1){
		return false;
	}
};

var make_best_move = function(){
	var best_move = get_best_move(game);
	game.ugly_move(best_move);
	board.position(game.fen());
	render_move_history(game.history());
	if(game.game_over()){
		alert('Game Over');
	}
};

var position_count;

var get_best_move = function(game){
	if(game.game_over()){
		alert('Game Over');
	}
	position_count = 0;
	var depth = parseInt($('#search-depth').find(':selected').text());
	var d = new Date().getTime();
	var best_move = MinimaxRoot(depth,game,true);
	var d2 = new Date().getTime();
	var move_time = (d2-d);
	var position_per_s = (position_count*1000/move_time);

	$('#position-count').text(position_count);
	$('#time').text(move_time/1000 + 's');
	$('#position-per-s').text(position_per_s);
	return best_move;
}

var render_move_history = function(moves){
	var history_element = $('#move-history').empty();
	history_element.empty();
	for(var i=0;i<moves.length;i=i+2){
		var userPiece;
		var botPiece;
		switch (moves[i].charAt(0)) {
			case 'N':
				userPiece = "<img src=\"img/chess-knight.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(1,3);
				break;
			case 'B':
				userPiece = "<img src=\"img/bishop.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(1,3);
				break;
			case 'R':
				userPiece = "<img src=\"img/chess-rok.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(1,3);
				break;
			case 'Q':
				userPiece = "<img src=\"img/chess-queen.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(1,3);
				break;
			case 'K':
				userPiece = "<img src=\"img/chess-king.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(1,3);
				break;
			case 'O':
				userPiece ="<img src=\"img/chess-king.png\"> <-> <img src=\"img/chess-rok.png\">";
				break;
			default:
				userPiece = "<img src=\"img/chess-pawn.png\">";
				if(moves[i].charAt(1) == 'x')
					userPiece += "<img src=\"img/swords.png\">" +  moves[i].substr(2,3);
				else
					userPiece += moves[i].substr(0,3);
		}
		if(moves[i+1])
		{
			switch (moves[i+1].charAt(0)) {
				case 'N':
					botPiece = "<img src=\"img/chess-knight.png\">" ;
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(1,3);
					break;
				case 'B':
					botPiece = "<img src=\"img/bishop.png\">";
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(1,3);
					break;
				case 'R':
					botPiece = "<img src=\"img/chess-rok.png\">";
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(1,3);
					break;
				case 'Q':
					botPiece = "<img src=\"img/chess-queen.png\">";
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(1,3);
					break;
				case 'K':
					botPiece = "<img src=\"img/chess-king.png\">";
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(1,3);
					break;
				case 'O':
					botPiece ="<img src=\"img/chess-king.png\"> <-> <img src=\"img/chess-rok.png\">";
					break;
				default:
					botPiece = "<img src=\"img/chess-pawn.png\">"
					if(moves[i+1].charAt(1) == 'x')
						botPiece += "<img src=\"img/swords.png\">" +  moves[i+1].substr(2,3);
					else
						botPiece += moves[i+1].substr(0,3);
			}
		}
		history_element.append('<span>'+ userPiece +' - '+(moves[i+1]?botPiece:' ')+ '</span><br>')
	}
	history_element.scrollTop(history_element[0].scrollHeight);
}

var on_drop = function(source,target){
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q'
	});
	remove_gray_squares();
	if(move === null){
		return 'snapback';
	}
	render_move_history(game.history());
	window.setTimeout(make_best_move,250);
}

var on_snap_end = function(){
	board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    remove_gray_squares();
};

var remove_gray_squares = function(){
	$('#board .square-55d63').css('background', '');
}

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: on_drag_start,
    onDrop: on_drop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: on_snap_end
};
board = ChessBoard('board', cfg);

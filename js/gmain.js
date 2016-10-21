/**
 *  main algorithm of gobang
 */
var N = 15;
var MAX_DEPTH = 7;            /* 必需为奇数 */
var MAX_POINT = 2;   
var WIN_SCORE = 4320;
var CUR_TYPE = 1;

var board = new Array();        // 0-blank  1-black 2-white	
var t_board = new Array();      // temp board
initBoard();

var count = 0;

//test(); 
function test() {
	board[7][7] = 1;
//	board[8][8] = 2;
	t_board[7][7] = 1;
//	t_board[8][8] = 2;
	CUR_TYPE = 2;
	var bp = getBestPoint(MAX_DEPTH, CUR_TYPE);
	alert(bp[0] + " " + bp[1] + " " + bp[2]);
}

function initBoard() {
	for(var i = 0; i < N; i++) {
		board[i] = new Array();
		t_board[i] = new Array();
		for(var j = 0; j < N; j++) {
			board[i][j] = 0;
			t_board[i][j] = 0;
		}
	}
}

/**
 * 当前盘面 t_board最好点
 * @param DEPTH 深度，等于1时, 直接返回, 否则递归调用
 * @param type
 * @return
 */
function getBestPoint(DEPTH, type) {
	count++;	
	
	var curScore = getBestScore(t_board, type);                //t_board盘面下type下最好的点集合
	var opsScore = getBestScore(t_board, type == 1 ? 2 : 1);   //t_board盘面下type对手最好的点集合
	if(curScore[0][2] >= WIN_SCORE) {
		return curScore[0];
	}
	if(opsScore[0][2] >= WIN_SCORE) {
		return opsScore[0];
	}
	
	if(DEPTH == 1) {
		// DEPTH=1 直接返回当前盘面。如果对手下得分高于己方得分，则防守下对手位置，否则下己方位置
		if(curScore[0][2] >= opsScore[0][2]) {
			return curScore[0];
		} else {
			return opsScore[0];
		}
	} else {
		// DEPTH > 1， 对当前盘面多个候选点进行评估
		var curPoint = new Array(0, 0, 0);
		for(var i = 0; i < MAX_POINT; i++) {
			t_board[curScore[i][0]][curScore[i][1]] = type;
			var tmpPoint = getBestPoint(DEPTH - 1, type == 1 ? 2 : 1);
			if(curPoint[2] < tmpPoint[2]) {
				curPoint = tmpPoint;
			}
			t_board[curScore[i][0]][curScore[i][1]] = 0;
		}
		
		// 减少计算， 对手只考虑当前盘面
		var curOpsPoint = new Array(0, 0, 0);
		for(var i = 0; i < MAX_POINT; i++) {
			t_board[opsScore[i][0]][opsScore[i][1]] = type;
			var tmpPoint = getBestPoint(1, type == 1 ? 2 : 1);
			if(curOpsPoint[2] < tmpPoint[2]) {
				curOpsPoint = tmpPoint;
			}
			t_board[opsScore[i][0]][opsScore[i][1]] = 0;
		}
		
		/* 判断是攻击还是防守  */
		if(curPoint[2] >= WIN_SCORE) {
			return curPoint;
		}
		if(curOpsPoint[2] >= WIN_SCORE) {
			return curOpsPoint;
		}
		if(curPoint[2] >= curOpsPoint[2]) {
			return curPoint;
		} else {
			return curOpsPoint;
		}
		
	}
}


/**
 * 返回当前t_board, chess为type的最佳, i, j, socre
 * @param t_board
 * @param type
 * @return
 */
function getBestScore(t_board, type) {		
	var bp = new Array; // [MAX_POINT][i, j, bestScore]
	for(var t = 0; t < MAX_POINT; t++) {
		bp[t] = new Array(0, 0, 0);
	}
	for(var i = 0; i < MAX_POINT; i++) {
		bp[i][0] = -1;
		bp[i][1] = -1;
		bp[i][2] = -1;
	}
	
	for(var i = 0; i < N; i++) {
		for(var j = 0; j < N; j++) {
			if(t_board[i][j] == 0) {
				var score = calScore(i, j, t_board, type);				
				for(var k = 0; k < MAX_POINT; k++) {
					if(score > bp[k][2]) {
						
						for(var t  = MAX_POINT -1; t > k; t--) {
							bp[t][2] = bp[t-1][2];
							bp[t][0] = bp[t-1][0];
							bp[t][1] = bp[t-1][1];
						}
						
						bp[k][2] = score;
						bp[k][0] = i;
						bp[k][1] = j;
					}
				}
			}
		}
	}

	return bp ;
}	


/*
 * if put i, j with type, calate the score
 * */
function calScore(i, j, t_board, type) {
	
	var tmp = t_board[i][j];
	t_board[i][j] = type;
	
	var score = 0;
	// 横向
	var line = "";
	for(var t = i; t >= 0; t--) {
		if(t_board[t][j] == 0 || t_board[t][j] == type) {
			line = t_board[t][j] + line;
		} else {
			break;
		}
	}
	for(var t = i+1; t < N; t++) {
		if(t_board[t][j] == 0 || t_board[t][j] == type) {
			line += t_board[t][j];
		} else {
			break;
		}
	}
	
	score += valScore(line);
	line = "";

	// 纵向
	for(var t = j; t >= 0; t--) {
		if(t_board[i][t] == 0 || t_board[i][t] == type) {
			line = t_board[i][t] + line;
		} else {
			break;
		}
	}
	for(var t = j + 1; t < N; t++) {
		if(t_board[i][t] == 0 || t_board[i][t] == type) {
			line += t_board[i][t];
		} else {
			break;
		}
	}
	score += valScore(line);
	line = "";
	
	// left top
	for(var ii = i, jj = j; ii >=0  && jj >=0 ; ii--, jj-- ) {
		if(t_board[ii][jj] == 0 || t_board[ii][jj] == type) {
			line = t_board[ii][jj] + line;
		} else {
			break;
		}			
	}
	for(var ii = i+1, jj = j+1; ii < N && jj < N; ii++, jj++ ) {
		if(t_board[ii][jj] == 0 || t_board[ii][jj] == type) {
			line += t_board[ii][jj];
		} else {
			break;
		}			
	}
	score += valScore(line);
	line = "";
	
	// right top
	for(var ii = i, jj = j; ii >= 0 && jj < N ; ii--, jj++ ) {
		if(t_board[ii][jj] == 0 || t_board[ii][jj] == type) {
			line = t_board[ii][jj] + line;
		} else {
			break;
		}			
	}
	for(var ii = i+1, jj = j-1; ii < N && jj >= 0; ii++, jj-- ) {
		if(t_board[ii][jj] == 0 || t_board[ii][jj] == type) {
			line += t_board[ii][jj];
		} else {
			break;
		}			
	}

//	System.out.println(" " + i + " " + j);	
	
	score += valScore(line);
	
	t_board[i][j] = tmp;
	
	return score;
}

/* calculate score */
function valScore(line) {

	line = line.replace(/2/g, "1");
//console.log(line);
	if(line.indexOf("11111") >= 0) {
		return 50000;
	}
	if(line.indexOf("011110") >= 0) {
		return 4320;
	}
	if(line.indexOf("11110") >= 0 || line.indexOf("01111") >= 0) {
		return 1800;
	}	
	if(line.indexOf("011100") >= 0 || line.indexOf("001110") >= 0 || line.indexOf("011010") >= 0 
			|| line.indexOf("010110") >= 0 || line.indexOf("11110") >= 0 || line.indexOf("01111") >= 0 
			|| line.indexOf("11011") >= 0 || line.indexOf("10111") >= 0 || line.indexOf("11101") >= 0) {
		return 720;
	}
	
	if(line.indexOf("001100") >= 0 || line.indexOf("001010") >= 0 || line.indexOf("010100") >= 0) {
		return 120;
	}
	if(line.indexOf("000100") >= 0 || line.indexOf("001000") >= 0) {
		return 20;
	}
	return 0;
}	

function isWin(i, j, t_board, type) {
	var score = calScore(i, j, t_board, type); 
//	alert(type + " " + score);
	if(score >= 50000) {
		return true; 
	} else {
		return false;
	}
}

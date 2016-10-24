	
var N = 15;
	
//var chess = new Array();
//initChess();
  
// Blank, B, BB, BBB, BBBB,  W, WW, WWW, WWWW, Others
var BScoreTable = new Array(7, 35, 800, 15000, 800000, 15, 400, 1800, 100000, 0, 0);
var WScoreTable = new Array(7, 15, 400, 1800,  100000, 35, 800, 15000, 800000,  0, 0);

var BLANK = 0;
var BLACK = 1;
var WHITE = 2;
var MAX_DEPTH = 4; 
var CUR_TYPE = BLACK;

var TMP_COUNT = 0;

function getBestPoint(i, j , type) {
	
if(isWin(i, j , type)) {
	if(type != CUR_TYPE) {
		return new Array(-1, -1, 0)		
	} else {
		return new Array(-1, -1, 10000000)
	}
	
}
	var bp = new Array(0, 0, 0); //i, j, score
	
	// left top， area 5 box
	var ti = (i-5) < 0 ? 0 : i-5;   // top left i
	var tj = (j-5) < 0 ? 0 : j-5;   // top left j
	var bi = (i + 5) >= N ? N : i+5;
	var bj = (j + 5) >= N ? N : j+5
	
	for(var m = ti; m < bi; m++) {
		for(n = tj; n < bj; n++) {
			if(chess[m][n] == BLANK) {
				var score = calScore(m, n, type);
					if(bp[2] < score) {
					bp[0] = m;
					bp[1] = n;
					bp[2] = score;
				}
			}			
		}
	}
	
	return bp;
}

function getPoints(i, j , type) {
if(isWin(i, j , type)) {
	var rtn = new Array();
	if(type != CUR_TYPE) {
		rtn[0] = new Array(-1, -1, 0);
	} else {
		rtn[0] = new Array(-1, -1, 10000000);
	}
}	
	var bp = new Array();
	
	var k = 0;
	
	
	// left top， area 5 box
	var ti = (i-5) < 0 ? 0 : i-5;   // top left i
	var tj = (j-5) < 0 ? 0 : j-5;   // top left j
	var bi = (i + 5) >= N ? N : i+5;
	var bj = (j + 5) >= N ? N : j+5
	
	for(var m = ti; m < bi; m++) {
		for(n = tj; n < bj; n++) {
			if(chess[m][n] == BLANK) {
				var score = calScore(m, n, type);
				bp[k] = new Array(m, n, score);
				k++;
			}
		}			
	}
	
	return bp;	
	
}

function search(i, j, type, depth, parentScore) {
TMP_COUNT++;
	if(depth == 1)  {
		var bp = getBestPoint(i, j, type);
		return bp;
	}
	
	var bpp = getPoints(i, j, type);
//	type = (type == BLACK ? WHITE : BLACK);
	
	var point = new Array(-1, -1, -1);
	// if type == CUR_TYPE, get min, or get max
	for(var k = 0; k < bpp.length; k++) {
		chess[bpp[k][0]][bpp[k][1]] = type;

		var tmpPoint = search(bpp[k][0], bpp[k][1], type == BLACK ? WHITE : BLACK, depth-1, point[2]);
		if(point[0] == -1) {
			point = tmpPoint;
		} else {
			if(type == CUR_TYPE) {  
				// get min
				if(point[2] > tmpPoint[2]) {
					point = tmpPoint;
				}
				if(parentScore != -1 && point[2] <= parentScore) {
					chess[bpp[k][0]][bpp[k][1]] = BLANK;
					break;
				}
			} else {
				if(point[2] < tmpPoint[2]) {
					point = tmpPoint;
				}
				if(parentScore != -1 && point[2] >= parentScore) {
					chess[bpp[k][0]][bpp[k][1]] = BLANK;
					break;
				}				
			}			
		}

		chess[bpp[k][0]][bpp[k][1]] = BLANK;
	}
	return point;
}


function calScore(i, j, type) {
	var scoreTable;
	if(type == BLACK) {
		scoreTable = BScoreTable;
	} else {
		scoreTable = WScoreTable;
	}
	
	var score = 0;
	var tuple = new Array(0, 0, 0);   // 0-blank  1-black  2-white
	var ti = 0, tj = 0;
	var headi = -1, headj = -1, count = 0;
	
	// horizontal
	for(ti = (i-4 < 0 ? 0 : i-4); ti <= i + 4 && ti < N; ti++) {
		if(headi == -1) {
			headi = ti;
		}
		tuple[chess[ti][j]]++;
		count++;
		
		if(count >= 5) {
	
			if(tuple[0] == 5) {
				score += scoreTable[0];
			} else if(tuple[2] == 0) {
				// all black
				score += scoreTable[tuple[1]];
			} else if(tuple[1] == 0) {
				// all white
				score += scoreTable[tuple[2] + 4];
			}
//console.log(i + " " + j + " blank: " + tuple[0] + ", black " + tuple[1] + ", white " + tuple[2] + "total score:" + score);	

			// remove head point
			tuple[chess[headi][j]]--;
			headi++;
		}
	}

	tuple[0] = 0;
	tuple[1] = 0;
	tuple[2] = 0;
	headi = -1;
	headj = -1;
	count = 0;
	// verticle
	for(tj = (j-4 < 0 ? 0 : j-4); tj <= j + 4 && tj < N; tj++) {
		if(headj == -1) {
			headj = tj;
		}
		tuple[chess[i][tj]]++;
		count++;
		
		if(count >= 5) {
			if(tuple[0] == 5) {
				score += scoreTable[0];
			} else if(tuple[2] == 0) {
				// all black
				score += scoreTable[tuple[1]];
			} else if(tuple[1] == 0) {
				// all white
				score += scoreTable[tuple[2] + 4];
			}
			
			// remove head point
			tuple[chess[i][headj]]--;
			
			headj++;
		}
	}	
	
	tuple[0] = 0;
	tuple[1] = 0;
	tuple[2] = 0;
	headi = -1;
	headj = -1;
	count = 0;
	var delta = 0;
	if(i < j) {
		delta = (i-4 < 0 ? i : 4);
	} else {
		delta = (j-4 < 0 ? j : 4);
	}
	// top left to right bottom, i++,j++
	for(ti = i-delta, tj = j-delta; ti <= i + 4 && ti < N && tj <= j+4 && tj < N ; ti++, tj++) {
		if(headj == -1) {
			headi = ti;
			headj = tj;
		}
		tuple[chess[ti][tj]]++;
		count++;
		
		if(count >= 5) {
			if(tuple[0] == 5) {
				score += scoreTable[0];
			} else if(tuple[2] == 0) {
				// all black
				score += scoreTable[tuple[1]];
			} else if(tuple[1] == 0) {
				// all white
				score += scoreTable[tuple[2] + 4];
			}
			
			// remove head point
			tuple[chess[headi][headj]]--;
			
			headi++;
			headj++;
		}
	}			

	tuple[0] = 0;
	tuple[1] = 0;
	tuple[2] = 0;
	headi = -1;
	headj = -1;
	count = 0;
	delta = 0;
	var delta2 = 0;
	delta = (j-4 < 0 ? j : 4);
	delta2 = (i+4 < 15 ? 4 : 14-i);
	delta = (delta < delta2 ? delta : delta2);
	
	// top right to left bottom i-- j++
	for(ti = i+delta, tj = j-delta; ti >= i - 4 && ti >= 0 && tj <= j + 4 && tj < N ; ti--, tj++) {
		if(headj == -1) {
			headi = ti;
			headj = tj;
		}
		tuple[chess[ti][tj]]++;
		count++;
		
		if(count >= 5) {
			if(tuple[0] == 5) {
				score += scoreTable[0];
			} else if(tuple[2] == 0) {
				// all black
				score += scoreTable[tuple[1]];
			} else if(tuple[1] == 0) {
				// all white
				score += scoreTable[tuple[2] + 4];
			}
			
			// remove head point
			tuple[chess[headi][headj]]--;
			
			headi--;
			headj++;
		}
	}
//console.log(i + " " + j + " " + score)	
//drawChess(i, j, 15, 20, type);
	return score;
}


function initChess() {
	for(var i = 0; i < N; i++) {
		chess[i] = new Array();
		for(var j = 0; j < N; j++) {
			chess[i][j] = 0;
		}
	}
}

function isWin(i, j , type) {
	var count = 0;
	// horizontal
	for(var k = i; k >= 0; k--) {
		if(chess[k][j] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}
	}
	for(var k = i+1; k < N; k++) {
		if(k >= N) {
			continue;
		}		
		if(chess[k][j] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}
	}	
	
	count = 0;
	// verticle
	for(var k = j; k >= 0; k--) {
		if(chess[i][k] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}
	}
	for(var k = j+1; k < N; k++) {
		if(k >= N) {
			continue;
		}		
		if(chess[i][k] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}
	}	
	
	count = 0;
	// top left  -- right bottom
	// to top left i--, j--
	for(var ki = i, kj = j; ki >=0 && kj >=0; ki--, kj--) {
		if(chess[ki][kj] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}		
	}
	// to right bottom i++, j++
	for(var ki = i+1, kj = j+1; ki < N && kj < N; ki++, kj++) {
		if(ki >=N || kj >= N) {
			continue;
		}		
		if(chess[ki][kj] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}		
	}	
	
	count = 0;
	// to right top i++, j--
	for(var ki = i, kj = j; ki < N && kj >=0; ki++, kj--) {
		if(chess[ki][kj] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}		
	}	
	
	// to left botton i--, j++
	for(var ki = i-1, kj = j+1; ki >= 0 && kj < N; ki--, kj++) {
		if(ki < 0 || kj >= N) {
			continue;
		}
		if(chess[ki][kj] == type) {
			count++;
			if(count >= 5) {
				return true;
			}
		} else {
			break;
		}		
	}	
	
	return false;
}

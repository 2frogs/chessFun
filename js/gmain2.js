	
var N = 15;
	
//var chess = new Array();
//initChess();
  
// Blank, B, BB, BBB, BBBB,  W, WW, WWW, WWWW, Others
var BScoreTable = new Array(7, 35, 800, 15000, 800000, 15, 400, 1800, 100000, 0, 0);
var WScoreTable = new Array(7, 15, 400, 1800,  100000, 35, 800, 15000, 800000,  0, 0);

var BLANK = 0;
var BLACK = 1;
var WHITE = 2;


function getBestPoint(i, j , type) {
	var bp = new Array(0, 0, 0); //i, j, score
	// eight directions
	for(var k = 1; k <= 5; k++) {
		// left 
		if(i-k >= 0 && chess[i-k][j] == BLANK) {
			var score = calScore(i-k, j, type);
			if(bp[2] < score) {
				bp[0] = i-k;
				bp[1] = j;
				bp[2] = score;
			}
		}
		// right 
		if(i+k < N && chess[i+k][j] == BLANK) {
			var score = calScore(i+k, j, type);
			if(bp[2] < score) {
				bp[0] = i+k;
				bp[1] = j;
				bp[2] = score;
			}
		}
		// up 
		if(j-k >= 0 && chess[i][j-k] == BLANK) {
			var score = calScore(i, j-k, type);
			if(bp[2] < score) {
				bp[0] = i;
				bp[1] = j-k;
				bp[2] = score;
			}
		}	
		// down 
		if(j+k < N && chess[i][j+k] == BLANK) {
			var score = calScore(i, j+k, type);
			if(bp[2] < score) {
				bp[0] = i;
				bp[1] = j+k;
				bp[2] = score;
			}
		}
		// left up  i- j-
		if(i-k >= 0 && j-k >= 0 && chess[i-k][j-k] == BLANK) {
			var score = calScore(i-k, j-k, type);
			if(bp[2] < score) {
				bp[0] = i-k;
				bp[1] = j-k;
				bp[2] = score;
			}
		}		
		// right up i+ j-
		if(i+k < N && j-k >= 0 && chess[i+k][j-k] == BLANK) {
			var score = calScore(i+k, j-k, type);
			if(bp[2] < score) {
				bp[0] = i+k;
				bp[1] = j-k;
				bp[2] = score;
			}
		}
		// left bottom i- j+
		if(i-k >= 0 && j+k < N && chess[i-k][j+k] == BLANK) {
			var score = calScore(i-k, j+k, type);
			if(bp[2] < score) {
				bp[0] = i-k;
				bp[1] = j+k;
				bp[2] = score;
			}
		}	
		// right bottom i+ j+
		if(i+k < N && j+k < N && chess[i+k][j+k] == BLANK) {
			var score = calScore(i+k, j+k, type);
			if(bp[2] < score) {
				bp[0] = i+k;
				bp[1] = j+k;
				bp[2] = score;
			}
		}			
	}
	return bp;
}




// ����ĳ���հ׵��Score, ��Ԫ�����
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
	// top left
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
	
	// top left
	for(ti = i+delta, tj = j-delta; ti <= i - 4 && ti >= 0 && tj <= j+4 && tj < N ; ti--, tj++) {
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
	for(var ki = i, kj = j; ki >=0, kj >=0; ki--, kj--) {
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
	for(var ki = i+1, kj = j+1; ki < N, kj < N; ki++, kj++) {
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
	for(var ki = i, kj = j; ki < N, kj >=0; ki++, kj--) {
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
	for(var ki = i+1, kj = j+1; ki >= 0, kj < N; ki--, kj++) {
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

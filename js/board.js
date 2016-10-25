var firstType = 1;       // 1--black  2-white
var rowNum = 14;
var chess = new Array();

var $$ = function(id) {
	return document.getElementById(id);
}

initChess();

function initChess() {
	for(var i = 0; i <= rowNum; i++) {
		chess[i] = new Array();
		for(var j = 0; j <= rowNum; j++) {	
			chess[i][j] = 0;
		}
	}
}

/* chess board */
function drawBoard(rowLen, rowNum) {
	var len = rowLen * rowNum;
	var arr = new Array();
	arr.push("<div style='margin-left:" + rowLen + "px; margin-top:" + rowLen + "px;'>");
	arr.push("<table border=1 cellspacing=0 width='" + len + "' height='" + len + "' >");
	
	for(var i = 0; i < rowNum; i++) {
		arr.push("<tr>"); 
		for(var j = 0; j < rowNum; j++) {
			var id = "td_" + i + "_" + j; 
			arr.push("<td align='center' id = '" + id + "'></td>");
		}
		arr.push("</tr>"); 
	}

	document.write(arr.join("")+"</table></div>");
	
	
	
	// set cross
	var crossLen = Math.floor(rowLen*0.9);
	for(var i = 0; i <= rowNum; i++) {
		for(var j = 0; j <= rowNum; j++) {
			var tdId = "td_" + i + "_" + j; 
			var divId = "div_" + i + "_" + j; 
			var top = rowLen * (i + 1) - crossLen/2;
			var left = rowLen * (j + 1) - crossLen/2;
			
			var clickEvent = "onclick = 'doClick(" + i + "," + j + "," + crossLen + "," + rowLen + ")'";
			
			var crossDiv = "<div id= '" + divId +"' style='position:absolute;border:0px solid #000;" + 
			"width:" + crossLen + "px; height:" + crossLen + "px; top:" + top + "px; left:" + left + "px;' " + clickEvent + "></div>"
			
			if(j == rowNum && i != rowNum) {
				tdId = "td_" + i + "_" + (j-1); 	
			}
			if(i == rowNum && j != rowNum) {
				tdId = "td_" + (i-1) + "_" + j; 	
			}			
			
			if(i == rowNum && j == rowNum) {
				tdId = "td_" + (i-1) + "_" + (j-1); 			
			}

			document.getElementById(tdId).innerHTML = document.getElementById(tdId).innerHTML + crossDiv;
			
		}
	}
	
}

function drawChess(i, j, radis, len, type) {
	var gradient = "from(#FFF),to(#AAA)";
	var color = "FFF";
	if(type == 1) {
		//black
		color = "000";
		gradient = "from(#DDD),to(#FFF)";		
	}
	var chessDiv = "";
	var width = radis*2;
	var height = radis * 2;
	var id = "chess_" + i + "_" + j;
	var divId = "div_" + i + "_" + j;
	var shadow = "-" + radis + "px " + len + "px #" + color + ";";
	var r="border-radius:" + radis + "px;";   
	
	
  chessDiv="<div id='" + id + "' style='display:block;-webkit-" + r + "-moz-" + r + " " + r
  + "-moz-box-shadow:inset 0 " + shadow + " box-shadow:inset 0 " + shadow
  + "background:-webkit-gradient(radial, center center, " + len + ", left top, " + len + ", from(#"+color+"), to(#AAA));" 
  + "width:" + width + "px; height:" + height + "px'  ></div>"

	document.getElementById(divId).innerHTML = chessDiv;
}

function doClick(i, j, crossLen, rowLen) {

	if(chess[i][j] == 0) {
		
	    drawChess(i,j,crossLen/2, rowLen, firstType);
	    chess[i][j] = firstType;
	    
	    if(isWin(i, j, firstType)) {
	    	alert("you win!");
	    	return;
	    }
var start = new Date().getTime();	    
	    firstType = (firstType == 1 ? 2 : 1);  
	    CUR_TYPE = firstType;
	    var bp = search(i, j, firstType, MAX_DEPTH, -1);   // computer
var finish = new Date().getTime();
//alert(finish - start + " " + TMP_COUNT);
console.log(finish - start + " " + TMP_COUNT);
TMP_COUNT = 0;
//alert(bp[0] + " " + bp[1] + " " + bp[2]);	    
	    drawChess(bp[0], bp[1], crossLen/2, rowLen, firstType);
	    chess[bp[0]][bp[1]] = firstType;
	    
	    if(isWin(bp[0], bp[1], firstType)) {
	    	alert("computer win!");
	    }
	    
		firstType = (firstType == 1 ? 2 : 1);
	}
}

function doClick2(i, j, crossLen, rowLen) {

	if(chess[i][j] == 0) {
		
	    drawChess(i,j,crossLen/2, rowLen, firstType);
	    chess[i][j] = firstType;
	    board[i][j] = firstType;
	    t_board[i][j] = firstType
	    
	    if(isWin(i, j, t_board, firstType)) {
	    	alert("you win!");
	    	return;
	    }
var start = new Date().getTime();	    
	    firstType = (firstType == 1 ? 2 : 1);    

	    var bp = getBestPoint(i, j, firstType);   // computer
var finish = new Date().getTime();
//console.log(finish - start + " " + bp[2]);
//alert(bp[0] + " " + bp[1] + " " + bp[2]);	    
	    drawChess(bp[0], bp[1], crossLen/2, rowLen, firstType);
	    chess[bp[0]][bp[1]] = firstType;
	    board[bp[0]][bp[1]] = firstType;
	    t_board[bp[0]][bp[1]] = firstType;
	    
	    if(isWin(bp[0], bp[1], t_board, firstType)) {
	    	alert("computer win!");
	    }
	    
		firstType = (firstType == 1 ? 2 : 1);
	}
}



function raisin(i, j, firstType) {
	
	
	
}




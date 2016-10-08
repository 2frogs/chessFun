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
			
			var crossDiv = "<div id= '" + divId +"' style='position:absolute;border:0px solid #000;" + 
			"width:" + crossLen + "px; height:" + crossLen + "px; top:" + top + "px; left:" + left + "px;' ></div>"
			
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



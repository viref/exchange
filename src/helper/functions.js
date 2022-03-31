export default {
	formatMoney(number, decPlaces, decSep, thouSep) {
	    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
	    decSep = typeof decSep === "undefined" ? "." : decSep;
	    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
	    var sign = number < 0 ? "-" : "";
	    let parts = number.toString().split(".");
	    let decimals = parts[1] ? parts[1].slice(0, decPlaces) : "";
	    let str = "";
	    let count = 0;
	    for ( let i=parts[0].length-1; i>=0; i-- ) {
	    	str = parts[0][i]+str
	    	if ( count==2 && i!=0 ) {
	    		str = thouSep+str;
	    		count = 0;
	    	} else count++;
	    }

	    return sign + str + (decimals.length ? (decSep + decimals):"");
	}
}
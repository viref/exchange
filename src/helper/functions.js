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
	},
	copyToClipboard(text) {
	    if (window.clipboardData && window.clipboardData.setData) {
	        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
	        return window.clipboardData.setData("Text", text);
	    }
	    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
	        var textarea = document.createElement("textarea");
	        textarea.textContent = text;
	        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
	        document.body.appendChild(textarea);
	        textarea.select();
	        try {
	            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
	        }
	        catch (ex) {
	            console.warn("Copy to clipboard failed.", ex);
	            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
	        }
	        finally {
	            document.body.removeChild(textarea);
	        }
	    }
	}
}
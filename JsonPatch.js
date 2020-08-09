let arr = [];

$(document).ready(function() {
	
    prepareOperationTable();
    
    var parseJson = JSON.parse(jsonString);

    document.getElementById("mainJSON").textContent = JSON.stringify(parseJson, undefined, 4);
    
    convertJSONIntoArr(parseJson);
    
    replaceAndAddUsingJsonPatch(parseJson);
    
    document.getElementById("jsonShow").textContent = JSON.stringify(parseJson, undefined, 4);
});


function prepareOperationTable() {
	//Iterating Json patch for adding the value in table row
    $.each(jsonPatch, function(index, item) {
    	var eachrow ;
    	if(item.value.label == undefined && item.value.uri == undefined){
    		  eachrow = "<tr>" +
              "<td>" + item.op + "</td>" +
              "<td>" + item.path + "</td>" +
              "<td>" + item.value + "</td>" +
              "</tr>";
        }
    	else{
    		
    		  eachrow = "<tr>" +
              "<td>" + item.op + "</td>" +
              "<td>" + item.path + "</td>" +
              "<td>" + item.value.label + " " + item.value.uri + "  </td>" +
              "</tr>";
    		}
    	
    	 $('#tBody').append(eachrow);
        
    });
}


function convertJSONIntoArr(parseJson) {
    // Adding Json Object into Array as key value pair
    for (var key in parseJson) {

        if (parseJson.hasOwnProperty(key)) {
            var val = parseJson[key];

            arr[key] = val;
        }
    }
    return arr;
}


function replaceAndAddUsingJsonPatch(parseJson) {

    for (var i = 0; i < jsonPatch.length; i++) {

        var splitJsonPatch = jsonPatch[i].path.split("/");
        var tagsVal = splitJsonPatch[1];
        var numVal = splitJsonPatch[2];
        var uriVal = splitJsonPatch[3];

        if (jsonPatch[i].op == "replace") {

            for (let k in arr) {
                var newVal = "";
                if (k == tagsVal) {
                    if (uriVal == null || uriVal == "" || uriVal == undefined) {
                        arr[k]["" + numVal + ""] = jsonPatch[i].value;
                        newVal = arr[k]["" + numVal + ""];
                        parseJson["" + tagsVal + ""]["" + numVal + ""] = newVal;
                        break;
                    } else {
                        arr[k]["" + numVal + ""]["" + uriVal + ""] = jsonPatch[i].value;
                        newVal = arr[k]["" + numVal + ""]["" + uriVal + ""];
                        parseJson["" + tagsVal + ""]["" + numVal + ""]["" + uriVal + ""] = newVal;
                        break;
                    }
                }
            }

        }

        if (jsonPatch[i].op == "add") {

            if (numVal != null && numVal != "") {
                parseJson["" + tagsVal + ""]["" + numVal + ""] = jsonPatch[i].value;
            } else {
                parseJson["" + tagsVal + ""] = jsonPatch[i].value;
            }

        }
    }

    return parseJson;
}
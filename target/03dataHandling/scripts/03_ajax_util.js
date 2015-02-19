//****************HTML functions************************************************************************************************************
// Insert the html data into the element 
// that has the specified id.
function htmlInsert(id, htmlData) 
{
  document.getElementById(id).innerHTML = htmlData;
}
// Return escaped value of textfield that has given id.
// The builtin "escape" function url-encodes characters.
function getValue(id) 
{
  return(escape(document.getElementById(id).value));
}
// Read form parameters and prepare for submit to server
function parseInput(form)
{
   var parameters = "";
   for(var i=0; i<form.elements.length; i++){
	   if(form.elements[i].type == "button")
	       continue;
	   if(i > 0)
	      parameters += "&";
	   parameters += form.elements[i].name + "=";
	   switch (form.elements[i].type){
	      case "text":
	          parameters += encodeURIComponent(form.elements[i].value);
	          break;
	      case "select-one":
	    	  parameters += form.elements[i].options[form.elements[i].selectedIndex].value;
	    	  break;
	      case "radio":
		//radio buttons are grouped with 1 name where the user should select one value only
	          var radioel = form.elements[form.elements[i].name];	 
	          for(var j=0; j<radioel.length; j++){
	              i+=j;
	              if(radioel[j].checked)
	                  parameters += radioel[j].value;
	          }
	          break;
	      case "checkbox":
	          parameters += encodeURIComponent(form.elements[i].checked);
	          break;
	   }
   }
   return parameters;
}

//****************AJAX functions*************************************************************************************************************
// Generalized version of ajaxResultPost. In this
// version, you pass in a response handler function
// instead of just a result region.
function ajaxPost(address, data, responseHandler) 
{
  var request = getRequestObject();
  request.onreadystatechange = function() { responseHandler(request); };
  request.open("POST", address, true);
  request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  request.send(data);
}
//Get the browser-specific request object, either for
//Firefox, Safari, Opera, Mozilla, Netscape, IE 8, or IE 7 (top entry);
//or for Internet Explorer 5 and 6 (bottom entry). 
function getRequestObject() 
{
	if (window.XMLHttpRequest) {
		return(new XMLHttpRequest());
	} else if (window.ActiveXObject) { 
		return(new ActiveXObject("Microsoft.XMLHTTP"));
	} else {
		 // Don't throw Error: this part is for very old browsers,
		 // and Error was implemented starting in JavaScript 1.5.
		 return(null); 
	}
}

//****************REQUEST functions************************************************************************************************************
function xmlRequest(address,form, resultRegion, content)
{
	var data = parseInput(form);
	data += "&format=xml";
  	ajaxPost(address, data, function(request) { 
             showXmlTable(request, resultRegion, content); 
           });
}
function jsonRequest(address,form, resultRegion, content) 
{
  	var data = parseInput(form);
	data += "&format=json";
	ajaxPost(address, data, function(request) { 
		showJsonTable(request, resultRegion, content); 
      });
}
function stringRequest(address,form, resultRegion) 
{
  	var data = parseInput(form);
	data += "&format=string";
  	ajaxPost(address, data, 
           function(request) { 
             showStringTable(request, resultRegion); 
           });
}
//****************HANDLER functions************************************************************************************************************
//XML should always provide heading values and content
function showXmlTable(request, resultRegion, content) 
{
  if ((request.readyState == 4) &&
      (request.status == 200)) {
	var xmlDocument = request.responseXML;
	var headings = getXmlValues(xmlDocument, "heading");
	var rows = getXmlValues2(xmlDocument, content);
	createTable(headings, rows, resultRegion);
  }
}
function showJsonTable(request, resultRegion, content) 
{
  if ((request.readyState == 4) &&
      (request.status == 200)) {
    var rawData = request.responseText;
    var data = eval("(" + rawData + ")");
    //use [ ] in order to be able to provide a dynamic key value
    createTable(data.headings, data[content], resultRegion);
  }
}
function showStringTable(request, resultRegion) 
{
  if ((request.readyState == 4) &&
      (request.status == 200)) {
    var rawData = request.responseText;
    var rowStrings1 = rawData.split(/[\n\r]+/);
    //make sure to skip the empty strings in front and at back of the split result
    var rowStrings = [];
    for(var i=0; i<rowStrings1.length; i++){
    	if(rowStrings1[i] != "")
    	rowStrings.push(rowStrings1[i]);
    }
    var headings = rowStrings[0].split("#");
    var rows = new Array(rowStrings.length-1);
    for(var i=1; i<rowStrings.length; i++) {
      rows[i-1] = rowStrings[i].split("#");
    }
    var table = getTable(headings, rows);
    htmlInsert(resultRegion, table);
  }
}

//****************XML functions****************************************************************************************************************
// Given an element, returns the body content.
function getBodyContent(element) 
{
  element.normalize();
  return(element.firstChild.nodeValue);
}
//Returns a list values found with the provided elementNames
//E.g., for <foo><a>one</a><c>two</c><b>three</b><d>four</d></foo>,
//if the element points at foo,
//getElementValues(element, ["a", "b", "c"]) would return ["one", "three", "two"]
function getElementValues(element, subElementNames) 
{
	var values = new Array(subElementNames.length);
	for(var i=0; i<subElementNames.length; i++) {
	 var name = subElementNames[i];
	 var subElement = element.getElementsByTagName(name)[0];
	 values[i] = getBodyContent(subElement);
	}
	return(values);
}
//returns all values of the xmlElementName found in the provided document
//E.g., for <foo><a>one</a><c>two</c><b>three</b><d>four</d><a>five</a></foo>,
//if the element points at foo,
//getElementValues(element, "a") would return ["one", "five"]
function getXmlValues(xmlDocument, xmlElementName) 
{
	  var elementArray = 
	     xmlDocument.getElementsByTagName(xmlElementName);
	  var valueArray = new Array();
	  for(var i=0; i<elementArray.length; i++) {
	     valueArray[i] = getBodyContent(elementArray[i]);
	  }
	  return(valueArray);
}
//returns the values of the childNodes of the xmlElementName
//E.g., for <foo><a>one</a><b>two</b></foo><foo><a>three</a><c>four</c></foo>,
//if the element points at foo,
//getElementValues(element, "foo") would return [["one","two"], ["three", "four"]]
function getXmlValues2(xmlDocument, xmlElementName) 
{
	//get all the data nodes
	 var datalist = xmlDocument.getElementsByTagName(xmlElementName);
	 //loop through all the data nodes
	 var rows = new Array(datalist.length);
	 for(datanode = 0; datanode < datalist.length; datanode++)
	 {
		var row = [];
		for(subnode = 0; subnode < datalist[datanode].childNodes.length ; subnode++){
			//only read element nodes - skip others like empty text nodes
			if(datalist[datanode].childNodes[subnode].nodeType == 1){
				//text of element from text node - first child
				//use push to avoid empty elements in array
				row.push( datalist[datanode].childNodes[subnode].childNodes[0].nodeValue);
			}			
		}
		rows[datanode]=row;		
	 }
	 return rows;
}
//****************Table functions**************************************************************************************************************
function getTable(headings, rows) 
{
  var table = "<table border='1' class='ajaxTable'>\n" +
              getTableHeadings(headings) +
              getTableBody(rows) +
              "</table>";
  return(table);
}
function getTableHeadings(headings) 
{
  var firstRow = "  <tr>";
  for(var i=0; i<headings.length; i++) {
    firstRow += "<th>" + headings[i] + "</th>";
  }
  firstRow += "</tr>\n";
  return(firstRow);
}
function getTableBody(rows) 
{
  var body = "";
  for(var i=0; i<rows.length; i++) {
    body += "  <tr>";
    var row = rows[i];
    for(var j=0; j<row.length; j++) {
      body += "<td>" + row[j] + "</td>";
    }
    body += "</tr>\n";
  }
  return(body);
}
function createTable(headings, rows, displayRegion) 
{
   var table = getTable(headings, rows);
  htmlInsert(displayRegion, table);
}


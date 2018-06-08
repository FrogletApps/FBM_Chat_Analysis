//Created by James Pearson 26/05/18, last updated 26/05/18

//This file reads the json data and processes it

//Change this variable to use a different file
var filename = "mini.json";

//load the json data
$.getJSON(filename, function (data) {
    //output the json data into the console
    //$.each(data, function (index, value) {
    //   console.log(value);
    //});

    var title = "<h2>" + data.title + "</h2>";
    var output = "";
    var count = 0;
    //Get names
    //output += "<th onclick='sortTable(0);'>Name</th>";
    //output += "<th onclick='sortTable(1);'>Number of Messages</th>";
    for (person in data.participants){
        output += "<tr>";
        name = data.participants[person];
        output += "<td class='name'>" + name + "</td>";
        output += "<td>" + count + "</td>";
        output += "</tr>";
        count++;
    }
    output += "</table>";
    $('#name').append(title);
    $('#outputTable').append(output);
});

function getCount(data, name) {
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].name == name) {
            count++;
        }
    }
    return count;
}

//Modified version of:
//https://www.w3schools.com/howto/howto_js_sort_table.asp
function sortTable(n){
    
    //Setup variables
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0, isNum;
    table = document.getElementById("outputTable");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    
    //Make a loop that will continue until no switching has been done:
    while(switching){
        //Start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("tr");
        
        //Loop through all table rows (except the first, which contains table headers):
        for(i = 1; i < (rows.length - 1); i++){
            //Start by saying there should be no switching:
            shouldSwitch = false;
            //Get the two elements you want to compare, one from current row and one from the next:
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            //Check if the cell contains a date or not
            if($(x).hasClass("name")){
                console.log("true");
                isName = true;
            }
            else{
                console.log("false");
                isName = false;
            }

            //Check if the two rows should switch place, based on the direction, asc or desc:
            //Also check if the row is numbers or not and sort accordingly
            if(dir == "asc" && !isName){
                if(parseInt(x.innerHTML, 10) > parseInt(y.innerHTML, 10)){
                    //If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    //console.log("Case 1");
                    break;
                }
            }
            else if(dir == "desc" && !isName){
                if(parseInt(x.innerHTML, 10) < parseInt(y.innerHTML, 10)){
                    shouldSwitch = true;
                    //console.log("Case 2");
                    break;
                }
            }
            else if(dir == "asc" && isName){
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    //console.log(x.getAttribute("month") + " " + y.getAttribute("month"));
                    //console.log("Case 3");
                    break;
                }
            }
            else if(dir == "desc" && isName){
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    //console.log(x.getAttribute("month") + " " + y.getAttribute("month"));
                    //console.log("Case 4");
                    break;
                }
            }
            //console.log(dir + " " + isNum);
        }

        if(shouldSwitch){
            //If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        }else{
            //If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
            if(switchcount == 0 && dir == "asc"){
                dir = "desc";
                switching = true;
            }
        }
    }
}
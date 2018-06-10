//Created by James Pearson 26/05/18, last updated 08/06/18

//This file reads json data from Facebook Messenger

//Change this variable to use a different file
var filename = "json/testdata.json";
load(filename);

function load(filename){
    //load the json data
    $.getJSON(filename, function(data){
        //output the json data into the console
        //$.each(data, function (index, value) {
        //   console.log(value);
        //});

        var output = "";
        var count = 0;
        var members = getMembers(data.messages, data.participants);

        output += "<tr><th onclick='sortTable(0);'>Name</th>";
        output += "<th onclick='sortTable(1);'>Number of Messages</th></tr>";
        for(person in members){
            output += "<tr>";
            name = members[person];
            //Flag Facebook User as different to everyone else
            if(name == "Facebook User"){
                output += "<td id='FBU' class='name'>" + name + "</td>";
                output += "<td id='FBU'>" + getCount(data.messages, name) + "</td>";
            }
            else{
                output += "<td class='name'>" + name + "</td>";
                output += "<td>" + getCount(data.messages, name) + "</td>";
            }
            output += "</tr>";
            count++;
        }

        //Add the title of the chat
        $('#name').append(getTitle(data.title, members));

        //Check to see if there actually is anything to output
        if(count != 0){
            //If there are messages then add them
            $('#outputTable').append(output);
        }
        else{
            //count == 0 so no messages
            $('#instructions').empty();
            $('#error').append("<p>No messages found :c</p>");
        }

    //If reading the JSON fails then this code runs
    }).fail(function(d) {
        $('#instructions').empty();
        $('#error').append("<p>Couldn't find the file :c</p>");
    });
}

//This code counts the messages for a specific user
//NOTE: This gets VERY slow if you enable the console.logs
function getCount(messages, name){
    var messageCount = 0;
    //console.log(messageCount);
    for(var i = 0; i < messages.length; i++){
        //console.log("Trying to count");
        if(messages[i].sender_name == name){
            messageCount++;
            //console.log("I'm counting!");
        }
    }
    return messageCount;
}

//This code finds the members in the chat and participants list (participants list alone may not have everyone)
function getMembers(messages, participants){
    var members = [];
    var name = "";
    for(var i = 0; i < messages.length; i++){
        name = messages[i].sender_name;
        if(!members.includes(name)){
            members.push(name);
        }
    }
    for(person in participants){
        if(!members.includes(participants[person])){
            members.push(participants[person]);
        }
    }
    if(members.includes("Facebook User")){
        $('#error').append('<p>Note: "Facebook User" may include several people\'s data</p>');
    }
    return members;
}

function getTitle(title, members){
    var newTitle = "";
    if(members.length > 2){
        newTitle = "Group Chat: " + title;
    }
    else if(members.length == 2){
        newTitle = members[0] + " & " + members[1];
    }
    else if(members.length == 1){
        newTitle = members[0] + "on their own...";
    }
    else{
        newTitle =  "???";
    }
    return "<h2>" + newTitle + "</h2>";
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
                //console.log("true");
                isName = true;
            }
            else{
                //console.log("false");
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
                    break;
                }
            }
            else if(dir == "desc" && isName){
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if(shouldSwitch){
            //If a switch has been marked, make the switch and mark that a switch has been done:
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        }
        else{
            //If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
            if(switchcount == 0 && dir == "asc"){
                dir = "desc";
                switching = true;
            }
        }
    }
}
//Created by James Pearson 26/05/18, last updated 10/06/18

//This file reads json data from Facebook Messenger

//This part gets a JSON file from the file picker thingy
//Based on code from:
//http://blog.teamtreehouse.com/reading-files-using-the-html5-filereader-api
window.onload = function(){
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e){
        var file = fileInput.files[0];
        var textType = ".json";

        if(file.type.match(textType)){
            var reader = new FileReader();
            reader.onload = function(e){
                parse(reader.result);
            }
            reader.readAsText(file);	
        }
        else{
            alert("File not supported!");
        }
    });
}

//Parse the data
function parse(jsonString){
    $('#name').empty();
    var parsedData = JSON.parse(jsonString);
    if(parsedData.hasOwnProperty('messages')){
        //Add the title of the chat
        var members = getMembers(parsedData.messages, parsedData.participants);
        $('#name').append(getTitle(parsedData.title, members));
        run(parsedData);
    }
    else{
        alert("This doesn't appear to be a Facebook Messenger JSON file");
    }
}

//Put the functions you want to run with parsed JSON data here
function run(parsedData){
    count(parsedData);
    date(parsedData);
}

//Count the number of messages
function count(parsedData){
    $('#outputTable').empty();
    $('#error').empty();
    $('#instructions').empty();

    var output = "";
    var count = 0;
    var members = getMembers(parsedData.messages, parsedData.participants);

    var instructions = "<br>";
    instructions += "<p>Click a table header to sort the table in ascending order by that category</p>";
    instructions += "<p>Tap again to sort by descending order</p>";

    output += "<tr><th onclick='sortTable(0);'>Name</th>";
    output += "<th onclick='sortTable(1);'>Number of Messages</th></tr>";

    for(person in members){
        output += "<tr>";
        name = members[person];
        //Flag Facebook User as different to everyone else
        if(name == "Facebook User"){
            output += "<td id='FBU' class='name'>" + name + "</td>";
            output += "<td id='FBU'>" + getCount(parsedData.messages, name) + "</td>";
        }
        else{
            output += "<td class='name'>" + name + "</td>";
            output += "<td>" + getCount(parsedData.messages, name) + "</td>";
        }
        output += "</tr>";
        count++;
    }
    //Check to see if there actually is anything to output
    if(count != 0){
        $('#instructions').append(instructions);
        //If there are messages then add them
        $('#outputTable').append(output);
    }
    else{
        //count == 0 so no messages
        $('#instructions').empty();
        $('#error').append("<p>No messages found :c</p>");
    }
}

function date(parsedData){
    //Empty all fields
    $('#firstMessageDate').empty();

    var messages = parsedData.messages;
    var timestampArray = [];
    for(i=0; i<messages.length; i++){
        var timestamp = messages[i].timestamp;
        //console.log(timestamp);
        //Multiplied by 1000 so that the argument is in milliseconds, not seconds.
        timestampArray.push(timestamp*1000);
    }
    //console.log(timestampArray);
    var length = timestampArray.length;
    var first = timestampArray[length-1];

    //Put data into fields
    $('#firstMessageDate').append("<p>The first message was sent on " + prettyDate(first) + "</p>");
}

//Generate a human readable date from a timestamp
function prettyDate(timestamp){
    var date = new Date(timestamp);
    var day = date.getDay();
    var d = startZero(date.getDate());
    var m = startZero(date.getMonth()+1); 	//January was 0 but is now 1
    var yyyy = date.getFullYear();
    var h = startZero(date.getHours());
    var min = startZero(date.getMinutes());
    var s = startZero(date.getSeconds());

    //puts days of the week into an array so you print name not number
    var dayName = [];
    dayName[0]=  "Sunday";
    dayName[1] = "Monday";
    dayName[2] = "Tuesday";
    dayName[3] = "Wednesday";
    dayName[4] = "Thursday";
    dayName[5] = "Friday";
    dayName[6] = "Saturday";

    var prettyDate = d+"/"+m+"/"+yyyy+" ("+dayName[day]+") at "+h+":"+min+":"+s+" (UTC)";
    return prettyDate;
}

//Add zeros onto the start of a number if it's less than 10
function startZero(number){
    var paddedNumber = "";
    if (number < 10){
        paddedNumber = "0" + number;
    }
    else{
        paddedNumber = number
    }
    return paddedNumber;
}

//This code counts the messages for a specific user
function getCount(messages, name){
    var messageCount = 0;
    for(var i = 0; i < messages.length; i++){
        if(messages[i].sender_name == name){
            messageCount++;
        }
    }
    return messageCount;
}

//This code finds the members in the chat and participants list
//(participants list alone may not have everyone)
function getMembers(messages, participants){
    var members = [];
    var name = "";
    //Check through all the messages to find people in the group
    for(var i = 0; i < messages.length; i++){
        name = messages[i].sender_name;
        if(!members.includes(name)){
            members.push(name);
        }
    }
    //Looks at the participants list for people who might not have sent any messages
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

//Find a title for the data
//Eg if only 2 people then x&y or if more then it's a group chat
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
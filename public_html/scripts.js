/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var HOST = "cse264.info:3000";
var SERVER = "http://"+HOST+"/";

//Getting back a javascript object alreayd converted from json
function doAjaxCall(method,cmd,params,fcn){
    $.ajax(
         SERVER + cmd,
        {
            type:method,
            processData: true,
            data: params,
            dataType: "json",
            success: function(results){
                fcn(results);
            },
            error: function (jqXHR, textStatus, errorThrown) {
//                alert("Error: " + jqXHR.responseText);
//                alert("Error: " + textStatus);
//                alert("Error: " + errorThrown);
            }
    
    });
}
    
    //Global id variable
    var myid = 0;
    
    
    function loadLeaderBoard(players){
        console.log("in leaderboard");
        var usergrid = "";
        for(var i = 0; i < players.length; ++i){
            var player = players[i];
            //table hard coded with some id
            //insert rows into the tbody element of that table
            var row = "<tr style='background-color:"+(player.winner ? "gold" : "white")+"'>"+
                "<td>"+ player.name+"</td>" +
                "<td id='score"+myid+"'>"+player.score+"</td> </tr>"; // label score so can update later
            usergrid += row;
            if(player.winner === true){
                alert("GAME OVER "+player.name+" has won!!");
            }
        }
        $("#leaderboard tbody").html(usergrid);
//        
    }
    
    
    //register/login
//   $("#registerButton").on('click',login());
    function login(){
        console.log("in login)");
        var userName = $("#registerInput").val();
        $("#registerInput").val("");
        console.log(userName);
        doAjaxCall("GET", "wordsearch/login", {username: userName},
        function(result){
            if(result.success){
                 myid = result.id;
                 getPuzzle(result.id);
                 //loadName();
             }
             else{
                 alert("Unsuccessful login");
             }
        });
    }
    
    
    var loadPuzzleFlag=  false;
    function getPuzzle(id){
        console.log("in load Puzzle");
        doAjaxCall("GET","wordsearch/puzzle",{id: id}, 
        function(results){
            console.log(results.grid);
             $("#grid").empty();
             $("#title").text(results.theme); //C
             console.log(results.theme);
             var letterIndex= 0;
             for(var i = 0; i < results.nrows; i++){
                 var newRow = $("<tr></tr>");
                 for(var j = 0; j < results.ncols; j++){
                     var newCell = $("<td class='basic_color'></td>");
                     $(newCell).html(results.grid.charAt(letterIndex++)); //[letterIndex++]);
                     $(newRow).append(newCell);
                 }
                 $("#grid").append(newRow);
             }
             $("#grid tbody").css('height','400px');
             loadPuzzleFlag=true;
             attachEventHandlers();
        });
    }
    
//    $("#submitWord").click(submitWord);
    function submitWord(){
        var letters = [];
        //add letters that have been colored
        var lettersClicked=$.merge($(".clicked_color"), $("correct_color clicked_color"));
        //lettersClicked.push($("correct_color clicked_color"));
        console.log(lettersClicked.length);
        for(i = 0; i < lettersClicked.length; i++){
             var rowIndex =lettersClicked.eq(i).parent('tr').index();
            letters[i] = {r:parseInt(rowIndex,10),  c: parseInt(lettersClicked[i].cellIndex,10)};
            console.log({r:lettersClicked.eq(i).parent('tr').index(), c: lettersClicked[i].cellIndex});
        }
        console.log(JSON.stringify(letters));
            //UNCOMMENT WHEN HAVE THE SERVER
          
        doAjaxCall("GET", "wordsearch/submit",{id:myid, letters:letters},function(success){
//        var success= true;
console.log("success is:"+JSON.stringify(success));
       // var success1 = JSON.stringify(success);
        if(success === true){ //if true
                //var currentScore = $("#score"+myid+"").val();
                //$("#score"+myid+"").val(currentScore+lettersClicked.length);
            //update players score
             for(i = 0; i < lettersClicked.length; i++){
            
              //mix the colors together- a selected will halways have blue
              lettersClicked.eq(i).css('backgroundColor',"yellow");
              //lettersClicked.eq(i).css('backgroundColor',"greenyellow");
              lettersClicked.eq(i).css('border',"none");
              lettersClicked.eq(i).removeClass('clicked_color').addClass('correct_color basic_color');
             }
         }
        else{ //if it wasn't a word - deselect it
            for(i = 0; i < lettersClicked.length; i++){  
              lettersClicked.eq(i).css('border','none');
              lettersClicked.eq(i).removeClass('clicked_color').addClass('basic_color');
              console.log(lettersClicked.eq(i).attr('class'));
            }
         }
           
            
           
        });
            
  }
        
        
       function updateGrid(update){
           var words = update.words;
           console.log("in update grid");
           if(loadPuzzleFlag){
            //var word = wordSent.text;
            console.log(JSON.stringify(words));
//            for(i = 0; i < wordSent.length; i++){
            console.log(words.length);
            for(i = 0; i < words.length; i++){
                console.log(words[i].text);
                var letters = words[i].letters;
                for(j=0; j < letters.length; j++){
//                 var cell = $("table tr:eq("+letters[j].r+") td:eq("+letters[j].c+")");
                 var cell = $("#grid tr:eq("+letters[j].r+") td:eq("+letters[j].c+")");
                 console.log("cell is "+JSON.stringify(cell));
                
              //mix the colors together- a selected will halways have blue
                    cell.css('backgroundColor',"yellow");
                    //cell.toggleClass("basic_color");
                    if(cell.attr('class') === "clicked_color"){
                        cell.removeClass('clicked_color');
                        cell.addClass("correct_color clicked_color");
                    }
                    else if(cell.attr('class') === "basic_color"){
                        cell.removeClass('basic_color');
                        cell.addClass("correct_color basic_color");
                    }
//                    else if(cell.attr('class') === "correct_color clicked_color"){
//                        cell.removeClass('correct_color clicked_color');
//                        cell.addClass("correct_color basic_color");
////                        cell.removeClass('clicked_color').addClass('basic_color');
//                    }
                    
                // cell.css('backgroundColor','')
                }
            }
            //fix words 
           }
           else{
               alert("Puzzle not loaded yet");
           }
        }
            
    
    
    
    
 
function attachEventHandlers(){
     $("td").click(function(){
         console.log("in click");
         if($(this).attr('class') === "basic_color"){
             
            console.log("class is: "+$(this).attr('class'));
                $(this).css('border','solid black');
         
               
             $(this).removeClass('basic_color').addClass('clicked_color');
              console.log($(this).attr('class'));
          }
          else if($(this).attr('class') === "clicked_color"){
               $(this).css('border','none');
              $(this).removeClass('clicked_color').addClass('basic_color');
              console.log($(this).attr('class'));
          }
          else if($(this).attr('class') === "correct_color clicked_color" ){
            console.log("in event of click");
              $(this).css('border','none');
              var c = ($.Color($(this).css('color'))).toString();
              $(this).removeClass('clicked_color').addClass('basic_color');
              console.log($(this).attr('class'));
          }
         else if($(this).attr('class') === "correct_color basic_color"){
            console.log("in event of click");
             $(this).css('border','solid black');
              $(this).removeClass('basic_color').addClass('clicked_color');
              console.log($(this).attr('class'));
          }
    });
    
    
//    $("#registerButton").on('click',login());
    $("#submitWord").click(submitWord());

//    $("#submitWord").onClick(submitWord());  
    
    }
   
   
   
   $( () => { 
//    attachEventHandlers();
    login();
    //getPuzzle();
    //Create a socket and pass same host used in ajax call
    //io - variable you get back when you load the io package
    //Socket io is just a module you can load in and sue to do socket level communication
//    var socket = io.connect(HOST);
    var socket = io.connect(SERVER);
    
    //set up event handler
    socket.on("gridupdates", function(update){ //this param will be what the server passed back
        updateGrid(update);
    });
    
    socket.on("players", function(players){
        loadLeaderBoard(players);
    });


});


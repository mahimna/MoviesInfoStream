var amount = 0;
 	var total = 0;
 	var storage;
 	var stream;
 	var storagePos;

 	$(window).unload (function(){
 		localStorage.amount = amount;
 		localStorage.total = total;
 		localStorage.movies = JSON.stringify(storage);	
 	});

 	$(document).ready(function(){
 		
 		if (typeof(Storage) !== "undefined"){
 			storagePos = true;
 		} else {
 			storagePos = false;
 		}

 		if (navigator.onLine){
 			if(storagePos){
 				var load = confirm("Do you wish to open stored data?");
 				if (load){
 					loadStoredMovies();
 				}
 				else {
 					storage =  JSON.parse('{"movies":[]}');
 					localStorage.clear();
 				}
 			}
 			else {
 				storage =  JSON.parse('{"movies":[]}');
 			}
 			continuousStream();
 		}
 		else {
 			if(storagePos)
 				loadStoredMovies();
 		}
 	});

 	function loadStoredMovies(){
 		amount = parseInt(localStorage.amount);
 		total = parseInt(localStorage.total);
 		try {
 		storage = JSON.parse(localStorage.movies);
 		var movies = storage.movies;
 		}
 		catch(err){}
 		var newsfeedTable = $("#movies");
 		for (var i = 0; i<amount;i++){
 				// Get the news feed table
 							
 				// Make a new row
 				var newRow = $('<div/>').attr('id',amount).attr('class','row');
 				
 				// Make a new synopsis
 				var newSynopsis = $('<div/>').attr('id','synopsis'+amount);

 				// Get all the information needed
 				var movie = movies[i];
 				var image_url = movie["image"];
 				var dt = movie["date"];
 				var title = movie["title"];
 				var synopsis = movie["synopsis"];

 				// Add synopsis to synopsis
 				newSynopsis.append(synopsis);
 				newSynopsis.css("display","none");

 				// Add the image to the row
 				var image = $('<img/>').attr('src',image_url).attr('class','image');
 				var imageDiv = $('<div/>').attr('class','imageContainer');		
 				imageDiv.append(image);
 				newRow.append(imageDiv);

 				// Add the information to the row 
 				var informationDiv = $('<div/>').attr('class','information'); 				
 				informationDiv.append(dt+'');
 				informationDiv.append('<br/>')
 				informationDiv.append(title);
 				newRow.append(informationDiv);

 				newRow.on("click",changeSynopsisView);

 				// Add the row to the table
 				newSynopsis.prependTo(newsfeedTable);
 				newsfeedTable.prepend(newRow);
 		}
 	}

 	function continuousStream (){

 		addElement();
 		stream = setInterval (function(){addElement()},3000); 			
 	}

 	function changeSynopsisView (){
 		var amount = $(this).attr("id");
 		var synopsisString = "#synopsis" + amount;
 		var synopsisDiv = $(synopsisString);
 		if(synopsisDiv.css('display')=='none'){
 			synopsisDiv.css('display','inline');
 			$(this).css('background-color','yellow');
 		}  			
 		else if (synopsisDiv.css('display')=='inline'){
 			synopsisDiv.css('display','none');
 			$(this).css('background-color', 'LightGray');
 		} 
 	}

 	// Making a simple add without animation first 
 	function addElement (){
 		amount = amount + 1;
 		$.getJSON('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=93ynehw4e8qza7gsu9q8vfnq&page_limit=1&country=CA'+ "&page=" + amount+'&callback=?',function(data){

 				// Get the news feed table
 				var newsfeedTable = $("#movies");
 				
 				// Make a new row
 				var newRow = $('<div/>').attr('id',amount).attr('class','row');
 				
 				// Make a new synopsis
 				var newSynopsis = $('<div/>').attr('id','synopsis'+amount);

 				// Get all the information needed
 				var movies_array = data["movies"];
 				var total_movies = data["total"];
 				var movie = movies_array[0];
 				var image_url = movie["posters"].thumbnail;
 				var dt = new Date();
 				var title = movie["title"];
 				var synopsis = movie ["synopsis"];

 				// Set the total if not already set 
 				if(total==0)
 					total = total_movies;

 				// Add synopsis to synopsis
 				newSynopsis.append(synopsis);
 				newSynopsis.css("display","none");

 				// Add the image to the row
 				var image = $('<img/>').attr('src',image_url).attr('class','image');
 				var imageDiv = $('<div/>').attr('class','imageContainer');		
 				imageDiv.append(image);
 				newRow.append(imageDiv);


 				// Add the information to the row 
 				var informationDiv = $('<div/>').attr('class','information'); 				
 				informationDiv.append(dt+'');
 				informationDiv.append('<br/>')
 				informationDiv.append(title);
 				newRow.append(informationDiv);

 				newRow.on("click",changeSynopsisView);

 				// Add the row to the table
 				newSynopsis.prependTo(newsfeedTable);

 				newRow.hide();
				newsfeedTable.prepend(newRow);
				newRow.slideDown(600); 				
 				
				// Adding to local storage
				var cur_obj = JSON.parse('{}');
				cur_obj.image = image_url;
				cur_obj.date = dt;
				cur_obj["title"] = title;
				cur_obj.synopsis = synopsis;
 				storage['movies'].push(cur_obj);
 			
 				if(amount>=total)
 					clearInterval(stream); 						    
 		});		
	}
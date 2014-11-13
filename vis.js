
var redditSvg;
var previousData;

var POLL_SPEED = 2000;

function redditVis() {
  // setup a poll requesting data, and make an immediate request
  setInterval(requestData,POLL_SPEED);
  requestData();

  // initial setup only needs to happen once 
  // - we don't want to append multiple svg elements
  redditSvg = d3.select("body")
        .append("svg")
        .attr("width",document.body.clientWidth - 50)
        .attr("height",document.body.clientWidth -50)
}

function requestData() {
  // our jsonp url, with a cache-busting query parameter
  d3.jsonp("http://www.reddit.com/.json?jsonp=runVis&noCache=" + Math.random());
}


//////// PLEASE EDIT runVis /////////
/////////////////////////////////////
/////////////////////////////////////

function runVis(data) {

  // d3 never does anything automagical to your data
  // so we'll need to get data into the right format, with the
  // previous values attached
  var formatted = formatRedditData(data,previousData);
  // select our stories, pulling in previous ones to update
  // by selecting on the stories' class name
  var stories = redditSvg
     .selectAll("text")
     // the return value of data() is the update context - so the 'stories' var is
     // how we refence the update context from now on
     .data(formatted,function(d) {
       // prints out data in your console id, score, diff from last pulling, text
       
       // console.log(d.id,d.score,d.diff,d.title);

       // use a key function to ensure elements are always bound to the same 
       // story (especially important when data enters/exits)
       return d.id;
     });

  // ENTER context
  stories.enter()
    .append("text")
    .text(function(d){return d.score + " " + d.diff + " " + d.title})
    .attr("y", function(d,i){return 1.5*i + 1 + "em"});

	var h= 0;
	var j = 0;
	//if(d.diff>0) { return "15px"; } else { return "0px"; } 
	var k=0;
  // UPDATE + ENTER context
  // elements added via enter() will then be available on the update context, so
  // we can set attributes once, for entering and updating elements, here
  var votedUp = 0;
  var votedDown = 0;
  var data  = [(h/25) * 100 , ((25-h)/25) * 100 ];
  stories.transition().duration(1200)
    .text(function(d){ return d.score + " " + d.diff + " " + d.title}).style("fill",function(d) { if(d.diff>0) { return "green"; } else { return "red"; } } ).attr("y", function(d){ 	data  = [(h/25) * 100 , ((25-h)/25) * 100 ];
		if(d.diff>0) {
			h++;
			return 1.5*h + 1 + "em";
		} else {
			j++;
			return 1.5*j + 1 + "em";
		}		
	}).attr("y",function(d) { if(d.diff>0) { k++; return 1.5*k + 1 + "em";  } else { h++; return 1.5*h + 1 + "em"; } } ).
	style("font-size",function(d) { draw(data,j); return 14;});	
	
  // EXIT content
  stories.exit()
    .remove()
}


//////// PLEASE EDI runVis() /////////
/////////////////////////////////////
/////////////////////////////////////


function formatRedditData(data) {
  // dig through reddit's data structure to get a flat list of stories
  var formatted = data.data.children.map(function(story) {
    return story.data;
  });
  // make a map of storyId -> previousData
  var previousDataById = (previousData || []).reduce(function(all,d) {
    all[d.id] = d;
    return all;
  },{});
  // for each present story, see if it has a previous value,
  // attach it and calculate the diff
  formatted.forEach(function(d) {
    d.previous = previousDataById[d.id];
    d.diff = 0;
    if(d.previous) {
      d.diff = d.score - d.previous.score;
    }
  });
  // our new data will be the previousData next time
  previousData = formatted;
  return formatted;
}

redditVis();

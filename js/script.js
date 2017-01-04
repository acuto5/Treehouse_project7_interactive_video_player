/********
Variables
********/
var VP				= document.getElementById("video");						//video player
var playPauseBtn	= document.getElementById("play-pause");				//play/pause button
var playPauseIcon	= document.getElementById("play-pause-icon");			//play/pause image
var progressBar		= document.getElementById("progress-bar");				//video progress bar
var bufferedBar		= document.getElementById("buffered-bar");				//video buffered bar
var currentTimeSpan	= document.getElementById("current-time");				//video current time span element
var volumeBtn		= document.getElementById("volume");					//volume button
var volumeIcon		= document.getElementById("volume-on-icon");			//volume image
var volumeBar		= document.getElementById("volume-bar");				//volume range
var durationSpan	= document.getElementById("duration");					//video player duration span element
var fullScreenBtn	= document.getElementById("full-screen");				//full screen button
var captionsBtn		= document.getElementById("cc");						//captions closed button
var ccIcon			= document.getElementById("caption-closed");			//caption closed image
var rewindBtn		= document.getElementById("rewind");					//rewind button
var speedSpan		= document.getElementById("speed");						//video speed span
var captionDiv		= document.getElementById("captions");					//Captions div for transcript text
var VPvolume		= 0;													//video player volume level
var transcript 		= 														//use for transcript text below video
[
	{"p": true,	"start": "0.241",  	"end": "4.130",  "caption": "Now that we've looked at the architecture of the internet, let's see how you might"},
	{			"start": "4.131",  	"end": "7.535",  "caption": "connect your personal devices to the internet inside your house."},
	{			"start": "7.536",  	"end": "11.270", "caption": "Well there are many ways to connect to the internet, and"},
	{			"start": "11.271",	"end": "13.960", "caption": "most often people connect wirelessly."},
	{"p": true, "start": "13.961", 	"end": "17.940", "caption": "Let's look at an example of how you can connect to the internet."},
	{			"start": "17.941",	"end": "22.370", "caption": "If you live in a city or a town, you probably have a coaxial cable for"},
	{			"start": "22.371",	"end": "26.880", "caption": "cable Internet, or a phone line if you have DSL, running to the outside of"},
	{			"start": "26.881",	"end": "30.920", "caption": "your house, that connects you to the Internet Service Provider, or ISP."},
	{			"start": "32.101",	"end": "34.730", "caption": "If you live far out in the country, you'll more likely have"},
	{			"start": "34.731",	"end": "39.430", "caption": "a dish outside your house, connecting you wirelessly to your closest ISP, or"},
	{			"start": "39.431",	"end": "41.190", "caption": "you might also use the telephone system."},
	{"p": true,	"start": "42.351", 	"end": "46.300", "caption": "Whether a wire comes straight from the ISP hookup outside your house, or"},
	{			"start": "46.301",	"end": "49.270", "caption": "it travels over radio waves from your roof,"},
	{			"start": "49.271",	"end": "53.760", "caption": "the first stop a wire will make once inside your house, is at your modem."},
	{			"start": "53.761",	"end": "57.780", "caption": "A modem is what connects the internet to your network at home."},
	{			"start": "57.781",	"end": "60.150", "caption": "A few common residential modems are DSL or..."}
];

/********
Functions
********/
function getSetCaptions(){	//get and print out transcript text below video
	var html = "";
	for(var i =0; i < transcript.length; i++){
		if(transcript[i].p === true && i === 0){
			html += "<p>";
		}else if(transcript[i].p === true){
			html += "</p><p>";
		}
		html += "<span data-start='" + transcript[i].start + "' data-end='" + transcript[i].end + "'>" + transcript[i].caption + "</span> ";
	}
	html += "</p>";
	captionDiv.innerHTML = html;
}

function addEventListenerToTranscriptText(){	//add 'click' event listeners to transcription text below video
	for (var i = 0; i < captionDiv.children.length; i++) {
		for(var j=0; j<captionDiv.children[i].children.length; j++){
			captionDiv.children[i].children[j].addEventListener("click", textTranscriptJump, false); 
		}
	}
}

function getVideoDuration(){	//return video duration in "mm:ss" format
	var min, sec;
	min = minTwoDigits(parseInt(Math.floor(VP.duration) / 60, 10));
	sec = minTwoDigits(parseInt(Math.floor(VP.duration) % 60));
	return min + ":" + sec;
}

function minTwoDigits(n) {	//add 0 in front of number if it is lower than 10 and return it
	return (n < 10 ? '0' : '') + n;
}

function setVPduration(duration){	//set video duration span text to video duration time

	durationSpan.innerHTML = getVideoDuration();
	progressBar.max = parseInt(Math.floor(VP.duration));
}

function play(){	//play or pause video
	if(VP.paused){
		VP.play();
		playPauseIcon.src = "icons/pause-icon.png";
	}
	else{
		VP.pause();
		playPauseIcon.src = "icons/play-icon.png";
	}
}

function muteUnmute(){	//mute or unmute video
	if(VP.muted === true){
		VP.muted = false;
		volumeIcon.src = "icons/volume-on-icon.png";
		if(VPvolume != "undefined"){
			volumeBar.value = VPvolume;
		}else{
			volumeBar.value = 1;
		}
	}else{
		VP.muted = true;
		volumeIcon.src = "icons/volume-off-icon.png";
		VPvolume = volumeBar.value;
		volumeBar.value = 0;
	}
}

function toggleCaptions(){	//switch on or off captions closed
	if (VP.textTracks[0].mode == "showing") {
		VP.textTracks[0].mode = "hidden";
		ccIcon.src = "icons/cc-off-icon.png";
	} else {
		VP.textTracks[0].mode = "showing";
		ccIcon.src = "icons/cc-on-icon.png";
	}    
}

function bufferProgress() {	//show video buffered bar in progress
	if (VP.readyState === 4){
		var value = parseInt(((VP.buffered.end(0) / VP.duration) * 100));
		bufferedBar.value = value;
	}
}

function progressBarCurrentTimeUpdate () {	//show progress bar in action
	var minutes = parseInt(Math.floor(VP.currentTime) / 60, 10);
	var seconds = parseInt(Math.floor(VP.currentTime) % 60);
	var value = (progressBar.max / VP.duration) * VP.currentTime;
	currentTimeSpan.innerHTML = minTwoDigits(minutes) + ":" + minTwoDigits(seconds);
	progressBar.value = value;
	if(value == progressBar.max){
		VP.pause();
		playPauseIcon.src = "icons/play-icon.png";
	}
}

function fullScreenMode(){	//video in fullscreen
	if (VP.requestFullscreen) {
		VP.requestFullscreen();
	} else if (VP.mozRequestFullScreen) {
		VP.mozRequestFullScreen();
	} else if (VP.webkitRequestFullscreen) {
		VP.webkitRequestFullscreen();
	}
}

function changeVolume(){	//change video volume level
	VP.volume = volumeBar.value;
	VP.muted = false;
	if(volumeBar.value === 0){
		volumeIcon.src = "icons/volume-off-icon.png";
	}else{
		volumeIcon.src = "icons/volume-on-icon.png";
	}
}

function changeProgressBar(e){	//set progress bar value on click event
	var clickValue = e.offsetX / this.offsetWidth;				
	VP.currentTime = clickValue * VP.duration;
	progressBar.value = clickValue * progressBar.max;
}

function rewind10sec(){	//rewind video 10 sec back
	if(VP.currentTime >= 10){
		VP.currentTime -= 10;
	}else{
		VP.currentTime = 0;
	}
}

function changeVPspeed(){	//change video speed to "1x", "2x" or "0.5x"
	if(speedSpan.dataset.speed == "1"){
		VP.playbackRate = 2;
		speedSpan.innerHTML = "2x";
		speedSpan.dataset.speed = 2;
	}else if(speedSpan.dataset.speed == "2"){
		VP.playbackRate = 0.5;
		speedSpan.innerHTML = "0.5x";
		speedSpan.dataset.speed = 0.5;
	}else if(speedSpan.dataset.speed == "0.5"){
		VP.playbackRate = 1;
		speedSpan.innerHTML = "1x";
		speedSpan.dataset.speed = 1;
	}
}

function addRemoveClassTranscript(){	//add/remove class for transcripted text below video to highlight it
	for(var i = 0; i < captionDiv.children.length; i++){	
		for(var j=0; j<captionDiv.children[i].children.length; j++){
			if(VP.currentTime >= captionDiv.children[i].children[j].dataset.start && VP.currentTime <= captionDiv.children[i].children[j].dataset.end){
				captionDiv.children[i].children[j].classList.add("orange");
			}
			else{
				captionDiv.children[i].children[j].classList.remove("orange");
				captionDiv.children[i].children[j].removeAttribute("class");
			}
		}
	}
}

function textTranscriptJump() {	//When user clicks on any sentence in the transcript, video player jumps to the appropriate time in the video.
	VP.currentTime = this.dataset.start;
	addRemoveClassTranscript();
 }

/***************
Events listeners
***************/
window.addEventListener('load', getSetCaptions, false);						//get and print out transcript text below video
window.addEventListener('load', addEventListenerToTranscriptText, false);	//add event listeners to transcript text
VP.addEventListener('loadedmetadata', setVPduration, false);				//get video duration and set it to durationSpan
VP.addEventListener("progress", bufferProgress, false);						//show buffered video bar
VP.addEventListener("timeupdate", progressBarCurrentTimeUpdate, false);		//show progress bar when video is playing
VP.addEventListener("timeupdate", addRemoveClassTranscript, false);			//add/remove class for transcripted text below video
playPauseBtn.addEventListener('click', play, false);						//play or pause video event
volumeBtn.addEventListener('click', muteUnmute, false);						//mute or unmute video
captionsBtn.addEventListener('click', toggleCaptions, false);				//switch on or off captions closed
rewindBtn.addEventListener('click', rewind10sec, false);					//rewind video 10 seconds back
speedSpan.addEventListener('click', changeVPspeed, false);					//change video player speed to "1x", "2x", "0.5x"
progressBar.addEventListener("click", changeProgressBar, false);			//set progress bar and video player currentTime values
fullScreenBtn.addEventListener("click", fullScreenMode, false);				//show video in fullscreen
volumeBar.addEventListener('change', changeVolume, false);					//change video volume
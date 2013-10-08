self.addEventListener('message', function(e) {
	function countdown() {
		self.postMessage({ "message": "ping" });
		setTimeout(countdown, 60000); 
	}
	setTimeout(countdown, 60000); 
}, false); 
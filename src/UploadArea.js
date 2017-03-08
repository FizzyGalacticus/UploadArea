if(!document.getElementById('css-percentage-circle')) {
    var link = document.createElement('link');
    link.id = 'css-percentage-circle';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.rawgit.com/afuersch/css-percentage-circle/c9f4ea10/css/circle.css';
    document.head.appendChild(link);
}

UploadArea = function(divId, options) {
	var self = this;
	self.divId = divId;
	self.options = {
		allowMultiple: true,
		sendTo: 'https://posttestserver.com/post.php',
		progressArea: 'UploadAreaProgress',
		progressColors: {
			primary: 'green',
			secondary: 'blue'
		},
		onFilesReceived: function(files) {
			//
		}
	};

	self.previousProgressPercentage = 0;

	if(!divId) {
		console.error('divId not set... ABORTING!');
		return;
	}

	ondragover = function(event) {
		event.preventDefault();
	};

	ondrop = function(event) {
		event.preventDefault();
		var dataTransfer = event.dataTransfer;

        if(dataTransfer.items) {
            var files = [];
            for(var i = 0; i < dataTransfer.items.length; i++) {
                var item = dataTransfer.items[i];
                if(item.kind == "file") {
                    var file = item.getAsFile();
                    files.push(file);
                }
            }

            self.options.onFilesReceived(files);
            self.options.upload(files);
        }
	};

	toggleHidden = function(elemId) {
		var elem = document.getElementById(elemId);
		if(elem) {
			if (elem.style.display === 'none') {
				elem.style.display = 'block';
			} else {
				elem.style.display = 'none';
			}
		}
	};

	self.options.upload = function(files) {
		if(files && files.length > 0) {
			if(files && files.length > 0) {
				var fileData = new FormData();

				for(var i = 0; i < files.length; i++) {
					var file = files[i];
					fileData.append(file.name, file);
				}

				var uploadRequest = new XMLHttpRequest();
				uploadRequest.open('POST', self.options.sendTo, true);

				uploadRequest.upload.onprogress = function(progressEvent) {
					if (progressEvent.lengthComputable) {
						var percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
						var progressArea = document.getElementById('cssProgressArea');

						if(progressArea) {
							var progressSpan = document.getElementById('cssProgressAreaSpan');
							progressSpan.innerHTML = percentComplete + '%';

							progressArea.classList.remove('p' + self.previousProgressPercentage);
							progressArea.classList.add('p' + percentComplete);
						}

						if(percentComplete == 100) {
							toggleHidden(self.divId);
							toggleHidden(self.options.progressArea);
							self.previousProgressPercentage = 0;
						}

						self.previousProgressPercentage = percentComplete;
					}
				};
				uploadRequest.onload = function() {
					if (this.status == 200) {
						// console.log('Server got:', this.responseText); EVERYTHING IS OKAY!
					};
				};
				uploadRequest.send(fileData);
				toggleHidden(self.divId);
				toggleHidden(self.options.progressArea);
			}
		}
	}

	if(options) {
		optionkeys = Object.keys(options);
		for(var i = 0; i < optionkeys.length; i++) {
			self.options[optionkeys[i]] = options[optionkeys[i]];
		}
	}

	var uploadArea = document.getElementById(self.divId);
	if(uploadArea) {
		uploadArea.setAttribute('ondragover', self.ondragover);
		uploadArea.setAttribute('ondrop', self.ondrop);
	}

	var loadingArea = document.getElementById(self.options.progressArea);
	if(loadingArea) {
		toggleHidden(self.options.progressArea);
		loadingArea.innerHTML = ('<div id="cssProgressArea" class="c100 p0"><span id="cssProgressAreaSpan"></span><div class="slice">' +
								'<div class="bar"></div><div class="fill"></div></div></div>');
	}
};
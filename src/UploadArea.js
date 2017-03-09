if(!document.getElementById('css-percentage-circle')) {
	var link  = document.createElement('link');
	link.id   = 'css-percentage-circle';
	link.rel  = 'stylesheet';
	link.href = 'https://cdn.rawgit.com/afuersch/css-percentage-circle/c9f4ea10/css/circle.css';
    document.head.appendChild(link);
}

UploadArea = function(divId, options) {
	var self     = this;
	self.divId   = divId;
	self.options = {
		allowDrop: true,
		allowMultiple: true,
		sendTo: 'https://posttestserver.com/post.php',
		progressArea: 'UploadAreaProgress',
		progressColor: 'green',
		onFilesReceived: function(files) {
			//
		}
	};

	self.previousProgressPercentage = 0;

	if(!divId) {
		console.error('divId not set... ABORTING!');
		return;
	}

	if(options) {
		optionkeys = Object.keys(options);
		for(var i = 0; i < optionkeys.length; i++) {
			self.options[optionkeys[i]] = options[optionkeys[i]];
		}
	}

	var uploadArea = document.getElementById(self.divId);
	if(uploadArea) {
		uploadArea.addEventListener('dragover', function(event) {self.ondragover(event);});
		uploadArea.addEventListener('drop', function(event) {self.ondrop(event);});
		uploadArea.addEventListener('click', function(event) {
			var fileInput = document.getElementById('fileInput');
			fileInput.click();
		});
		uploadArea.style.cursor = 'pointer';

		var fileInput           = document.createElement('input');
		fileInput.type          = 'file';
		fileInput.style.display = 'none';
		fileInput.id            = 'fileInput';
		if(self.options.allowMultiple) fileInput.setAttribute('multiple', '');
		fileInput.addEventListener('change', function(event) {self.handleFiles(this.files);});
		uploadArea.appendChild(fileInput);
	}

	var loadingArea = document.getElementById(self.options.progressArea);
	if(loadingArea) {
		UploadArea.hideElement(self.options.progressArea);
		loadingArea.innerHTML = ('<div id="cssProgressArea" class="c100 p0 ' + self.options.progressColor + '"><span id="cssProgressAreaSpan"></span><div class="slice">' +
								'<div class="bar"></div><div class="fill"></div></div></div>');
	}
};

UploadArea.prototype.ondragover = function(event) {
	event.preventDefault();
};

UploadArea.prototype.handleFiles = function(files) {
	this.options.onFilesReceived(files);

    if(this.options.upload)
    	this.options.upload(files);
    else
    	this.upload(files);
};

UploadArea.prototype.ondrop = function(event) {
	if(this.options.allowDrop) {
		var self = this;
		event.preventDefault();
		var dataTransfer = event.dataTransfer;

	    if(dataTransfer.items) {
	        var files = [];
		    if(self.multiple) {
		    	for(var i = 0; i < dataTransfer.items.length; i++) {
		            var item = dataTransfer.items[i];
		            if(item.kind == "file") {
		                var file = item.getAsFile();
		                files.push(file);
		            }
		        }
		    }
		    else if(dataTransfer.items.length > 0)
		    	files.push(dataTransfer.items[0].getAsFile());
	        
	        self.handleFiles(files);
	    }
	}
};

UploadArea.hideElement = function(elemId) {
	var elem = document.getElementById(elemId);
	if(elem) {
		elem.style.display = 'none';
	}
};

UploadArea.showElement = function(elemId) {
	var elem = document.getElementById(elemId);
	if(elem) {
		elem.style.display = 'block';
	}
};

UploadArea.prototype.resetProgress = function() {
	var progressArea    = document.getElementById('cssProgressArea');
	if(progressArea) {
		var progressSpan = document.getElementById('cssProgressAreaSpan');
		progressSpan.innerHTML = 0 + '%';

		progressArea.classList.remove('p100');
		progressArea.classList.add('p0');
	}
};

UploadArea.prototype.onComplete = function(response) {
	if(this.options.complete)
		this.options.complete(response);
	else {
		//Do Stuff here
	}
};

UploadArea.prototype.onError = function(response) {
	if(this.options.complete)
		this.options.complete(response);
	else {

	}
};

UploadArea.prototype.onProgress = function(progressEvent) {
	var self = this;
	UploadArea.hideElement(self.divId);
	UploadArea.showElement(self.options.progressArea);
	if (progressEvent.lengthComputable) {
		var percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
		var progressArea    = document.getElementById('cssProgressArea');

		if(progressArea) {
			var progressSpan = document.getElementById('cssProgressAreaSpan');
			progressSpan.innerHTML = percentComplete + '%';

			progressArea.classList.remove('p' + self.previousProgressPercentage);
			progressArea.classList.add('p' + percentComplete);
		}

		if(percentComplete == 100) {
			UploadArea.showElement(self.divId);
			UploadArea.hideElement(self.options.progressArea);
			self.previousProgressPercentage = 0;
		}

		self.previousProgressPercentage = percentComplete;
	}
};

UploadArea.prototype.upload = function(files) {
	var self = this;
	if(files && files.length > 0) {
		if(files && files.length > 0) {
			var fileData = new FormData();

			for(var i = 0; i < files.length; i++) {
				var file = files[i];
				fileData.append(file.name, file);
			}

			var uploadRequest = new XMLHttpRequest();
			uploadRequest.open('POST', self.options.sendTo, true);

			uploadRequest.upload.onprogress = function(event){
				if(self.options.progress)
					self.options.progress(event);
				else self.onProgress(event);
			};

			uploadRequest.onload = function() {
				if (this.status == 200)
					self.onComplete(this.responseText);
				else
					self.onError(this.responseText);
			};
			uploadRequest.send(fileData);

			if(!self.options.progress) {
				self.resetProgress();
				UploadArea.showElement(self.options.progressArea);
				UploadArea.hideElement(self.divId);
			}
		}
	}
};
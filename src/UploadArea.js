if(!document.getElementById('css-percentage-circle')) {
	var link  = document.createElement('link');
	link.id   = 'css-percentage-circle';
	link.rel  = 'stylesheet';
	link.href = 'https://cdn.rawgit.com/afuersch/css-percentage-circle/c9f4ea10/css/circle.css';
    document.head.appendChild(link);
}

class UploadArea {
	constructor(divId, options) {
		this.instanceNumber = ++(UploadArea.instances);
		this.divId   = divId;
		this.options = {
			required: false,
			allowDrop: true,
			allowMultiple: true,
			sendTo: 'https://posttestserver.com/post.php',
			progressArea: 'UploadAreaProgress',
			progressColor: 'green',
			onFilesReceived: (files) => {
				//
			}
		};
		this.previousProgressPercentage = 0;

		if(options) {
			let optionkeys = Object.keys(options);
			for(let i = 0; i < optionkeys.length; i++) {
				this.options[optionkeys[i]] = options[optionkeys[i]];
			}
		}

		let uploadArea = document.getElementById(this.divId);
		if(uploadArea) {
			uploadArea.addEventListener('dragover', (event) => {this.ondragover(event);});
			uploadArea.addEventListener('drop', (event) => {this.ondrop(event);});
			uploadArea.addEventListener('click', (event) => {
				let fileInput = document.getElementById('uploadAreaFileInput' + this.instanceNumber);
				fileInput.click();
			});
			uploadArea.style.cursor = 'pointer';

			let fileInput           = document.createElement('input');
			fileInput.type          = 'file';
			fileInput.style.display = 'none';
			fileInput.id            = 'uploadAreaFileInput' + this.instanceNumber;
			if(this.options.required) fileInput.setAttribute('required', '');
			if(this.options.allowMultiple) fileInput.setAttribute('multiple', '');
			fileInput.addEventListener('change', (event) => {this.handleFiles(fileInput.files);});
			uploadArea.appendChild(fileInput);
		}

		let loadingArea = document.getElementById(this.options.progressArea);
		if(loadingArea) {
			UploadArea.hideElement(this.options.progressArea);
			loadingArea.innerHTML = ('<div id="cssProgressArea" class="c100 p0 ' + this.options.progressColor + '"><span id="cssProgressAreaSpan"></span><div class="slice">' +
									'<div class="bar"></div><div class="fill"></div></div></div>');
		}
	}

	ondragover(event) {
		event.preventDefault();
	}

	handleFiles(files) {
		this.options.onFilesReceived(files);

	    if(this.options.upload)
	    	this.options.upload(files);
	    else
	    	this.upload(files);
	}

	ondrop(event) {
		if(this.options.allowDrop) {
			event.preventDefault();
			let dataTransfer = event.dataTransfer;

		    if(dataTransfer.items) {
		        let files = [];
			    if(this.options.allowMultiple) {
			    	for(let i = 0; i < dataTransfer.items.length; i++) {
			            let item = dataTransfer.items[i];
			            if(item.kind == "file") {
			                let file = item.getAsFile();
			                files.push(file);
			            }
			        }
			    }
			    else if(dataTransfer.items.length > 0)
			    	files.push(dataTransfer.items[0].getAsFile());
		        
		        this.handleFiles(files);
		    }
		}
	}

	static hideElement(elemId) {
		let elem = document.getElementById(elemId);
		if(elem) {
			elem.style.display = 'none';
		}
	}

	static showElement(elemId) {
		let elem = document.getElementById(elemId);
		if(elem) {
			elem.style.display = 'block';
		}
	}

	resetProgress() {
		let progressArea    = document.getElementById('cssProgressArea');
		if(progressArea) {
			let progressSpan = document.getElementById('cssProgressAreaSpan');
			progressSpan.innerHTML = 0 + '%';

			progressArea.classList.remove('p100');
			progressArea.classList.add('p0');
		}
	}

	onComplete(response) {
		if(this.options.complete)
			this.options.complete(response);
		else {
			//Do Stuff here
		}
	}

	onError(response) {
		if(this.options.error)
			this.options.error(response);
		else {

		}
	}

	onProgress(progressEvent) {
		UploadArea.hideElement(this.divId);
		UploadArea.showElement(this.options.progressArea);
		if (progressEvent.lengthComputable) {
			let percentComplete = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
			let progressArea    = document.getElementById('cssProgressArea');

			if(progressArea) {
				let progressSpan = document.getElementById('cssProgressAreaSpan');
				progressSpan.innerHTML = percentComplete + '%';

				progressArea.classList.remove('p' + this.previousProgressPercentage);
				progressArea.classList.add('p' + percentComplete);
			}

			if(percentComplete == 100) {
				UploadArea.showElement(this.divId);
				UploadArea.hideElement(this.options.progressArea);
				this.previousProgressPercentage = 0;
			}

			this.previousProgressPercentage = percentComplete;
		}
	}

	upload(files, additionalData) {
		if(files && files.length > 0) {
			let fileData = new FormData();

			for(let i = 0; i < files.length; i++) {
				let file = files[i];
				fileData.append(file.name, file);
			}

			if(additionalData) {
				let keys = Object.keys(additionalData);
				for(let i = 0; i < keys.length; i++)
					fileData.append(keys[i], additionalData[keys[i]]);
			}

			let uploadRequest = new XMLHttpRequest();
			uploadRequest.open('POST', this.options.sendTo, true);

			uploadRequest.upload.onprogress = (event) => {
				if(this.options.progress)
					this.options.progress(event);
				else this.onProgress(event);
			};

			uploadRequest.onload = () => {
				if (uploadRequest.status == 200)
					this.onComplete(uploadRequest.responseText);
				else
					this.onError(uploadRequest.responseText);
			};
			uploadRequest.send(fileData);

			if(!this.options.progress) {
				this.resetProgress();
				UploadArea.showElement(this.options.progressArea);
				UploadArea.hideElement(this.divId);
			}
		}
	}
}

UploadArea.instances = 0;
class UploadArea {
	constructor(divId = 'uploadArea', options) {
		this.instanceNumber = ++(UploadArea.instances);
		this.divId = divId;
		this.options = {
			required: false,
			allowDrop: true,
			allowMultiple: true,
			sendTo: 'https://posttestserver.com/post.php',
			onFilesReceived: (files) => {
				//
			},
		};
		this.previousProgressPercentage = 0;

		if(options && typeof options == 'object') {
			for(const key in options) {
				if({}.hasOwnProperty.call(options, key))
					this.options[key] = options[key];
			}
		}

		this.init();
	}

	init() {
		let uploadArea = document.getElementById(this.divId);
		if(uploadArea) {
			this.initUploadArea(uploadArea);
			this.initFileInput();

			this.uploadArea.appendChild(this.fileInput);
		}
	}

	initUploadArea(uploadArea) {
		this.uploadArea = uploadArea;

		this.uploadArea.addEventListener('dragover', (event) => {
			this.ondragover(event);
		});

		this.uploadArea.addEventListener('drop', (event) => {
			this.ondrop(event);
		});

		this.uploadArea.addEventListener('click', (event) => {
			this.fileInput.click();
		});

		this.uploadArea.style.cursor = 'pointer';
	}

	initFileInput() {
		this.fileInput = document.createElement('input');

		this.fileInput.type = 'file';
		this.fileInput.style.display = 'none';
		this.fileInput.id = `uploadAreaFileInput${this.instanceNumber}`;

		if(this.options.required)
			this.fileInput.setAttribute('required', '');

		if(this.options.allowMultiple)
			this.fileInput.setAttribute('multiple', '');

		this.fileInput.addEventListener('change', (event) => {
			this.handleFiles(this.fileInput.files);
			this.fileInput.value = null;
		});
	}

	ondragover(event) {
		event.preventDefault();
	}

	handleFiles(files) {
		if(!Array.isArray(files)) {
			let fileArr = [];

			for(const file of files)
				fileArr.push(file);

			files = fileArr;
		}

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
					for(const item of dataTransfer.items) {
						if(item.kind == 'file') {
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
		if(elem)
			elem.style.display = 'none';
	}

	static showElement(elemId) {
		let elem = document.getElementById(elemId);
		if(elem)
			elem.style.display = 'block';
	}

	onComplete(response) {
		if(this.options.complete)
			this.options.complete(response);
		else {
			// Do Something
		}
	}

	onError(response) {
		if(this.options.error)
			this.options.error(response);
		else {

		}
	}

	upload(files) {
		if(files && files.length > 0) {
			let fileData = new FormData();

			for(const file of files)
				fileData.append(file.name, file);

			let uploadRequest = new XMLHttpRequest();
			uploadRequest.open('POST', this.options.sendTo, true);

			uploadRequest.upload.onprogress = (event) => {
				if(this.options.progress)
					this.options.progress(event);
			};

			uploadRequest.onload = () => {
				if(uploadRequest.status == 200)
					this.onComplete(uploadRequest.responseText);
				else
					this.onError(uploadRequest.responseText);
			};

			uploadRequest.send(fileData);
		}
	}
}

UploadArea.instances = 0;

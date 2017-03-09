# UploadArea

This project is to (hopefully) become an extremely easy to use, fully customizable drag-and-drop file upload handler written in Vanilla JS.

Currently, all you need to do is create a ```<div>``` with an id, then create a new ```UploadArea``` object with the id and page to POST to specified:

```html
<div id="myDragDrop">Drag Here</div>

<script>
var uploadArea = new UploadArea('myDragDrop', {sendTo:'https://myurl.com'});
</script>
```
You can also have a progress bar that will hide/show on upload:
```html
<div id="UploadAreaProgress"></div>
<div id="myDragDrop">Drag here</div>

<script>
var uploadArea = new UploadArea('myDragDrop', {sendTo:'https://myurl.com'});
</script>
```

Want to handle the files yourself, or get more information about them? No problem! Just send in a function as one of the options, and it will be passed the list of File objects for handling!
```html
<div id="UploadAreaProgress"></div>
<div id="myDragDrop">Drag here</div>

<script>
var uploadArea = new UploadArea('myDragDrop', {
    sendTo:'https://myurl.com',
    upload: function(files) {
        //This method will override the existing upload method
    },
    onFilesReceived(files) {
        //This method will be called alongside the upload method;
    }
});
</script>
```

That's it so far! Stay tuned for some new features to be added and refactors to be made!
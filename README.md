# UploadArea

This project is to (hopefully) become an extremely easy to use, fully customizable drag-and-drop file upload handler written in ES6 and compiled down to ES5.

All you need to do to get started is create a ```<div>``` with an id, then create a new ```UploadArea``` object with the id and page to POST to specified in the options:

```html
<div id="myDragDrop">Drag Here</div>

<script>
var uploadArea = new UploadArea('myDragDrop', {sendTo:'https://myurl.com'});
</script>
```

Here is a full list of options/functions that can be passed to the constuctor:

**Name**|**Type**|**Description**
-----|-----|-----
sendTo|string|URL to post files to. By default this is ```https://posttestserver.com/post.php```.
allowDrop|boolean|Default value is ```true```. When true, allows users to drag and drop files into the UploadArea for uploading.
upload|function|When set, this is called instead of the UploadArea default upload function. It is passed a list of File objects which can be used for custom uploading.
progress|function|Function to be called when upload progress is made. When overridden without the upload function being overridden, this is passed an XMLHttpRequest progress event.
complete|function|Called when upload has completed successfully and is passed the response message from the server.
error|function|Called when an error occurs during the upload process and is passed the full response from the server.
allowMultiple|boolean|Default value is ```true```. When true, UploadArea will allow multiple file uploads at the same time. When false, only a single file is allowed. When multiple files are dropped onto the UploadArea and this is false, only the first file in the array is sent.
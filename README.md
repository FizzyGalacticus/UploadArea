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

That's it so far! Stay tuned for some new features to be added and refactors to be made!

WARNING: This currently sets global function variables, as I am learning as I write it. Now that I have something mostly functional, I can begin the refactor process and make this beast more self-contained.
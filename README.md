# USAGE
```
import Quill from 'quill'
import { ImagePaste, container } from '@/components/quill-image-paste-module

Quill.register('modules/imagePaste', ImagePaste);

```
```
        editorOption: {  
          modules: {
            imagePaste: true,
            toolbar: {
              container: container,
            }
          }
```

or

```
<script src="./quill-image-paste-module/src/index.js"></script>
```
```
var quill = new Quill(editor, {
  // ...
  modules: {
    // ...
    imagePaste: true
  }
});
```
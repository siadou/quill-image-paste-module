export class ImagePaste {
  constructor (quill, options = {}) {
    this.quill = quill
    this.eventRegister()
    this.preventDefaultFlag = false
  }

  // 事件注册
  eventRegister () {
    this.handlePaste = this.handlePaste.bind(this)
    this.quill.root.addEventListener('paste', this.handlePaste)
  }

  // paste事件处理
  handlePaste (evt) {
    this.insert = this.insert.bind(this)
    let clipboardData = evt.clipboardData || evt.originalEvent.clipboardData
    if (clipboardData && clipboardData.items) {
      let items = clipboardData.items
      this.readFiles(items, this.insert)
      console.log(items)
    }
    if (this.preventDefaultFlag) {
      // 兼容firefox自带粘贴图片功能，同时允许除图片以外的默认复制行为
      evt.preventDefault()
    }
    this.preventDefaultFlag = false
    setTimeout(() => {
      this.quill.selection.scrollIntoView()
      this.quill.focus()
    }, 1)
  }

  // 从clipboardData中读取图片base64数据
  readFiles (items, callback) {
    [].forEach.call(items, item => {
      console.log(item.kind, item.type)
      if (item.kind === 'file' && item.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
        let blob = item.getAsFile()
        let reader = new FileReader()
        reader.onload = function (evt) {
          callback && callback(evt.target.result)
        } // data url!
        reader.readAsDataURL(blob)
        // 同步函数最后调用
        this.preventDefaultFlag = true
      }
    })
  }

  // 将base64数据装饰成<img>标签插入quill中
  insert (base64 = '') {
    let selection = this.quill.getSelection() // null may be returned if editor does not have focus
    let index = (this.quill.getSelection() || {}).index || this.quill.getLength() - 1
    if (selection) {
      // we must be in a browser that supports pasting (like Firefox)
      // so it has already been placed into the editor
      setTimeout(function () {
        this.quill.insertEmbed(index, 'image', base64, 'user')
        this.quill.update()
        this.quill.setSelection(index + 1, 0, 'api')
      }.bind(this), 0)
    } else {
      // otherwise we wait until after the paste when this.quill.getSelection()
      // will return a valid index
    }
  }
}

if (window.Quill) {
  window.Quill.register('modules/imagePaste', ImagePaste);
}

export const container = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video']
]
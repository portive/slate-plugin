# Uploading Files

In [Getting Started](./01-getting-started.md), we added support for uploading by pasting files into or dropping files onto the editor by adding `editor.cloud.handlePaste` and `editor.cloud.handleDrop` on the `Editable` component.

Slate Cloud also supports uploading files by opening the system file picker, for example, when a user clicks an image or attachment button in a toolbar.

- [Upload using a File Input](#upload-using-a-input-typefile)
- [Upload using a File Object](#upload-using-file-object)

## Upload using a File Input

To upload from an `<input type="file" />` element, add the `editor.cloud.onInputFileChangeHandler` to the `onChange` attribute.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  return (
    <>
      {/* ✅ Upload on change. `multiple` enables multi-file uploads */}
      <input
        type="file"
        onChange={editor.portive.handleInputFileChange}
        multiple
      />
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onPaste={editor.cloud.handlePaste}
          onDrop={editor.cloud.handleDrop}
        />
      </Slate>
    </>
  )
}
```

When the user clicks the `<input type="file" />` button, it opens a file picker, and when files are picked the upload process begins.

## Upload using File Object

To programmatically upload a file from a `File` object, use the `editor.portive.uploadFile` method and pass a `File` object as the first argument.

Internally, the `handlePaste`, `handleDrop` and `handleInputFileChange` methods use the `editor.portive.uploadFile` method.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  // ✅ This callback goes through each file and uploads it
  const upload = useCallback(
    (e) => {
      const files = e.target.files
      if (files == null || files.length === 0) return
      for (const file of files) {
        editor.portive.uploadFile(file)
      }
    },
    [editor]
  )

  return (
    <>
      {/* ✅ use the `uploadPdfs` callback with individual `uploadFile` */}
      <input type="file" onChange={upload} multiple />
      <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          onPaste={editor.portive.handlePaste}
          onDrop={editor.portive.handleDrop}
        />
      </Slate>
    </>
  )
}
```

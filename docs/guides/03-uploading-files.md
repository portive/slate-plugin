# Uploading Files

Earlier, we added `editor.portive.handlePaste` and `editor.portive.handleDrop` to the `Editable` component which starts the upload process when a user drops or pastes an images into the Editor.

Often, we also want the user to be able to use a system file picker to select the files they want to upload.

Developers may also wish to have lower level access to precisely control specific [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) objects they want to upload.

## Upload from `<input type=file />`

To upload from an `<input type="file" />` element, add the `editor.portive.onInputFileChangeHandler` to `onChange`.

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
          onPaste={editor.portive.handlePaste}
          onDrop={editor.portive.handleDrop}
        />
      </Slate>
    </>
  )
}
```

## Upload using `File` object

To upload specific files, use the `editor.portive.uploadFile` method.

In this example, we only allow upload of `pdf` files.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  // ✅ This callback goes through each file and uploads `application/pdf` files
  const uploadPdfs = useCallback(
    (e) => {
      const files = e.target.files
      if (files == null || files.length === 0) return
      for (const file of files) {
        if (file.type === "application/pdf" && file.name.endsWith(".pdf")) {
          editor.portive.uploadFile(file)
        }
      }
      return true
    },
    [editor]
  )

  return (
    <>
      {/* ✅ Upload on change. `multiple` enables multi-file uploads */}
      <input type="file" onChange={uploadPdfs} multiple />
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

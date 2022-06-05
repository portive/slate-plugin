# Uploading Files

In [Getting Started](./01-getting-started.md), we added support for uploading by pasting files into or dropping files on the editor.

Sometimes, we want the user to be able to use a system file picker to select the files they want to upload. This might be by clicking an upload file icon to open the file picker.

Developers may also wish to have lower level access to upload specific [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) objects. They might use this to pick specific files to upload or upload files from a Component that generates them (maybe a Component that generates a graph for example).

## Upload from `<input type=file />`

To upload from an `<input type="file" />` element, add the `editor.portive.onInputFileChangeHandler` to the `onChange` attribute.

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

In this example, we check if a file is a `pdf` and only allow upload of those `pdf` files.

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
      {/* ✅ use the `uploadPdfs` callback with individual `uploadFile` */}
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

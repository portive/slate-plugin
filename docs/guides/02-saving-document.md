# Saving the Document

Now that you've got a working Editor that supports images and attachments, let's move on to saving documents. There are special considerations for saving documents with files which may not be obvious.

FIrst, learn about saving documents in Slate in general by reading the [Slate Documentation on Saving to a Database](https://docs.slatejs.org/walkthroughs/06-saving-to-a-database) if you aren't already familiar.

The special consideration is that files might still be uploading when the user clicks the Save button. Consider sending email through a web app (like Google Mail) with attachments. When you click Save, if there are unfinished uploads, the app will wait for the files to finish uploading.

With `slate-portive` there are two main ways to handle in progress uploads:

1. Wait for the files to finish uploading with `editor.portive.save`
2. Get a normalized version of the document with unfinished uploads removed using `editor.portive.normalize`

> 🌞 If you do not use one of the methods above and just save the document value as you would normally, then after you open the document again, the uploads will have an `error` status.

## Using `editor.portive.save`

This is the recommended way to save your document. Call `await editor.portive.save` which returns an object with the document value. It waits until all the uploads complete before returning.

The method takes an optional `{ maxTimeoutInMs: number }` option. If the files aren't uploaded by the timeout, a normalized document value will be return with the unfinished Elements removed from the `value`. Note that this returns a normalized document but won't actually remove the Elements from the Editor and the uploads will continue uploading after `save` is called.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  const save = useCallback(async () => {
    const result = await editor.portive.save({ maxTimeoutInMs: 10000 })
    console.log(result.value) // output
  }, [editor])

  return (
    <>
      <button onClick={save}>Save</button>
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

> 🌞 NOTE: Two more `SaveOptions` are on the Roadmap. The first is an `activityTimeoutInMs` where the timeout expires when there is no progress activity for the given number of milliseconds. This might happen if there is a loss of Internet connectivity. The second is an `onProgress` callback which you can use to update a progress bar letting the user know the state of the remaining uploads in the document. There will likely be a Preset Component for displaying the progress bar.

> 🌞 SUGGESTION: Although not shown in this sample code, we recommend setting the `readOnly` property to `true` during save. This prevents the user from making edits or even uploading new files while waiting for the existing files to upload.

## using `editor.portive.normalize`

This is a good way to get a draft of the document for saving.

The `normalize` method returns a document value immediately but it removes any elements that are either `uploading` or have an upload `error`.

This might be used in a scenario where you want a snapshot of the document **right now** and you can't wait. It will get the best version of the document it can excluding the unfinished uploads.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  const saveDraft = useCallback(() => {
    const result = await editor.portive.normalize()
    console.log(result.value) // output
  }, [editor])

  return (
    <>
      <button onClick={saveDraft}>Save Draft</button>
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

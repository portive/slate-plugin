# Saving the Document

Now that you've got a working Editor that supports images and attachments, you may be wondering how to save the document when files are still uploading in the document.

You can learn about how to save documents in Slate generally by reading the [Slate Documentation on Saving to a Database](https://docs.slatejs.org/walkthroughs/06-saving-to-a-database).

With `slate-portive` there are two main ways to handle in progress uploads:

1. Wait for the files to finish uploading with `editor.portive.save`
2. Get a normalized version of the document with unfinished uploads removed using `editor.portive.normalize`

> 🌞 If you do not use one of the methods above and save the document value, after you reload the document, the incomplete uploads will have an `error` status. It's not the end of the world as it won't crash the Editor and those images and attachments can be deleted, but it creates a confusing user experience.

## Using `editor.portive.save`

This is the best way to save your document. Call `await editor.portive.save` which will return an object that contains the document value after waiting for all the uploads to complete.

The method takes an optional `{ timeout: number }` option. If the files aren't uploaded by then, a normalized document value will be return with the unfinished Elements removed from the `value`. Note that this does not actually remove the Elements from the document and the uploads will continue uploading after `save` is called.

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

> 🌞 NOTE: Two more `save` options are on the Roadmap. The first is an `activityTimeoutInMs` where the timeout happens if there is no progress activity for the given number of milliseconds. The second is an `onProgress` callback which you can use to update a progress bar letting the user know the state of the remaining uploads in the document. There will likely be a Preset Component for displaying the progress bar.

## using `editor.portive.normalize`

This is the best way to get a draft of the document for saving.

The `normalize` method returns a document value immediately but it removes any elements that are either `uploading` or have an upload `error`.

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

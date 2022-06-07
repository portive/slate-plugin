# Saving the Document

Now that you've got a working Editor that supports images and attachments, let's move on to saving a document that contains images and attachments which may be in progress uploading.

If you don't know how to save documents in Slate in general, first read the [Slate Documentation on Saving to a Database](https://docs.slatejs.org/walkthroughs/06-saving-to-a-database).

With `slate-portive` there are two main ways to handle saves:

1. Wait for all files to finish uploading by using `editor.portive.save`
2. Get a normalized version of the document with in progress uploads removed using `editor.portive.normalize`

> 🌞 If you do not use one of the methods above and just save the document value as you would normally, then after you open the document again, the uploads will be in an `error` status.

## Using `editor.portive.save`

This is the recommended way to save a document. Call `await editor.portive.save` which returns an object with the document value. It waits until all uploads complete before returning.

The method takes an optional `{ maxTimeoutInMs: number }` option. If the files aren't uploaded by the timeout, a normalized document value will be return with the unfinished Elements removed from the `value`.

> 🌞 Note that when a normalized document is returned, it won't remove the Elements from the Editor. Any uploads will continue uploading after `save` is called.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  const save = useCallback(async () => {
    const result = await editor.portive.save({ maxTimeoutInMs: 10000 })
    console.log(result.value) // document value
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

> 🌞 NOTE: Two more `SaveOptions` are on the Roadmap. The first is an `activityTimeoutInMs` where the timeout expires when there is no progress activity for the given number of milliseconds. This might be a more useful option as it will timeout if there is a loss of Internet connectivity but won't timeout just because a large file is being uploaded. The second is an `onProgress` callback which can be used to update a progress bar letting the user know the state of the remaining uploads in the document.

> 🌞 SUGGESTION: Although not shown in this sample code, we recommend setting the `readOnly` property to `true` during save. This prevents the user from making edits or uploading new files while waiting for save to complete.

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

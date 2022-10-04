# Saving the Document

Now that you've got a working Editor that supports images and attachments, let's move on to saving a document.

What I want you to remember about Slate Cloud is that the document may contain images and file attachments which haven't finished uploading. We need to make sure that the files have finished uploading before saving the Document.

But first, if you don't know how to save documents in Slate in general, read the [Slate Documentation on Saving to a Database](https://docs.slatejs.org/walkthroughs/06-saving-to-a-database).

With `slate-cloud` there are two main ways to save a document:

1. **Wait then save:** Wait for all files to finish uploading by using `editor.cloud.save`
2. **Save a draft:** Get a version of the document with just the unfinished uploads removed using `editor.cloud.normalize`

> 🌞 If you do not use one of these two methods and just save the Slate's document `value`, then after you open the document again, the images and attachments will be invalid.

## Using `editor.cloud.save`

This is the recommended way to save a document. Call `await editor.cloud.save` which returns an object that contains the document `value`.

The method takes an optional `{ maxTimeoutInMs: number }` option. If the files aren't finished uploading by the timeout, a normalized document value will be return with the unfinished Elements removed.

Even though some incomplete elements are remove, the document value is in a valid state.

> 🌞 Note that when a normalized document is returned, it won't remove the Elements from the Editor. Any uploads will continue uploading after `save` is called.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  const save = useCallback(async () => {
    const result = await editor.cloud.save({ maxTimeoutInMs: 10000 })
    console.log(result.value) // document value
  }, [editor])

  return (
    <>
      <button onClick={save}>Save</button>
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

We also recommend putting the editor into `readOnly` mode so the user can't editing while a save is in progress.

## using `editor.portive.normalize`

This is a good way to get a draft of the document for saving.

The `normalize` method returns a document value immediately but it removes any elements that haven't finished uploading.

This might be used in a scenario where you want a snapshot of the document **right now** and you can't wait. This can be useful, for example, if you want to save a draft of the document.

```tsx
const App = () => {
  /**
   * editor = ...
   */

  const saveDraft = useCallback(() => {
    const result = await editor.cloud.normalize()
    console.log(result.value) // output
  }, [editor])

  return (
    <>
      <button onClick={saveDraft}>Save Draft</button>
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

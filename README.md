# SlateImagePlugin Integration

These are the steps to integrating the Slate Image Plugin into your editor.

- Add the `handlePasteFile` and `handleDropFile` handlers to the `<Editable>` component for `onPaste` and `onDrop`.
- Call `withPortive(editor)` on an instance of the Slate editor.

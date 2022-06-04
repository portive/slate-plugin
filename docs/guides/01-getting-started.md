# Getting Started

## Installing Slate Images And File Attachments

To install `slate-portive` with Yarn or NPM, either:

```bash
yarn add slate-portive
npm install --save slate-portive
```

## Getting Started Integration

These are the steps for a minimal integration:

- Add `usePortiveEditor(editor)`
- Put `editor.portive.handleDrop` and `editor.portive.handlePaste` on `Editable`
- Add render Components to `renderElement` on `Editable`
- Customize `isVoid` and `isBlock` to recognize the render elements.

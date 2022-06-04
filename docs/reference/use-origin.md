# useOrigin

The `useOrigin` hook takes an `Element` with an `originKey` property and returns an `Origin` object.

For example:

```tsx
function SimpleAttachment({
  attributes,
  element,
  children,
}: RenderElementProps) {
  const origin = useOrigin(element)
  return (
    <div {...attributes}>
      <div>
        <a href={origin.url}>Link to File</a>
      </div>
      <div>Upload Status: {origin.status}</div>
      {children}
    </div>
  )
}
```

### `useOrigin: (element: { originKey: string }) => Origin`

When called during the render of an `Element`, returns an `Origin` object.

> TODO: This should take an `originKey: string` argument now that we don't rely on any other properties of the `Element`

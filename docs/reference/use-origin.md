# useOrigin

The `useOrigin` hook takes an `Element` with an `originKey` property and returns an `Origin` object.

For example:

```tsx
function SimpleAttachment({
  attributes,
  element,
  children,
}: RenderElementProps) {
  const origin = useOrigin(element.originKey)
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

### `useOrigin: (originKey: string) => Origin`

When called during the render of an `Element` with an [`originKey`](./origin.md) returns an `Origin` object.

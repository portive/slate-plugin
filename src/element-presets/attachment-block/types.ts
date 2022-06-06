export type AttachmentBlockElement = {
  type: "attachment-block"
  originKey: string
  filename: string
  bytes: number
  children: [{ text: "" }]
}

# Slate Plugin for Hosted Resizable Images and Hosted File Attachments

This Slate plugin adds support for beautiful and slick uploads of images and attachments to Slate.

The plugin works with Portive, a hosted back-end service for rich editors. Portive is the official hosted back-end for:

- Plate: Rich text editor plugin system for Slate &amp; React
- Wysimark: The Rich Editor for Markdown based on Slate

Features of Uploaded Images

- Images can be resized by dragging a resize bar
- Images are resized on the server for faster downloads and reduced bandwidth
- Uses HTML `srcSet` to deliver higher resolution images to displays with higher DPI (e.g. high resolution images will be delivered at 2x the resolution if possible)
- Shows the width/height while dragging for precise resizing
- While images are uploading, a live progress bar is shown
- The progress bar is not part of Slate's edit history which means undo won't undo progress bar movement
- Uses a CDN for fast performance
- Specify default max width/height for initial view (e.g. you can default to a preview with a width of 320px or go full width)
- Images are just a Slate Element that you define. Just add the `<HostedImage>` component inside it where you want the image to be shown. Because it's just a Slate element you can do all the following:

  - You can choose to display image as block or inline image.
  - You can choose to make it a void blocks (no editable inner content) or support editable content like an editable caption.
  - You have full control over how it displays (e.g. rounded edges, drop shadows, outlines)

- Coming Soon:
  - Image presets. Specify preset sizes for thumbnail, preview and full if you desire
  - Image imports. When a user pastes the URL of an image, it automatically uploads the image to the editor.
  - Sharpening. Enable additional image processing like sharpening for low DPI displays. Sharpening is probably not required for high DPI displays.

Features of Attachments

- Progress bar while uploading
- Fully customizable to display aspects like size of file, original filename and who uploaded the attachment.

General Features

- Has a special `save` method that returns a Promise to ensure that all the images and attachments have finished uploading
- Uses an API key so that you can choose who can upload

- Coming Soon:
  - Tag file uploads, for example with a userId or a projectId
  - Limit file uploads based on tags and customize message when a limit is exceeded. For example, user `johndoe` can upload up to 1 GB and then he is shown a message and given a link to the upgrade page.

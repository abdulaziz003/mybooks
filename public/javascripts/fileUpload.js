// link all the plugins to the library filePond
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
);
// Setting options
FilePond.setOptions({
  // Setting the style of the cover input to fitt
  stylePanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150
})

// applying the library FilePond on our page
FilePond.parse(document.body);
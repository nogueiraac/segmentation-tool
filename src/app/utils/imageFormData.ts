export function imageFormData(image: File) {
  console.log('teste 3', image);
  var oMyBlob = new Blob([image], { type: "image/jpeg" });

  return oMyBlob;
}
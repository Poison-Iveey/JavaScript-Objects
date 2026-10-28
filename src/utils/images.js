// Downscale an image file to at most `maxWidth` px wide, as JPEG. Resolves to
// { dataUrl, file }: the data URL for instant preview, the File for upload.
export function shrinkImage(file, maxWidth = 420) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn't read that image."));
      img.onload = () => {
        const w = Math.min(maxWidth, img.width);
        const h = Math.round((img.height * w) / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        canvas.toBlob(
          (blob) => {
            const name = (file.name || "image").replace(/\.[^.]+$/, "") + ".jpg";
            resolve({ dataUrl, file: new File([blob], name, { type: "image/jpeg" }) });
          },
          "image/jpeg",
          0.85
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

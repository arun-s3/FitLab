
export const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = crop.width;
    canvas.height = crop.height;
  
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    })
  }
  
  export const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => resolve(image)
      image.onerror = (error) => reject(error)
      image.src = url
    })
  
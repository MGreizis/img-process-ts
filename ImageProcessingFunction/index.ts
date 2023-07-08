import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { createCanvas, loadImage } from "canvas";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const imageUri: string = req.query.imageUri || "";
  if (!imageUri) {
    context.res = {
      status: 400,
      body: "Missing imageUri query parameter",
    };
    return;
  }
  const grayscaleImage = await convertToGrayscale(imageUri);
  context.res = {
    body: grayscaleImage,
    headers: {
      "Content-Type": "image/png",
    },
  };
};

async function convertToGrayscale(imageUri: string): Promise<Buffer> {
    try {
        const image = await loadImage(imageUri);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const [r, g, b] = data.slice(i, i + 3);
            const grayValue = Math.round(0.2989 * r + 0.587 * g + 0.114 * b);
            data[i] = grayValue;
            data[i + 1] = grayValue;
            data[i + 2] = grayValue;
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas.toBuffer();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default httpTrigger;

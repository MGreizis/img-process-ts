import { AzureFunction, Context } from "@azure/functions";

const blobTrigger: AzureFunction = async function (
  context: Context,
  myBlob: any
): Promise<void> {
  context.log(`Blob name: ${context.bindingData.name}`);
  context.log(`Blob size: ${myBlob.length} bytes`);
  // Perform desired image processing tasks on the blob
  // Call the ImageProcessingFunction using the HTTP trigger

  const imageUri = `https://processingblob.blob.core.windows.net/input-images/${context.bindingData.name}`;
  const response = await fetch(
    `https://img-processing-ts.azurewebsites.net/api/ImageProcessingFunction?imageUri=${encodeURIComponent(imageUri)}`
  );
  const buffer = await response.arrayBuffer();
  const image = Buffer.from(buffer);
  context.bindings.outputBlob = image;
};

export default blobTrigger;

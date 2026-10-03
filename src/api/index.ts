import { type } from "arktype";

const PresignedURL = type({
  fileName: "string",
  url: "string",
});

const MixesUploadResponse = type({
  urls: PresignedURL.array(),
});

export const requestPresignedURLs = async (
  accessToken: string,
  fileNames: string[]
) => {
  if (!accessToken || !fileNames || !fileNames.length)
    throw new Error("Incorrect input provided to the presigned URL request!");

  const rawResponse = await fetch(
    `${process.env.PUBLIC_API_GATEWAY_BASE_URL}/mixes/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        files: fileNames,
      }),
    }
  );
  const presignedResponse = MixesUploadResponse(await rawResponse.json());
  if (presignedResponse instanceof type.errors)
    throw new Error(presignedResponse.summary);

  return presignedResponse;
};

export const putWithProgress = (presignedURL: string, file: File) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedURL);

    xhr.upload.onprogress = (event) =>
      console.log(
        "For " +
          file.name +
          " the upload progress is " +
          (event.loaded / event.total) * 100 +
          "%"
      );

    xhr.onload = () =>
      xhr.status < 300 ? resolve() : reject(new Error("S3 said " + xhr.status));
    xhr.onerror = () =>
      reject(new Error("A network error has prevented the upload"));

    xhr.send(file);
  });
};

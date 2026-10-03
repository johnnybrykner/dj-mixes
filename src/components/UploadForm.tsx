import { useAuth } from "react-oidc-context";
import formStyles from "../styles/UploadForm.module.css";
import { useEffect, useState } from "react";
import { requestPresignedURLs, putWithProgress } from "../api";

const UploadForm = () => {
  const auth = useAuth();
  const [chosenMediaFiles, setChosenMediaFiles] = useState<File[] | null>(null);
  const [chosenFileNames, setChosenFileNames] = useState<string[] | null>(null);

  useEffect(() => {
    if (!chosenMediaFiles) {
      setChosenFileNames(null);
      return;
    }
    setChosenFileNames([...chosenMediaFiles.map((file) => file.name)]);
  }, [chosenMediaFiles]);

  const handleFileUpload = async () => {
    if (!chosenFileNames || !chosenMediaFiles || !auth.user) return;
    const presignedResponse = await requestPresignedURLs(
      auth.user.access_token,
      chosenFileNames
    );
    presignedResponse.urls.forEach(async (presignedURL) => {
      const fileToUpload = chosenMediaFiles.find(
        (file) => file.name == presignedURL.fileName
      );
      if (!fileToUpload) return;
      await putWithProgress(presignedURL.url, fileToUpload);
    });
  };

  return (
    <>
      {auth.user && (
        <aside className={formStyles.upload}>
          <label htmlFor="fileUpload">Choose files to upload</label>
          <input
            type="file"
            name="fileUpload"
            accept="audio/*, .cue"
            multiple={true}
            onChange={(event) =>
              setChosenMediaFiles(
                event.target.files ? [...event.target.files] : null
              )
            }
          />
          <button onClick={() => handleFileUpload()}>Upload to S3</button>
        </aside>
      )}
    </>
  );
};

export default UploadForm;

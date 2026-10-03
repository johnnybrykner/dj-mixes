import { useAuth } from "react-oidc-context";
import formStyles from "../styles/UploadForm.module.css";
import { useState } from "react";

type PresignedURL = {
  fileName: string;
  url: string;
};

const UploadForm = () => {
  const auth = useAuth();
  const [selectedAudioFiles, setSelectedAudioFiles] = useState<File[]>([]);
  const [selectedCueFiles, setSelectedCueFiles] = useState<File[]>([]);
  const [presignedURLs, setPresignedURLs] = useState<PresignedURL[]>([]);

  const requestPresignedURLs = async () => {
    if (!auth.user) return;
    const audioFileNames = selectedAudioFiles.map((file) => file.name);
    const cueFileNames = selectedCueFiles.map((file) => file.name);
    const rawResponse = await fetch(
      `${process.env.PUBLIC_API_GATEWAY_BASE_URL}/mixes/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.user.access_token}`,
        },
        body: JSON.stringify({
          files: audioFileNames.concat(cueFileNames),
        }),
      }
    );
    const presignedResponse = await rawResponse.json();
    if (!presignedResponse || !presignedResponse.urls)
      throw new Error("URL pre-signing failed!");
    if (presignedResponse.urls) setPresignedURLs(presignedResponse.urls);
    console.log(presignedURLs);
    // presignedResponse.urls.forEach(presignedURL => {

    // })
  };

  return (
    <>
      {auth.user && (
        <aside className={formStyles.upload}>
          <div>
            <label htmlFor="audio">Audio file</label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              multiple={false}
              onChange={(event) =>
                event.target.files?.length &&
                setSelectedAudioFiles([...event.target.files])
              }
            />
          </div>
          <div>
            <label htmlFor="cue">Cue file</label>
            <input
              type="file"
              name="cue"
              accept=".cue"
              multiple={false}
              onChange={(event) =>
                event.target.files?.length &&
                setSelectedCueFiles([...event.target.files])
              }
            />
          </div>
          <button onClick={() => requestPresignedURLs()}>
            Get presigned URL&apos;s
          </button>
        </aside>
      )}
    </>
  );
};

export default UploadForm;

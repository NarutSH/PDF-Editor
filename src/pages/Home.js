import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { dsmApi } from "../api/dsmApi";
import { useToasts } from "react-toast-notifications";
import SpinnerTool from "../tool/Spinner/SpinnerTool";

const Home = () => {
  const { addToast } = useToasts();
  const viewer = useRef(null);
  const [rawFile, setRawFile] = useState(null);
  const [resInstance, setResInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filesUpload, setFilesUpload] = useState([]);

  useEffect(() => {
    console.log("useEff");
    WebViewer(
      {
        path: "/webviewer/lib",
        enableFilePicker: true,
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      setResInstance(instance);

      annotationManager.addEventListener("annotationChanged", async () => {
        const doc = documentViewer.getDocument();
        const xfdfString = await annotationManager.exportAnnotations();
        const options = { xfdfString };
        const data = await doc.getFileData(options);

        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: "application/pdf" });

        const file = new File([blob], doc.filename, {
          type: "application/pdf",
        });

        // const objectURL = URL.createObjectURL(blob);

        setRawFile(file);
      });
    });
  }, [filesUpload]);

  const onHandleUpload = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append(
      "token",
      "O@OkFXd9obuPxq:-t68s7jxUKMGUw2INW9mxcAzOKpGIEc5Z"
    );
    formData.append("file", rawFile);

    await dsmApi
      .post("", formData)
      .then((res) => {
        console.log(res);
        addToast(res.data.msg || "Saved Successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        resInstance.dispose();
        setRawFile(null);
        if (res.data.data.filename) {
          setFilesUpload((filesUpload) => [
            ...filesUpload,
            res.data.data.filename,
          ]);
        }
      })
      .catch((err) => {
        addToast("something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      {isLoading && <SpinnerTool />}

      <div className="App">
        <div className="webviewer" ref={viewer}></div>
      </div>
      <div className="text-center">
        <button
          disabled={rawFile ? false : true}
          className="btn btn-outline-primary "
          onClick={onHandleUpload}
        >
          Upload to Server
        </button>
      </div>
    </div>
  );
};

export default Home;

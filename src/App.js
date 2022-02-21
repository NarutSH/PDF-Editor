import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import { useToasts } from "react-toast-notifications";
import { dsmApi } from "./api/dsmApi";
import PainterroEl from "./Element/PainterroEl";
import SpinnerTool from "./tool/Spinner/SpinnerTool";
import PDFPages from "./Element/PDFPages";
import PDFRender from "./Element/PDFRender";
import { PDFViewer, BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";

const App = () => {
  const { addToast } = useToasts();
  const [rawFile, setRawFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filesUpload, setFilesUpload] = useState([]);
  const [pagesSelected, setPageSelected] = useState();
  const [base64, setBase64] = useState([]);

  const onHandleUpload = async (blobFile) => {
    console.log({ blobFile });
    setIsLoading(true);

    const file = new File([blobFile], "undefine.pdf", {
      type: "application/pdf",
    });

    const formData = new FormData();

    formData.append(
      "token",
      "O@OkFXd9obuPxq:-t68s7jxUKMGUw2INW9mxcAzOKpGIEc5Z"
    );
    formData.append("file", file);

    await dsmApi
      .post("", formData)
      .then((res) => {
        console.log(res);
        addToast(res.data.msg || "Saved Successfully", {
          appearance: "success",
          autoDismiss: true,
        });

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
    <div className="container py-3">
      {isLoading && <SpinnerTool />}

      <PainterroEl
        pagesSelected={pagesSelected}
        setPageSelected={setPageSelected}
        base64={base64}
        setBase64={setBase64}
      />

      {base64.length ? (
        <PDFPages
          pages={base64}
          setPageSelected={setPageSelected}
          pagesSelected={pagesSelected}
        />
      ) : (
        ""
      )}

      {/* <PDFViewer>
        <PDFRender base64={base64} />
      </PDFViewer> */}

      <PDFDownloadLink
        document={<PDFRender base64={base64} />}
        fileName={base64[0]?.mainFileName}
      >
        {({ blob }) => {
          return (
            <div className="text-center my-2">
              <button
                className="btn btn-outline-primary "
                disabled={base64.length ? false : true}
              >
                Download PDF
              </button>
            </div>
          );
        }}
      </PDFDownloadLink>

      <BlobProvider document={<PDFRender base64={base64} />}>
        {({ blob }) => {
          return (
            <div className="text-center  my-2">
              <button
                className="btn btn-outline-primary "
                disabled={base64.length ? false : true}
                onClick={() => onHandleUpload(blob)}
              >
                Upload to Server
              </button>
            </div>
          );
        }}
      </BlobProvider>
    </div>
  );
};

export default App;

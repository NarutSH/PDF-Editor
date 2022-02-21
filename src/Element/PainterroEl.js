import React, { useEffect, useState } from "react";
import Painterro from "painterro";
import PDFPages from "./PDFPages";

const PainterroEl = ({ pagesSelected, setPageSelected, base64, setBase64 }) => {
  var PDFJS = window["pdfjs-dist/build/pdf"];
  PDFJS.GlobalWorkerOptions.workerSrc =
    "//mozilla.github.io/pdf.js/build/pdf.worker.js";

  const ptr = Painterro({
    toolbarHeightPx: 54,
    buttonSizePx: 42,
    defaultTool: "brush",
    hiddenTools: "open",
    saveHandler: (image) => {
      const updatedData = base64.map((item) =>
        item.pId === pagesSelected.pId
          ? { pId: pagesSelected.pId, data64: image.asDataURL() }
          : item
      );
      ptr.hide();
      setBase64(updatedData);
      setPageSelected();
    },
    onClose: () => {
      setPageSelected();
    },
  });

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const pdfToImage = async (ev) => {
    setBase64([]);
    const file = ev.target.files[0];

    const res = await readFileData(file);

    const loadingTask = PDFJS.getDocument(res);

    await loadingTask.promise.then(
      (pdf) => {
        const canvasdiv = document.getElementById("canvas");
        const totalPages = pdf.numPages;

        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          pdf.getPage(pageNumber).then(function (page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement("canvas");
            canvasdiv.appendChild(canvas);

            // Prepare canvas using PDF page dimensions

            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            const renderTask = page.render(renderContext);

            renderTask.promise.then(function () {
              const list = {
                mainFileName: file.name,
                pId: pageNumber,
                data64: canvas.toDataURL("image/png"),
              };

              setBase64((base64) => [...base64, list]);
            });
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };

  // const onHandleUpload = async (ev) => {
  //   setBase64([]);
  //   const file = ev.target.files[0];
  //   const res = await readFileData(file);
  //   pdfToImage(res);
  // };

  useEffect(() => {
    if (pagesSelected) {
      ptr.show(pagesSelected.data64);
    } else {
      ptr.hide();
    }
  }, [pagesSelected]);

  return (
    <div>
      <input type="file" onChange={pdfToImage} className="form-control" />

      <div id="canvas" className="d-none"></div>
    </div>
  );
};

export default PainterroEl;

import React, { useRef, useEffect } from "react";

const PDFPages = ({ pages, setPageSelected, pagesSelected }) => {
  const imgStyle = (page) => {
    return {
      width: "100px",
      height: "150px",
      objectFit: "contain",
      margin: "10px",
      cursor: "pointer",
      border:
        pagesSelected && page.pId === pagesSelected.pId ? "2px solid blue" : "",
    };
  };

  const onHandleClick = (page) => {
    setPageSelected(page);
  };

  return (
    <div className="d-flex flex-nowrap " style={{ overflowX: "scroll" }}>
      {pages.length
        ? pages.map((page) => {
            return (
              <img
                src={page.data64}
                style={imgStyle(page)}
                onClick={() => onHandleClick(page)}
                className="shadow"
              />
            );
          })
        : ""}
    </div>
  );
};

export default PDFPages;

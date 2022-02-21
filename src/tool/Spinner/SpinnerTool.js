import React from "react";
import "./SpinnerTool.css";

const SpinnerTool = () => {
  return (
    <div className="overlay-css">
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube" />
          <div className="sk-cube2 sk-cube" />
          <div className="sk-cube4 sk-cube" />
          <div className="sk-cube3 sk-cube" />
        </div>
      </div>
    </div>
  );
};

export default SpinnerTool;

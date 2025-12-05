"use client";

import { useState } from "react";
import Register from "./register";
import Login from "./login";

const ModalAuth = ({ currentPath }: { currentPath: string }) => {
  const [state, setState] = useState(false);

  return (
    <>
      {currentPath === "auth" && (
        <div className="overlay">
          {!state ? (
            <Register setState={setState} />
          ) : (
            <Login setState={setState} />
          )}
        </div>
      )}
    </>
  );
};

export default ModalAuth;

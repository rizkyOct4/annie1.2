"use client";

import Register from "../Register";
import Login from "../Login";
import { useState } from "react";

const AuthPage = () => {
  const [state, setState] = useState(false);
  return (
    <div className="flex-center">
      {!state ? (
        <Register setState={setState} />
      ) : (
        <Login setState={setState} />
      )}
    </div>
  );
};

export default AuthPage;

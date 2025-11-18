"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const RegisterAndLoginPage = () => {
  const [state, setState] = useState(false);
  const path = usePathname().replace("/", "");

  return (
    <>
      {path === "auth" && (
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

export default RegisterAndLoginPage;

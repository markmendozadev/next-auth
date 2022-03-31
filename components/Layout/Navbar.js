import React from "react";
import { signOut, useSession } from "next-auth/react";
const Navbar = () => {
  const { data, status } = useSession();
  return (
    <>
      {status === "authenticated" && (
        <button
          type="button"
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          Sign Out
        </button>
      )}
    </>
  );
};

export default Navbar;

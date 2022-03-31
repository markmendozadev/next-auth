import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
const AuthForm = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toggleHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordhandler = (e) => {
    setPassword(e.target.value);
  };
  const signInHandler = async (id) => {
    const res = await signIn(id, { redirect: false });
    console.log(res);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        if (result.ok) {
          router.replace("/home");
        }
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
      }
    } catch (error) {}
  };
  return (
    <div>
      <h2>{isLogin ? "Login " : "SignUp"}</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required onChange={emailHandler} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            onChange={passwordhandler}
          />
        </div>
        <button>Submit</button>
      </form>
      <button onClick={signInHandler.bind(null, "github")}>
        SignIn With GitHub
      </button>
      <button onClick={signInHandler.bind(null, "facebook")}>
        SignIn With facebook
      </button>
      <button onClick={toggleHandler} type="button">
        {isLogin ? "Create An Account?" : "Already have an account?"}
      </button>
    </div>
  );
};

export default AuthForm;

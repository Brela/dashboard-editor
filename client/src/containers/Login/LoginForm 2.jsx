import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { createUser, loginUser } from "../../services/userAPIcalls";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faSignIn,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { InventoryContext } from "../../contexts/inventory.context";

export default function LoginForm() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [userAddedPrompt, setUserAddedPrompt] = useState("");
  const [userLoginErrorPrompt, setUserLoginErrorPrompt] = useState("");
  const [userAddedErrorPrompt, setUserAddedErrorPrompt] = useState("");
  const { reloadInventory } = useContext(InventoryContext);

  // google oath -------

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID Token:  ", response);
  };
  /* useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "785322521849-am635dvee0bhsm2jqcl7c0h0cip0rum6.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("g_signin_button"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
      },
    );
  }, []); */
  // ------------------

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      if (login) {
        const userData = await loginUser(
          data.get("username"),
          data.get("password"),
        );

        if (userData.user) {
          toast.success("Welcome Back 👋");
          setIsLoggedIn(true);
          // reloadInventory();
          navigate("/copilot/");
        } else {
          setUserLoginErrorPrompt(userData.message);
          toast.error(userData.message);
          setLoading(false);
          setPrompt(true);
        }
      } else {
        const userData = await createUser(
          data.get("username"),
          data.get("password"),
        );

        if (userData.username) {
          const loginData = await loginUser(
            data.get("username"),
            data.get("password"),
          );

          if (loginData.user) {
            toast.success("Signed up and logged in successfully!");
            setIsLoggedIn(true);
          } else {
            setUserLoginErrorPrompt(loginData.message);
            toast.error(loginData.message);
          }
        } else {
          setUserAddedErrorPrompt(userData.message);
          toast.error(userData.message);
        }
        setLoading(false);
        setPrompt(true);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setLoading(false);
      setPrompt(true);
    }
  };

  const goBack = async () => {
    setLoading(true);
    setUserAddedPrompt("");
    setUserAddedErrorPrompt(false);
    setUserLoginErrorPrompt(false);
    setPrompt(false);
    setLoading(false);
    setLogin(true);
  };

  return (
    <div className="bg-zinc-100 p-6 py-12 text-zinc-800  flex flex-col gap-4 rounded-3xl ">
      {/* <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tighter ">Orderly</h1>
        <h3 className="text-xl font-light">
          Inventory Tracking and Automation
        </h3>
      </div> */}
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        {prompt ? (
          <>
            {userAddedPrompt && (
              <div className="prompt">
                <p style={{ textAlign: "center" }}>
                  Thank you {userAddedPrompt} for signing up! Please sign in.
                </p>
                <button
                  className="btn"
                  id="go-back-button"
                  onClick={() => {
                    goBack();
                  }}
                >
                  OK
                </button>
              </div>
            )}
            {userLoginErrorPrompt && (
              <div className="">
                <p>{userLoginErrorPrompt}</p>
                <button
                  className="btn"
                  id="go-back-button"
                  onClick={() => {
                    goBack();
                  }}
                >
                  OK
                </button>
              </div>
            )}
            {userAddedErrorPrompt && (
              <div className="">
                <p>{userAddedErrorPrompt}</p>
                <button
                  className="btn"
                  id="go-back-button"
                  onClick={() => {
                    goBack();
                  }}
                >
                  OK
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center w-full h-[250px]">
                <div className="w-10 h-10 border-t-4 border-cyan-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <p className="px-2 font-bold justify-center flex text-zinc-700">
                  {login ? "Welcome" : "Get Started"}
                </p>
                <input
                  className="bg-zinc-50 border border-zinc-300 rounded-lg h-12 px-4 text-zinc-800 text-lg outline-cyan-800/70"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  autoFocus
                />
                <input
                  className="bg-zinc-50 border border-zinc-300 rounded-lg h-12 px-4 text-zinc-800 text-lg outline-cyan-800/70"
                  type={login ? "password" : "text"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  className="bg-cyan-700/70 hover:bg-cyan-700/90 rounded-lg h-10 font-bold text-white"
                  type="submit"
                  id="submit-button"
                >
                  {login ? (
                    <>
                      <FontAwesomeIcon icon={faSignIn} />
                      <span className="ml-2">Sign in</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} />
                      <span className="ml-2">Sign up</span>
                    </>
                  )}
                </button>
                <div className="flex justify-center">
                  <p
                    className="hover:cursor-pointer text-sm"
                    onClick={() => {
                      setLogin(!login);
                    }}
                  >
                    {login
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign In"}
                  </p>
                </div>
              </>
            )}
            {/* <span className="font-bold mx-auto"> - or - </span>
            <section className="flex justify-center">
              <div id="g_signin_button"></div>
            </section> */}
          </>
        )}
      </form>
    </div>
  );
}

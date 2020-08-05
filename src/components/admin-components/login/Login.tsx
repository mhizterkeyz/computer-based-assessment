import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import assesment_SVG from "../../../svg/undraw_exams_g4ow 1.svg";
import Header from "../../Header";
import { SignInAdmin } from "../../../redux/actions/AdministratorActions";
import { toast } from "react-toastify";

const Login = (props: any) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    invalid: false,
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (props.location.pathname !== "/admin") {
      props.history.push("/admin");
    }
  }, [props.location.pathname, props.history]);

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    try {
      setBusy(true);
      await props.SignInAdmin(inputs);
    } catch (error) {
      if (error.name === "Unauthorized") {
        toast.error(`Invalid Username or password`, { position: "top-center" });
        setBusy(false);
        return setInputs({ ...inputs, password: "", invalid: true });
      }
      
      if (error.status === 451) {
        props.history.push("/developer");
        return;
      }

      toast.error(`Network error: ${error.message}`, {
        position: "top-center",
      });
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <section className=" row m-auto  align-items-center login">
        <div className="col-6 text-center">
          <img src={assesment_SVG} alt="assesment" />
        </div>

        <div className="col-6">
          <form className="d-flex flex-column col-8" onSubmit={handleSubmit}>
            <h3>Admin Login</h3>
            <label htmlFor="matric-no" className="mt-4">
              {" "}
              Username / Email
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username or Email"
              value={inputs.username}
              onChange={handleInputs}
            />
            <label htmlFor="password" className="mt-4">
              {" "}
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={inputs.password}
              onChange={handleInputs}
            />

            <input
              type="submit"
              disabled={busy}
              value="Login"
              className="btn"
            />
          </form>
        </div>
      </section>
    </>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  SignInAdmin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

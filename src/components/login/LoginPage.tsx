import React, { useState } from "react";
import "./LoginPage.scss";
import assesment_SVG from "../../svg/undraw_exams_g4ow 1.svg";
import { login } from "../../api/calls";
// import Header from '../Header';
// import Footer from '../Footer';

const LoginPage = (props: any) => {
  const [inputs, setInputs] = useState({
    "matric-no": "",
    password: "",
    invalid: false,
  });
  const [busy, setBusy] = useState(false);

  const handleInputs = (ev: any) => {
    const { name, value } = ev.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handleSubmit = async (ev: any) => {
    ev.preventDefault();
    if (busy) return;
    try {
      setBusy(true);
      setInputs({ ...inputs, invalid: false });
      const user = await login(inputs);
      console.log(user);
      if (!user.status) {
        setInputs({ ...inputs, invalid: true, password: "" });
      }
      if (user) setBusy(false);
      props.handleLogin(user);
    } catch (e) {
      //TODO: Error handling
      console.log(e);
      setBusy(false);
    }
  };

  return (
    <>
      {/* <Header /> */}
      <section className=" row m-auto login">
        <div className="col-6 text-center">
          <img src={assesment_SVG} alt="assesment" />
        </div>

        <div className="col-6">
          <form className="d-flex flex-column col-8" onSubmit={handleSubmit}>
            <h3>
              Login with your Matric number and "password" as your Password to
              start your Exam
            </h3>
            {/* TODO: Make error display beautiful */}
            <h3
              className={`text-danger mt-3 ${inputs.invalid ? "" : "d-none"}`}
            >
              invalid matric no and password
            </h3>
            <label htmlFor="matric-no" className="mt-4">
              {" "}
              Matric Number
            </label>
            <input
              type="text"
              name="matric-no"
              placeholder="19PA100"
              value={inputs["matric-no"]}
              onChange={handleInputs}
              required
            />
            <label htmlFor="password" className="mt-4">
              {" "}
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              placeholder="**********"
              value={inputs.password}
              onChange={handleInputs}
            />

            <input
              type="submit"
              disabled={busy}
              value="Login"
              className="offset-9 mt-4"
            />
          </form>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default LoginPage;

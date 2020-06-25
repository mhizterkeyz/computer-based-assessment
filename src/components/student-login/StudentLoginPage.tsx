import React, { useState, FormEvent } from "react";
import "./StudentLoginPage.scss";
import assesment_SVG from "../../svg/undraw_exams_g4ow 1.svg";
import Header from "../Header";
import { connect } from "react-redux";
import { loadStudent } from "../../redux/actions/studentAction";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
// import Header from '../Header';
// import Footer from '../Footer';

const StudentLoginPage = (props: any) => {
  const history = useHistory();
  if (window.location.pathname !== "/") {
    history.push("/");
  }
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

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (busy) return;
    // try {
    //   setInputs({ ...inputs, invalid: false });

    //   const user = await login(inputs);
    //   console.log(user);
    //   if (!user.status) {
    //     setInputs({ ...inputs, invalid: true, password: "" });
    //   }
    //   if (user) setBusy(false);
    //   // props.handleLogin(user);
    // } catch (e) {
    //   //TODO: Error handling
    //   console.log(e);
    // }

    try {
      setBusy(true);
      await props.loadStudent(inputs);
    } catch (error) {
      if (error.name === "Unauthorized") {
        toast.error(`Error: ${error.message}`);
        setBusy(false);
        return setInputs({ ...inputs, password: "", invalid: true });
      }
      toast.error(`Network Error: ${error.message}`);
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
            <h3>Login to start your exam</h3>
            <label htmlFor="matric-no" className="mt-4">
              {" "}
              Matric Number
            </label>
            <input
              type="text"
              name="matric-no"
              value={inputs["matric-no"]}
              onChange={handleInputs}
              placeholder="Enter matric number"
            />
            <label htmlFor="password" className="mt-4">
              {" "}
              Password
            </label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleInputs}
              placeholder="Enter password"
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
      {/* <Footer /> */}
    </>
  );
};

// function mapStateToProps(state: any) {
//   return {
//     student: state.student,
//     loading: state.apiCallsInProgress > 0,
//   };
// }

const mapDispatchToProps = {
  loadStudent,
};

export default connect(null, mapDispatchToProps)(StudentLoginPage);

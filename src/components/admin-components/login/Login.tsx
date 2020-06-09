import React from 'react';
import assesment_SVG from '../../../svg/undraw_exams_g4ow 1.svg'
import { useHistory } from 'react-router-dom';
import Header from '../../Header';
// import Header from '../Header';
// import Footer from '../Footer';

const Login = () => {
  const history = useHistory();
  return (
    <>
      <Header />
      <section className=" row m-auto  align-items-center login">
        <div className="col-6 text-center">
          <img src={assesment_SVG} alt="assesment" />
        </div>

        <div className="col-6">
          <form
            className="d-flex flex-column col-8"
            onSubmit={(e) => { e.preventDefault() }}
          >
            <h3>Admin Login</h3>
            <label htmlFor="matric-no" className="mt-4"> Username</label>
            <input type="text" name="matric-no" placeholder="Enter Username" />
            <label htmlFor="password" className="mt-4"> Password</label>
            <input type="password" name="password" placeholder="Enter password" />

            <input type="submit" value="Login" className="btn" onClick={() => {
              // history.push("/exam/credentials");
            }} />
          </form>
        </div>
      </section>
      {/* <Footer /> */}
    </>
  );
};

export default Login;
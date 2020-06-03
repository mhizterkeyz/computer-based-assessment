import React from 'react';
import './LoginPage.scss';
import assesment_SVG from '../../svg/undraw_exams_g4ow 1.svg'
// import Header from '../Header';
// import Footer from '../Footer';

const LoginPage = () => (
  <>
    {/* <Header /> */}
    <section className=" row m-auto login">
      <div className="col-6 text-center">
        <img src={assesment_SVG} alt="assesment" />
      </div>

      <div className="col-6">
        <form
          className="d-flex flex-column col-8"
          onSubmit={(e) => { e.preventDefault() }}
        >
          <h3>Login with your Matric number and "password" as your Password to start your Exam</h3>
          <label htmlFor="matric-no" className="mt-4"> Matric Number</label>
          <input type="text" name="matric-no" placeholder="19PA100" />
          <label htmlFor="password" className="mt-4"> Password</label>
          <input type="password" name="password" placeholder="**********" />

          <input type="submit" value="Login" className="offset-9 mt-4"/>
        </form>
      </div>
    </section>
    {/* <Footer /> */}
  </>
);

export default LoginPage;
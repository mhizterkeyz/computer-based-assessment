import React, { useState, useEffect } from 'react';
// import { useHistory } from "react-router-dom";
import './QuestionPage.scss';
import display_img from '../../image/Rectangle-19.png';

const credentialsObj: CredentialsProps = {
  displayImg: display_img,
  name: "Alikali Ojonugwa Justice",
  matric_no: "13MS1023",
  department: "Computer Science",
  faculty: "Natural Science"
}

interface CredentialsProps {
  displayImg: string;
  name: string;
  matric_no: string;
  department: string;
  faculty: string;
}

const Credentials = (props: CredentialsProps) => {
  return (
    <>
      <div className="credetials-pane mr-3">
        <div className="mb-3"><img src={props.displayImg} alt="ojay" /></div>
        <div className="details">
          <div>
            <h4>Name:</h4>
            <h5>{props.name}</h5>
          </div>

          <div>
            <h4>Matric. no:</h4>
            <h5>{props.matric_no}</h5>
          </div>

          <div>
            <h4>Department:</h4>
            <h5>{props.department}</h5>
          </div>

          <div>
            <h4>Faculty:</h4>
            <h5>{props.faculty}</h5>
          </div>
        </div>
      </div>
    </>
  );
};

const QuestionPage = () => {

  const [counter, setCounter] = useState({
    minutes: 30,
    seconds: 0
  });

  const { minutes, seconds } = counter;

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setCounter({
          minutes: minutes,
          seconds: seconds - 1
        });
      };

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setCounter({
            minutes: minutes - 1,
            seconds: 59
          })
        };
      };
    }, 1000);

    return (() => clearInterval(myInterval))
  }, [minutes, seconds]);


  return (
    <section className="m-auto d-flex question">
      <Credentials {...credentialsObj} />

      <div className="question">
        <div className="d-flex justify-content-between">
          <h3>Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span></h3>

          {/* <h4>Time Left: <span>45:00</span></h4> */}
          <h4>Time Left: <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span></h4>
        </div>

        <div className="d-flex flex-column question-pane">
          <h4 className="text-center mb-4">Question 1</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur, turpis quis condimentum
          convallis, nibh urna viverra neque, ac tristique odio diam sit amet libero. Donec pretium ac magna ut
          sagittis. Sed euismod, velit et interdum porttitor, ex ex dapibus augue, eget interdum nisi orci vitae lorem.
        Morbi vel tellus luctus, faucibus justo ut, tristique lacus.</p>

          <form className="d-flex flex-column">
            <div>
              <label>A.
              <input type="radio" className="ml-3 mr-2" />
              Lorem ipsum dolor
            </label>
            </div>

            <div>
              <label>B.
              <input type="radio" className="ml-3 mr-2" />
              Lorem ipsum dolor
            </label>
            </div>

            <div>
              <label>C.
              <input type="radio" className="ml-3 mr-2" />
              Lorem ipsum dolor
            </label>
            </div>

            <div>
              <label>D.
              <input type="radio" className="ml-3 mr-2" />
              Lorem ipsum dolor
            </label>
            </div>

          </form>


          <div className="row">
            <div className="col-6">
              <button className="btn mr-4" onClick={() => { }} >Previous</button>
              <button className="btn" onClick={() => { }} >Next</button>
            </div>

            <div className="col-6 text-right"><button className="btn" onClick={() => { }} >Submit</button></div>
          </div>
        </div>

        <div className="mt-3 mb-5 question-btn">
          <button className="answered">1</button>
          <button className="answered">2</button>
          <button className="answered">3</button>
          <button className="answered">4</button>
          <button className="answered">5</button>
          <button className="answered">6</button>
          <button className="answered">7</button>
          <button className="answered">8</button>
          <button className="answered">9</button>
          <button className="answered">10</button>
          <button className="">11</button>
          <button className="">12</button>
          <button className="">13</button>
          <button className="">14</button>
          <button className="">15</button>
          <button className="">16</button>
          <button className="">17</button>
          <button className="">18</button>
          <button className="">19</button>
          <button className="">20</button>
          <button className="">21</button>
          <button className="">22</button>
          <button className="">23</button>
          <button className="">24</button>
          <button className="">25</button>
          <button className="">26</button>
          <button className="">27</button>
          <button className="">28</button>
          <button className="">29</button>
        </div>
      </div>
    </section>
  );
};

export default QuestionPage;
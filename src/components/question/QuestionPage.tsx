import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './QuestionPage.scss';
import display_img from '../../image/Rectangle-19.png';
import timer_icon from '../../svg/access_alarms_24px_outlined.svg';
import Modal from '../Modal';

interface ConfirmSubmitProps {
  handleModalClose: () => void;
}

const ConfirmSubmit = ({ handleModalClose }: ConfirmSubmitProps) => {
  const history = useHistory();
  return (
    <div className="text-center confirm-modal">
      <h2>Do you want to submit?</h2>
      <p>Submitting will automatically end your Examination <br />
                        Continue by clicking on Submit if you're done.</p>

      <div className="">
        <button
          className="btn"
          onClick={handleModalClose}
        >
          Don't Submit
                            </button>

        <button
          className="btn ml-2"
          onClick={() => {
            history.push("/exam/submit");
          }}>
          Submit
      </button>
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const [counter, setCounter] = useState({
    minutes: 45,
    seconds: 0
  });

  const [modalData, setModalData] = useState({
    show: false,
    display: <></>,
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


  const handleModalClose = () => setModalData({ ...modalData, show: false });

  return (
    <>
      <Modal show={modalData.show} handleClose={handleModalClose}>
        {modalData.display}
      </Modal>
      <main>
        <section className="col-2 mr-3 student-credentials">
          <div className="text-center">
            <span className="image-cropper">
              <img src={display_img} alt="student" />
            </span>
            <h2>Alikali Ojonugwa Justice</h2>
          </div>

          <hr />

          <div className="details">
            <div>
              <h3>Matric. no:</h3>
              <h4>13MS1023</h4>
            </div>

            <div>
              <h3>Department</h3>
              <h4>Computer Science</h4>
            </div>
            <div>
              <h3>Faculty</h3>
              <h4>Natural Science</h4>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center mt-3">
            <img src={timer_icon} alt="timer icon" className="mr-2" />
            <h5>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h5>
          </div>
        </section>

        <section className="col-8 question">
          <h3>Course - <span>Nigeria People and culture (GST 103)</span></h3>
          <div className="question-body">
            <h4 className="text-center mb-4">Question 1</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur, turpis quis condimentum
            convallis, nibh urna viverra neque, ac tristique odio diam sit amet libero. Donec pretium ac magna ut
            sagittis. Sed euismod, velit et interdum porttitor, ex ex dapibus augue, eget interdum nisi orci vitae lorem.
              Morbi vel tellus luctus, faucibus justo ut, tristique lacus.</p>

            <form className="d-flex flex-column">
              <div>
                <label>
                  A.
                  <input type="radio" className="ml-3 mr-2" />
                  Lorem ipsum dolor
                </label>
              </div>

              <div>
                <label>
                  B.
                  <input type="radio" className="ml-3 mr-2" />
                  Lorem ipsum dolor
                </label>
              </div>

              <div>
                <label>
                  C.
                  <input type="radio" className="ml-3 mr-2" />
                  Lorem ipsum dolor
                </label>
              </div>

              <div>
                <label>
                  D.
                  <input type="radio" className="ml-3 mr-2" />
                  Lorem ipsum dolor
                </label>
              </div>

            </form>

            <div className="d-flex justify-content-between ctrl-btn">
              <div className="">
                <button className="btn mr-4 prev" onClick={() => { }} >Previous</button>
                <button className="btn" onClick={() => { }} >Next</button>
              </div>

              <div className="text-right">
                <button className="btn" onClick={() => {
                  setModalData({
                    show: true,
                    display: (
                      <ConfirmSubmit handleModalClose={handleModalClose} />
                    ),
                  });
                }}
                >Submit</button>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 question-btn">
            <button className="btn answered">1</button>
            <button className="btn answered">2</button>
            <button className="btn answered">3</button>
            <button className="btn answered">4</button>
            <button className="btn answered">5</button>
            <button className="btn answered">6</button>
            <button className="btn answered">7</button>
            <button className="btn answered">8</button>
            <button className="btn answered">9</button>
            <button className="btn answered">10</button>
            <button className="btn">11</button>
            <button className="btn">12</button>
            <button className="btn">13</button>
            <button className="btn">14</button>
            <button className="btn">15</button>
            <button className="btn">16</button>
            <button className="btn">17</button>
            <button className="btn">18</button>
            <button className="btn">19</button>
            <button className="btn">20</button>
            <button className="btn">21</button>
            <button className="btn">22</button>
            <button className="btn">23</button>
            <button className="btn">24</button>
            <button className="btn">25</button>
            <button className="btn">26</button>
            <button className="btn">27</button>
            <button className="btn">28</button>
            <button className="btn">29</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default QuestionPage;
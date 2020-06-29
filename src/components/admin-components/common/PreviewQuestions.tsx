import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import display_img from "../../../image/Rectangle-19.png";
import timer_icon from "../../../svg/access_alarms_24px_outlined.svg";

interface ConfirmSubmitProps {
  handleModalClose: () => void;
}

const ConfirmSubmit = ({ handleModalClose }: ConfirmSubmitProps) => {
  const history = useHistory();
  return (
    <div className="text-center confirm-modal">
      <h2>Do you want to submit?</h2>
      <p>
        Submitting will automatically end your Examination <br />
        Continue by clicking on Submit if you're done.
      </p>

      <div className="">
        <button className="btn" onClick={handleModalClose}>
          Don't Submit
        </button>

        <button
          className="btn ml-2"
          onClick={() => {
            history.push("/exam/submit");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const PreviewQuestions = () => {
  const [counter, setCounter] = useState({
    minutes: 11,
    seconds: 0,
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
          seconds: seconds - 1,
        });
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setCounter({
            minutes: minutes - 1,
            seconds: 59,
          });
        }
      }
    }, 1000);

    return () => clearInterval(myInterval);
  }, [minutes, seconds]);

  const handleModalClose = () => setModalData({ ...modalData, show: false });

  return (
    <>
      <main>
        <section className="question preview">
          <h3>
            Course - <span>Nigeria People and culture (GST 103)</span>
          </h3>
          <div className="question-body">
            <h4 className="text-center mb-4">Question 1</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              efficitur, turpis quis condimentum convallis, nibh urna viverra
              neque, ac tristique odio diam sit amet libero. Donec pretium ac
              magna ut sagittis. Sed euismod, velit et interdum porttitor, ex ex
              dapibus augue, eget interdum nisi orci vitae lorem. Morbi vel
              tellus luctus, faucibus justo ut, tristique lacus.
            </p>

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
                <button className="btn mr-4 prev" onClick={() => {}}>
                  Previous
                </button>
                <button className="btn" onClick={() => {}}>
                  Next
                </button>
              </div>

              <div className="text-right">
                <button className="btn">Back to Assessment view</button>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-5 question-btn">
            <a href="/admin/preview" className="btn answered">
              <span>1</span>
            </a>
            <a href="/admin/preview" className="btn answered">
              <span>2</span>
            </a>
            <a href="/admin/preview" className="btn answered">
              <span>3</span>
            </a>
            <a href="/admin/preview" className="btn answered">
              <span>4</span>
            </a>
            <a href="/admin/preview" className="btn answered">
              <span>5</span>
            </a>
            <a href="/admin/preview" className="btn answered">
              <span>6</span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default PreviewQuestions;

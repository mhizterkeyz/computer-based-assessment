import React from 'react';
import { useHistory } from 'react-router-dom';
import './InstructionPage.scss';

const InstructionPage = () => {
  const history = useHistory();

  return (
    <section className="m-auto instruction">
      <div className="d-flex justify-content-between">
        <h3>Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span></h3>

        <div className="timer align-items-end">
          <h4>Time:</h4>
          <span>45:00 minutes</span>
        </div>

      </div>
      <div className="d-flex flex-column mb-5 instruction">
        <h4>Instruction</h4>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur, turpis quis condimentum
        convallis, nibh urna viverra neque, ac tristique odio diam sit amet libero. Donec pretium ac magna ut
        sagittis. Sed euismod, velit et interdum porttitor, ex ex dapibus augue, eget interdum nisi orci vitae lorem.
      Morbi vel tellus luctus, faucibus justo ut, tristique lacus.</p>

        <span>
          Course:
        <span>GST 101</span>
        </span>

        <span>
          Course Title:
        <span>Nigerian People and Culture.</span>
        </span>
        <span >
          Exam Duration:
        <span>45 minutes</span>
        </span>

        <div className="text-right">
          <button
            className="btn"
            onClick={() => {
              history.push(`/exam/question-${1}`);
            }}
          >
            Start
        </button>
        </div>
      </div>
    </section>
  );
};

export default InstructionPage;
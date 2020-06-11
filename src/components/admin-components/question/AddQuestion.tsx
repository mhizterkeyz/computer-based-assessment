import React from "react";

const AddQuestion = () => {
  return (
    <>
    <section className="add-assessment">
      <h3>Add Question</h3>

      <form className="form-section question-form">
        <div>
          <label htmlFor="instruction">Question 1</label>
          <textarea name="instruction" placeholder="Specify Question here..." />
        </div>

        <div className=" d-flex align-items-center mt-3 question-form__option">
          <label htmlFor="a">A.</label>
          <input type="radio" className="ml-3" />
          <input type="text" className="ml-3 option-text" />
        </div>

        <div className=" d-flex align-items-center mt-3 question-form__option">
          <label htmlFor="a">B.</label>
          <input type="radio" className="ml-3" />
          <input type="text" className="ml-3 option-text" />
        </div>

        <div className="d-flex align-items-center mt-3">
          <button className="btn mr-2 btn-add-option"/>
          <span>Add options</span>
        </div>

        <div className="d-flex align-items-center mt-5 mb-5">
          <button className="btn btn-upload">Upload diagram</button>
          <input type="text" className="ml-3" />
          <input type="file" className="d-none" />
          <span className="ml-2 optional">Optional</span>
        </div>

        <div className="d-flex justify-content-between ctrl-btn">
          <div>
            <button className="btn mr-3 prev btn-action" onClick={() => { }} >Previous</button>
            <button className="btn btn-action" onClick={() => { }} >Next</button>
          </div>

          <div className="text-right">
            <button className="btn mr-3 btn-action">Add</button>
            <button className="btn btn-action">Remove</button>
          </div>
        </div>
      </form>

    </section>
      <div className="pagination question-link">
        <button  className="btn link active">1</button>
        <button  className="btn link active">2</button>
        <button  className="btn link active">3</button>
        <button  className="btn link">4</button>
        <button  className="btn link">5</button>
        <button  className="btn link">6</button>
        <button  className="btn link">7</button>
      </div>
      </>
  );
};

export default AddQuestion;
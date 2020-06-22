import React from "react";
import { uploadImage, getQuestions } from "../../../api/AdministratorCalls";

const Questions = (props: any) => {
  const {
    toBase64,
    nextQuestion,
    previousQuestion,
    paginationText,
    question,
    handleImages,
    handleInputs,
    handleOptions,
    removeRow,
    addRow,
    handleQuestionFor,
    removeQuestionFor,
  } = props;
  const handleImageUpload = async (ev: any) => {
    ev.persist();
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const img = await uploadImage(file);
      handleImages(img);
    } catch (error) {
      console.log(error);
    }
    ev.target.value = "";
  };
  const handleFileUpload = async (ev: any) => {
    const { files } = ev.target;
    try {
      const file = await toBase64(files[0]);
      const img = await getQuestions(file);
      addRow(img);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <fieldset
      className="form-section course-details"
      style={{ position: "relative" }}
    >
      <legend>Questions</legend>
      <div className="row">
        <div className="col-12">
          <label htmlFor="input_file" className="d-block">
            data from spreadsheet (xlsx):
          </label>
          <input
            type="file"
            name="questionFile"
            onChange={handleFileUpload}
            id="input_file"
          />
        </div>
        <p
          className="col-2 my-3 btn btn-primary ml-3"
          style={{ alignSelf: "center" }}
          onClick={addRow}
        >
          Add new
        </p>
        <p
          className={`col-1 btn btn-danger mx-auto my-3 ${
            question ? "" : "d-none"
          }`}
          style={{ alignSelf: "center" }}
          onClick={removeRow}
        >
          -
        </p>
        <p className="my-3 ml-auto col-3">
          <span className="btn btn-primary mr-1" onClick={previousQuestion}>
            {" "}
            &lt;{" "}
          </span>{" "}
          {paginationText}{" "}
          <span className="btn btn-primary ml-1" onClick={nextQuestion}>
            {" "}
            &gt;{" "}
          </span>
        </p>
        {!question ? (
          ""
        ) : (
          <>
            <div className="images col-12 my-3">
              <div>
                <label htmlFor="input_image" className="d-block">
                  upload image
                </label>
                <input
                  type="file"
                  name="questionImage"
                  onChange={handleImageUpload}
                  id="input_image"
                />
                <div className="row col-12 my-3">
                  {question.images.map((elem: string, i: number) => {
                    if (!elem) return "";
                    return (
                      <div className="col-3 my-1" key={`question_image_${i}`}>
                        <img
                          src={`http://localhost:8000/api/static/${elem}`}
                          style={{ width: "100%" }}
                          alt=""
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mb-3">
                  {question.questionFor.length < 1
                    ? "For every body"
                    : question.questionFor.map((elem: any, i: any) => {
                        return (
                          <p
                            className="btn btn-primary mr-1"
                            key={`questionFor_${i}`}
                          >
                            {elem.faculty} -&gt; {elem.department}{" "}
                            <span
                              className="badge badge-danger"
                              onClick={() => removeQuestionFor(i)}
                            >
                              &times;
                            </span>
                          </p>
                        );
                      })}
                  <input
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="comma separated list. i.e faculty:department,faculty2:deparment"
                    onChange={handleQuestionFor}
                  />
                </div>
                <div className="row">
                  <div className="col-10">
                    <label className="d-block">Question:</label>
                    <input
                      type="text"
                      name="question"
                      placeholder="Question"
                      value={question.question}
                      style={{ width: "100%" }}
                      onChange={handleInputs}
                    />{" "}
                  </div>
                  <div className="col-2">
                    <label className="d-block" htmlFor="marks">
                      Marks:{" "}
                    </label>
                    <input
                      type="number"
                      style={{ width: "100%" }}
                      name="marks"
                      value={question.marks}
                      onChange={handleInputs}
                      id="marks"
                    />
                  </div>
                  <p
                    className="my-3 text-center col-12"
                    style={{ fontWeight: 900 }}
                  >
                    Options
                  </p>
                  {Object.keys(question.options).map((elem, i) => {
                    return (
                      <div className="ml-3 col-12" key={`option_${elem}`}>
                        <label>
                          <p
                            style={{
                              display: "flex",
                              alignItems: "center",
                              margin: "none",
                            }}
                          >
                            <input
                              type="checkbox"
                              className=""
                              checked={elem === question.correct}
                              onChange={() => {
                                handleInputs({
                                  target: { value: elem, name: "correct" },
                                });
                              }}
                            />
                            <span>{elem.toUpperCase()}:</span>
                          </p>
                        </label>
                        <input
                          value={question.options[elem]}
                          onChange={handleOptions}
                          type="text"
                          style={{ width: "100%" }}
                          name={elem}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
};

export default Questions;

import React from 'react';
// import { useHistory } from "react-router-dom";
import './QuestionPage.scss';

// interface OptionProps {
//   checked: boolean;
// }
// const Options = ({ checked }: OptionProps) => (
//   <div>
//     {/* <input type="radio" name="options" value="" checked />
//     <label htmlFor="one" className="ml-3">Lorem ipsum dolor</label> */}

//     <label className="container">Lorem ipsum dolor
//      {checked
//         ? <input type="radio" checked />
//       : <input type="radio"/>}
//       <span className="checkmark"></span>
//     </label>
//   </div>
// );

const QuestionPage = () => {
  let questionBtn = 28;
  return (
    <section className="m-auto question">
      <h3>Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span></h3>
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
    </section>
  );
};

export default QuestionPage;
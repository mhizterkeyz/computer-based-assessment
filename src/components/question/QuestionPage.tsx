import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './QuestionPage.scss';
import display_img from '../../image/Ellipse.png';
import Modal from '../Modal';


const QuestionPage = () => {
  return (
    <main>
      <section className="col-2 mr-3 student-credentials">
        <div className="text-center">
          <img src={display_img} alt="student" />
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
      </section>

      <section className="col-8 question">
        <h3>Course - <span>NIGERIAN PEOPLE and culture (GST 103)</span></h3>
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
              <button className="btn">Submit</button>
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


  );
};

export default QuestionPage;
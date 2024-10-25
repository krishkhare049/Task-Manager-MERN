import React, { useState } from "react";

import { FcTodoList } from "react-icons/fc";

// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { EffectFlip } from "swiper/modules";
import "swiper/css/effect-flip";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import userSvg from "../assets/user.svg";
import padlockSvg from "../assets/padlock.svg";
import axios from "axios";

import Swal from 'sweetalert2'

export default function Login({setLog}) {
  //   const swiper = useSwiper();
  const [swiper, setSwiper] = useState(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [name, setName] = useState('');

  const logInToAccount = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/logInToAccount", {
        login_email: loginEmail,
        login_password: loginPassword,
      }, {withCredentials: true})
      .then((response) => {
        if (response.data === "user_not_found") {
          console.log('No User found with these credentials!');
          Swal.fire({
            title: 'Invalid email and password!',
            text: 'Try again with correct email and password...',
            icon: 'error',
            // confirmButtonText: 'Cool'
          });
          setLoginEmail('')
          setLoginPassword('')
        }
        else{
            // localStorage.setItem('token', response.data)
            setLog(true)
        }
      })
      .catch((error) => console.log(error));
  };

  const createAccount = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/createAccount", {
        full_name: name,
        user_email: createEmail,
        user_password: createPassword,
      })
      .then((response) => {
        if (response.data === "account_already_exists") {
          console.log('Account with this email already exists');
          Swal.fire({
            title: 'Email is taken already!',
            text: 'Try again with different email. And if you are the user of this email then please login...',
            icon: 'error',
            // confirmButtonText: 'Cool'
          })
        }
        else{
            // localStorage.setItem('token', response.data)
            setLog(true)
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="flex justify-evenly items-center w-60 p-2 m-2 bg-white rounded-lg shadow-md">
        <FcTodoList className="w-10 h-10" />
        <span className="text-2xl text-black font-bold">Tasks Manager</span>
      </div>
      <div className="log_sign shadow-md">
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={30}
          onSwiper={(swiper) => setSwiper(swiper)}
          autoHeight
          noSwipingClass="swiperSlide"
          navigation={false}
          //   pagination={{ clickable: true }}
          //   scrollbar={{ draggable: true }}
          // modules={[EffectFlip]}
          effect="flip"
        >
          {/* <!-- Slides --> */}
          <SwiperSlide className="swiperSlide">
            <div id="login_form" className="form_sec">
              {/* <form action="/login" method="post"  onSubmit={logInToAccount}> */}
              <form onSubmit={logInToAccount}>
                <div className="form_sec">
                  <h1>Log In</h1>
                  <hr />

                  <div className="input_elem">
                    <img src={userSvg} alt="" />
                    <input
                      type="email"
                      name=""
                      id=""
                      placeholder="Email..."
                      value={loginEmail}
                      onChange={(e)=> setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input_elem">
                    <img src={padlockSvg} alt="" />
                    <input type="password" placeholder="Password..." value={loginPassword} onChange={(e)=> setLoginPassword(e.target.value)} required />
                  </div>

                  <div className="btn_sec">
                    <button type="submit" className="submit_btn">
                      Log in
                    </button>
                    <button
                      type="button"
                      className="disable_btn"
                      id="change_signup"
                      onClick={() => swiper.slideNext()}
                    >
                      Sign Up {">"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </SwiperSlide>
          <SwiperSlide className="swiperSlide">
            <div id="regist_form" className="form_sec">
              {/* <form action="/signup" method="post" onSubmit={createAccount}> */}
              <form onSubmit={createAccount}>
                <div className="form_sec">
                  <h1>Sign Up</h1>
                  <hr />

                  <div className="input_elem">
                    <img src={userSvg} alt="" />
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Name..."
                      value={name} onChange={(e)=> setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input_elem">
                    <img src={userSvg} alt="" />
                    <input
                      type="email"
                      name=""
                      id=""
                      placeholder="Email..."
                      value={createEmail} onChange={(e)=> setCreateEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input_elem">
                    <img src={padlockSvg} alt="" />
                    <input type="password" placeholder="Password..." value={createPassword} onChange={(e)=> setCreatePassword(e.target.value)} required />
                  </div>

                  <div className="btn_sec">
                    <button type="submit" className="submit_btn">
                      Sign Up
                    </button>
                    <button
                      type="button"
                      className="disable_btn"
                      id="change_login"
                      onClick={() => swiper.slidePrev()}
                    >
                      Log in {`>`}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </SwiperSlide>
          {/* <!-- If we need pagination --> */}
          {/* <div className="swiper-pagination"></div> */}

          {/* <!-- If we need scrollbar --> */}
          {/* <!-- <div className="swiper-scrollbar"></div> --> */}
        </Swiper>
      </div>
    </>
  );
}

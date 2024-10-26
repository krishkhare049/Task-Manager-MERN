import React, { useState } from "react";
import { FcTodoList } from "react-icons/fc";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import userSvg from "../assets/user.svg";
import padlockSvg from "../assets/padlock.svg";
import axios from "axios";
import Swal from "sweetalert2";

import { Swiper as SwiperType } from "swiper"; // Import Swiper type

interface LoginProps {
  setLog: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function Login({ setLog }: LoginProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null); // Set the type for swiper
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [name, setName] = useState("");

  const logInToAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post(
        "http://localhost:5000/logInToAccount",
        {
          login_email: loginEmail,
          login_password: loginPassword,
        },
        { withCredentials: true }
      )

      .then((response) => {
        if (response.data === "user_not_found") {
          console.log("No User found with these credentials!");

          Swal.fire({
            title: "Invalid email and password!",
            text: "Try again with correct email and password...",
            icon: "error",
          });

          setLoginEmail("");

          setLoginPassword("");
        } else {
          setLog(true);
        }
      })

      .catch((error) => console.log(error));
  };

  const createAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/createAccount", {
        full_name: name,
        user_email: createEmail,
        user_password: createPassword,
      }, {withCredentials: true})

      .then((response) => {
        if (response.data === "account_already_exists") {
          console.log("Account with this email already exists");

          Swal.fire({
            title: "Email is taken already!",

            text: "Try again with different email. If you are the user of this email, please login...",

            icon: "error",
          });
        } else {
          setLog(true);
        }
      })

      .catch((error) => console.log(error));
  };
  return (
    <>
      <div className="flex justify-evenly items-center w-60 p-2 m-2 bg-white rounded-xl shadow-md">
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
          // onSwiper={(swiper) => setSwiper(swiper)}
          onSwiper={(swiperInstance: React.SetStateAction<SwiperType | null>) => setSwiper(swiperInstance)}
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
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input_elem">
                    <img src={padlockSvg} alt="" />
                    <input
                      type="password"
                      placeholder="Password..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="btn_sec">
                    <button type="submit" className="submit_btn">
                      Log in
                    </button>
                    <button
                      type="button"
                      className="disable_btn"
                      id="change_signup"
                      onClick={() => {
                        if (swiper) {
                          swiper.slideNext();
                        }
                      }}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input_elem">
                    <img src={padlockSvg} alt="" />
                    <input
                      type="password"
                      placeholder="Password..."
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="btn_sec">
                    <button type="submit" className="submit_btn">
                      Sign Up
                    </button>
                    <button
                      type="button"
                      className="disable_btn"
                      id="change_login"
                      onClick={() => {
                        if (swiper) {
                          swiper.slidePrev();
                        }
                      }}
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

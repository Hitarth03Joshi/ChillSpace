import React, { useEffect, useState } from "react";
import "../styles/Login.scss"
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import axios from "axios";

const LoginPage = () => {

  const {register, handleSubmit, formState: { errors }} = useForm() 

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const submitHandler = async (data) => {
    try{
          const res = await axios.post("http://localhost:3001/User/login", data);
          if (res) {
            alert(res.data.message) //tost...
            dispatch(
              setLogin({
                user: res.data.data,
                token:res.data.token
              })
            )
    
            if(res.data.data.roleId.name === "Guest"){
              navigate("/");
            }
            else if(res.data.data.roleId.name === "Host"){
              navigate("/");
            }
            if(res.data.data.roleId.name === "User"){
              navigate("/");
            }
            else if(res.data.data.roleId.name === "Admin"){
              navigate("/admin/overview")
            }
          }
        } catch (error) {
          alert(error.response.data.message);
        }
  }

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit(submitHandler)}>
          <input
            type="email"
            placeholder="Email"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            {...register("email", { required: true })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            {...register("password", { required: true })}
            required
          />
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react'
import '../assets/Login.css'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export const Login = () => {
    const {register,handleSubmit,formState:{errors}}=useForm();
    console.log(errors);

    const submitHandler=(data)=>{
        console.log(data);
    }

    const validationSchema={
        emailValidator:{
            required:{
                value:true,
                message:"Email is required*"
            },
            pattern:{  
                value:/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]/,
                message:"Invalid Email*"
            }
        },
        passwordValidator:{
            required:{
                value:true,
                message:"Password is required*"
            },
            pattern:{
                value:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{0,}$/,
                message:"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character*"
            },
            minLength:{
                value:6,
                message:"Password must be at least 6 characters*"
            }
        }
    }

  return (
    <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-5 mx-auto">
                        <div id="first">
                            <div className="myform form ">
                                <div className="logo mb-3">
                                    <div className="col-md-12 text-center">
                                        <h1>Login</h1>
                                    </div>
                                </div>
                                <form name="login" onSubmit={handleSubmit(submitHandler)}>
                                    <div className="form-group">
                                        <div className="error-display">
                                            <label htmlFor="email">Email address</label>
                                            <span className='span-error'>{errors.email?.message}</span>
                                        </div>
                                        <input type="email" name="email"  className="form-control" id="email" placeholder="Enter email" {...register("email",validationSchema.emailValidator)} />
                                    </div>
                                    <div className="form-group">
                                        <div className="error-display">
                                            <label htmlFor="password">Password</label>
                                            <span className='span-error'>{errors.password?.message}</span>
                                        </div>
                                        <input type="password" name="password" id="password"  className="form-control" placeholder="Enter Password" {...register("password",validationSchema.passwordValidator)}/>
                                    </div>
                                    <div className="form-group">
                                         <a href="#">Forgot Password</a>
                                    </div>
                                    <div className="col-md-12 text-center ">
                                        <button type="submit" className=" btn btn-block mybtn btn-primary tx-tfm">Login</button>
                                    </div>
                                    <div className="col-md-12 ">
                                        <div className="login-or">
                                            <div className="hr-or">
                                                <span className="span-or">or</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <p className="text-center">Don't have account? <Link to='/signup' className="signup">Sign up here</Link></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  )
}

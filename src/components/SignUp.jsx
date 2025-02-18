import React from 'react'
import '../assets/signup.css'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export const SignUp = () => {
  const {register,handleSubmit,formState:{errors}}=useForm();
  console.log(errors);
  
  const submitHandler=(data)=>{
    console.log(data);
  }
  
  const validationSchema={
    nameValidator:{
      required:{
        value:true,
        message:"Full Name is required*"
      },
      pattern:{  
        value:/^[a-zA-Z\s]*$/,
        message:"Full Name must contain only alphabets*"
      }
    },
    mobileNoValidator:{
      required:{
        value:true,
        message:"Mobile No. is required*"
      },
      pattern:{  
        value:/[6-9]{1}[0-9]{9}/,
        message:"Invalid Mobile No.*"
      },
      maxLength:{
        value:10,
        message:"Mobile No. must be 10 digits*"
      }
    },
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
                    <h1>Sign Up</h1>
                  </div>
                </div>
                <form name="login" onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-group">
                    <div className="error-display">
                      <label htmlFor="firstName">First Name</label>
                      <span className='span-error'>{errors.firstName?.message}</span>
                    </div>
                    <input type="text" name="firstName"  className="form-control" id="firstName" placeholder="Enter First name" {...register("firstName",validationSchema.nameValidator)} />
                  </div>
                  <div className="form-group">
                    <div className="error-display">
                      <label htmlFor="lastName">Last Name</label>
                      <span className='span-error'>{errors.lastName?.message}</span>
                    </div>
                    <input type="text" name="lastName"  className="form-control" id="lastName" placeholder="Enter Last name" {...register("lastName",validationSchema.nameValidator)} />
                  </div>
                  <div className="form-group">
                    <div className="error-display">
                      <label htmlFor="mobileNo">Mobile No.</label>
                      <span className='span-error'>{errors.mobileNo?.message}</span>
                    </div>
                    <input type="mobileNo" name="mobileNo"  className="form-control" id="mobileNo" placeholder="Enter Mobile No." {...register("mobileNo",validationSchema.mobileNoValidator)} />
                  </div>
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
                  <div className="col-md-12 text-center">
                    <button type="submit" className=" btn mybtn btn-primary tx-tfm">Submit</button>
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

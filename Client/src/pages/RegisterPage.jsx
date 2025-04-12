import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useForm } from "react-hook-form";
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [isGuest, setisGuest] = useState(false)
  const [isHost, setisHost] = useState(false)
  const handleroleChange = (roleid)=>{
    if(roleid === "67e3e0313765b43d5bc82e8f"){
      setisGuest(true)
      setisHost(false)
    }
    else if(roleid === "67e3dfe23765b43d5bc82e8d"){
      setisHost(true)
      setisGuest(false)
    }
    else{
      setisGuest(false)
      setisHost(false)
    }
  }

  const [passwordMatch, setPasswordMatch] = useState(true)
  const [ProfileImage, setProfileImage] = useState(null)

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  })

  const Validation = {
    nameValidator:{
      required:{
        value:true,
        message:"*name required.."
      }
    },
    mobileValidator:{
      required:{
        value:true,
        message:"*mobile no. required.."
      },
      minLength:{
        value:10,
        message:"*invalid length.."
      },
      maxLength:{
        value:10,
        message:"*invalid length.."
      }
    },
    roleValidator:{
      value:true,
      message:"role is required.."
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
          value:/^(?=.*[a-z])(?=.*[a-zA-Z]).{0,}$/,
          message:"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character*"
      },
      minLength:{
          value:6,
          message:"Password must be at least 6 characters*"
      }
  }
}
  const {register,handleSubmit,formState:{errors}}=useForm()

  const navigate = useNavigate()

  const submitHandler = async (data) => {
    const Formdata = new FormData()
    Formdata.append("firstName", data.firstName)
    Formdata.append("lastName", data.lastName)
    Formdata.append("email", data.email)
    Formdata.append("roleId", data.roleId)
    Formdata.append("password", formData.password)
    if (ProfileImage) {
      Formdata.append("image", ProfileImage);
    }
    try {
          const res = await axios.post("http://localhost:3001/User/register", Formdata);
          if (res.status === 201) {
            alert("Account Created") //tost...
            navigate("/login")
          }
          else if (res.status === 409) {
            alert("Already Exist");
          }
           else {
            alert("Something is wrong");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert(error.response.data.message);
        }
  }


  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit(submitHandler)}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            {...register("firstName",Validation.nameValidator)}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            {...register("lastName",Validation.nameValidator)}
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            {...register("email",Validation.emailValidator)}
          />
          <select {...register("roleId")}
            onChange={(e)=>{handleroleChange(e.target.value)}}>
            <option value="67e3e0313765b43d5bc82e8f">Guest</option>
            <option value="67e3dfe23765b43d5bc82e8d">Host</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          {isHost && <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={(e) => setProfileImage( e.target.files[0] )}
            style={{ opacity: 0, position: "absolute", zIndex: -1 }}
            required
          />}

          {isHost &&<label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>}

          {ProfileImage && (
            <img
              src={URL.createObjectURL(ProfileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};


export default RegisterPage;

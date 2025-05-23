import React,{useState,useContext} from 'react'
import AuthLayout from '../../Components/Layouts/AuthLayout'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Input from '../../Components/Inputs/Input'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { validateEmail } from '../../utils/helper'

import { UserContext } from '../../Contexts/UserContext'


const Login = () => {

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);


const {updateUser}=useContext(UserContext);
  const navigate=useNavigate();

//handle login form submission
  const handleLogin=async(e)=>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Password enter the  password");
      return;
    }

    setError("");

    //login api call

    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
    });
    const {token,role}=response.data;
    if(token){
      localStorage.setItem("token",token);
      updateUser(response.data);

      //redirect to dashboard based on role
      if(role==="admin"){
        navigate("/admin/dashboard");
    }else{
      navigate("/user/dashboard");
    }
  }
  }catch(error){
    if(error.response && error.response.data.message){
      setError(error.response.data.message);
    }
    else{
      setError("Something went wrong, please try again later");
    }
  }
  };

  
  return <AuthLayout>
    <div className="lg:w-[70%]  h-3/4 md:h-full flex flex-col  justify-center">
      <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>please enter your details to login</p>

      <form onSubmit={handleLogin}>
        <Input
        value={email}
        onChange={({target})=>setEmail(target.value)}
        label="Email address"
        placeholder="Enter your email address"
        type="text"
        />
         <Input
        value={password}
        onChange={({target})=>setPassword(target.value)}
        label="Password"
        placeholder="Min 8 characters"
        type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}


        <button type='submit' className='btn-primary'>Login</button>
        <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?{" "}
          <Link className="font-medium text-blue-500" to="/signup">Sign up</Link>
        </p>

       

        </form>

      </div>
  
    </AuthLayout> 
  
}

export default Login

import React, {useState,useContext } from 'react'
import AuthLayout from '../../Components/Layouts/AuthLayout'
import { Link } from 'react-router-dom'
import Input from '../../Components/Inputs/Input'
import ProfilePhotoSelector from '../../Components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Contexts/UserContext'
import uploadImage from '../../utils/uploadImage'



const SignUp = () => {

  const [profileImage, setProfileImage] = useState(null);
  const [Fullname,setFullname]= useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [adminInviteToken,setadminInviteToken]=useState("")
  const [error,setError]=useState(null)

  const {updateUser}=useContext(UserContext);
  const navigate=useNavigate();

  const handleSignUp=async(e)=>{
    e.preventDefault();

    let ProfileImageUrl='';
    if(!Fullname){
      setError("Please enter your full name");
      return;
    }
    if(!email){
      setError("Please enter your email address");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
  

    setError("");

    // Sign up API call

    
    try{

      //upload profile image if it exists
      if(profileImage){
        const imgUploadRes=await uploadImage(profileImage);
        ProfileImageUrl=imgUploadRes.imageUrl || '';
        console.log("Image uploaded successfully",ProfileImageUrl);

      }

      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:Fullname,
        email,
        password,
        ProfileImageUrl,
        adminInviteToken
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

  

  
  return (
    <AuthLayout>
      <div className="lg:w-[100%]  h-auto md:h-full mt-10 md:mt-0 flex flex-col  justify-center">
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join Us today By entering your Details Below</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
           
          <Input
          value={Fullname}
          onChange={({target})=>setFullname(target.value)}
          label="Full Name"
          placeholder="Enter your full name"
          type="text"
          />
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
 <Input
          value={adminInviteToken}
          onChange={({target})=>setadminInviteToken(target.value)}
          label="Admin Invite Token"
          placeholder="6 digit code"
          type="text"
          />
          </div>
           {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>Sign Up</button>
          <p className='text-[13px] text-slate-800 mt-3'>Already have an account?{" "}
            <Link className="font-medium text-blue-500" to="/login">Login</Link>
          </p>
        
        </form>
        
      </div>
    </AuthLayout>
  )
}

export default SignUp

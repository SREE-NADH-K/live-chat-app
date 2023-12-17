import { Link,useNavigate } from "react-router-dom";
import { useState,useContext } from "react";
import { postRequest,baseUrl } from "../utils/service";
import AuthContext from "../Context/AuthContext";

const Register = ()=>{
  const navigate = useNavigate();
const {Setuser} = useContext(AuthContext);

  const [regError,setRegError] = useState({error:false,message:""});
  const [registerUserInfo,registerUser] = useState({
    name:"",
    email:"",
    password:""
  });

  //console.log(registerUserInfo)

  async function handleSubmit(e){
   e.preventDefault();
   let response = await postRequest(`${baseUrl}/user/register`,registerUserInfo);
  //  console.log(response);
   if(response.error){
      setRegError(response);
   }
   else{
    Setuser(response);
    setRegError({error:false,message:""});
     navigate("/chat")
   }
  }

  

    return (
        <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Chat Easy</span>
          <span className="title">Register</span>
          <form noValidate onSubmit={handleSubmit}>
            <input required type="text" placeholder="display name" onChange={(e)=>{registerUser({...registerUserInfo,name:e.target.value})}} />
            <input required type="email" placeholder="email" onChange={(e)=>{registerUser({...registerUserInfo,email:e.target.value})}} />
            <input required type="password" placeholder="password" onChange={(e)=>{registerUser({...registerUserInfo,password:e.target.value})}} />
            {/* <input required style={{ display: "none" }} type="file" id="file" />
            <label htmlFor="file">
              <img src={Add} alt="" />
              <span>Add an avatar</span>
            </label> */}
            <button>Sign up</button>
          </form>
          <p>
            You do have an account? <Link to="/login">Login</Link>
          </p>
          {regError.error && <p style={{color:"red"}} >{regError.message}</p>}
        </div>
      </div>
    )
}

export default Register;
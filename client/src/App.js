
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Chat from "./Pages/Chat";
import {Routes,Route,Navigate }from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./Context/AuthContext";




function App() {

  const {User} = useContext(AuthContext);
  //console.log(User);

  return (
  
     <Routes>
     <Route path="/chat" element={User?<Chat/>:<Login/>} />
     <Route path="/login" element={ User?<Chat/>:<Login/>} />
     <Route path="/" element={ User ? <Chat/> :<Register/>} />
     <Route path="*" element={<Navigate to="/"/>}/>
     </Routes>
  );
}

export default App;

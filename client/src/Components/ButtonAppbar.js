import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';



export default function ButtonAppBar() {
 const navigate = useNavigate();
const {User,logout} = useContext(AuthContext);
  const  {name}  = User;

  return (
    <Box className="bar" sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar  className='toolbar'>    
          <span className='nav-logo'>Chat Easy</span>
          <span id='name'>{name}</span>
          <div>
         <Button color="inherit" onClick={logout} >Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

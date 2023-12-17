import {Badge, Box, Typography } from "@mui/material"


const UserDiv = ({item,onlineUsers})=>{
    return (
        <Badge sx={{marginInline:"10px"}} variant="dot" invisible={!onlineUsers.some((obj)=>obj.userId===item.id)} color="success">
                <Typography sx={{bgcolor:"#6495ED",display:"flex",padding:"5px",borderRadius:"10px"}}align="center">{item.name}</Typography>
        </Badge>
    )
}

export default UserDiv;
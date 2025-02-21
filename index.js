const express=require("express");
const os=require("os");

const app=express();
const PORT=3000||process.env.PORT;
app.use(express.json());
app.listen(PORT,()=>{console.log(`Server running on port ${PORT} and host: ${os.hostname()}`)});

app.get("/",(req,res)=>{
console.log("hostname:",os.hostname());
res.status(200).json(`Server on Host ${os.hostname():${PORT}}`);
})


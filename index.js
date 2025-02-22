const express=require("express");
const os=require("os");

const app=express();
const PORT=3000||process.env.PORT;
app.use(express.json());
app.listen(PORT,()=>{console.log(`Server running on port ${PORT} and host: ${os.hostname()}`)});

app.get("/",(req,res)=>{
console.log("hostname:",os.hostname());
res.status(200).json(`Server on Host ${os.hostname()}:${PORT}`);
})

app.get("/heavytask",(req,res)=>{
let sum=0;
for (let i=0;i<=10000000000;i++){
sum+=i;
}
res.status(200).json(`sum is ${sum} given by ${os.hostname()}`);
})

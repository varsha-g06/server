import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.js";
import productRoutes from "./routes/product.js";
var app = express();
const PORT = 3000;

app.use(express.json());
//Allow only port 5173
app.use(cors({origin:"http://localhost:5173"}));
//To allow everyone
// app.use(cors());

mongoose.connect("mongodb+srv://admin:admin12345@cluster0.jhunjyv.mongodb.net/tododb").then
((res)=>{
    if (res.STATES.connected === 1){
        console.log(`Connected to MongoDB ${res.connection.name} !`)
    } else{
        console.log("Error connecting MongoDB!")
    }
}).catch((error)=>{console.log(error)});

var todoTaskSchema=mongoose.Schema({
    id:Number,
    taskName:String
});


var TodoTaskModel=mongoose.model("todotasks",todoTaskSchema)
app.use("/api/auth",authRouter)
 app.use("/api", productRoutes);
//GET http://localhost:3000/tasks/1 
app.get("/tasks",(req,res)=>{
    console.log("GET:Task")
    TodoTaskModel.find()
    .then((data)=>{console.log(data);res.json(data)})
    .catch((error)=>{
        console.log(error);
        res.json({type:"error",message:error.message});})
})

app.post("/tasks",(req,res)=>{
    var taskData=req.body;
    if(!taskData.taskName){
        res.json({type:"error",message:"Enter Task!"})
    }else{
      var newTask= new TodoTaskModel(
        {
            id:Date.now(),
            taskName:taskData.taskName
        }
        )
        newTask.save()
        .then((data)=>{res.json(data)})
    .catch((error)=>{
        console.log(error);
        res.json({type:"error",message:error.message});})
    }
})

app.put("/tasks/:id",(req,res)=>{
//    req.params.id
//    var taskData = req.body;
   TodoTaskModel.findOneAndUpdate({id:req.params.id},req.body,{new:true})
    .then((data)=>{res.json(data)})
    .catch((error)=>{
        console.log(error);
        res.json({type:"error",message:error.message});})
})

 app.delete("/tasks/:id",(req,res)=>{
    TodoTaskModel.findOneAndDelete({id:req.params.id})
    .then((data)=>{
        console.log(data)
        res.json(data)})
    .catch((error)=>{
        console.log(error);
        res.json({type:"error",message:error.message});});
 })

 
app.listen(PORT,()=>{
    console.log(`Server listening on port#  ${PORT}`);
})

import Task from "../models/task.model";
import { Request, Response } from "express";

//[GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
  // find
  interface Find {
    deleted: boolean;
    status?: string;
  }
  const find: Find = {
    deleted: false,
  };
  // status
  if(req.query.status){
    find.status = req.query.status.toString()
  }
  // end status

  // sort
  const sort = {}
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey.toString()]=req.query.sortValue
  }
  // end sort
  const tasks = await Task.find(find).sort(sort);
  res.json(tasks);
};

//[GET] /api/v1/tasks/detail/:id
export const detail = async (req, res) => {
  try {
    const id = req.params.id;

    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json("Can't find!");
  }
};

// // [PATCH] /api/v1/tasks/change-status/:id

// module.exports.changeStatus =async (req,res)=>{
//   try{
//     const id=req.params.id
//     const status = req.body.status

//     await Task.updateOne({
//       _id:id
//     },{
//       status: status
//     })
//     res.json({
//       code:200,
//       message:"Change status successfully"
//     })
//   }catch(error){
//     res.json({
//       code:400,
//       message:error
//     })
//   }
// }
// // [PATCH] /api/v1/tasks/change-multi
// module.exports.changeMulti = async (req,res)=>{
//   try{
//     const {ids,key,value}=req.body

//     switch(key){
//       case "status":
//         await Task.updateMany({
//           _id:{$in:ids}
//         },{
//           status:value
//         })
//         res.json({
//           code:200,
//           message:"Change multi status successfully!"
//         })
//         break

//       case "delete":
//         await Task.updateMany({
//           _id:{$in:ids}
//         },{
//           deleted:true,
//           deletedAt:new Date()
//         })
//         res.json({
//           code:200,
//           message:"Delete multi successfully!"
//         })

//         break

//       default:
//         res.json({
//           code:400,
//           message:"Is not existence!"
//         })
//         break
//     }
//   }catch(error){
//     res.json({
//       code:400,
//       message:"Is not existence!"
//     })
//   }
// }
// // [POST] /api/v1/tasks/create
// module.exports.create = async (req,res)=>{
//   try{
//     req.body.createdBy = req.user.id
//     const task = new Task(req.body)
//     const data= await task.save()
//     res.json({
//       code:200,
//       message:"Create new task successfully!",
//       data:data
//     })
//   }catch(error){
//       res.json({
//         code:400,
//         message:error
//       })
//   }
// }
// // [POST] /api/v1/tasks/edit/:id
// module.exports.edit = async (req,res)=>{
//   try{
//     const id = req.params.id
//     await Task.updateOne({
//       _id:id
//     },req.body)
//     res.json({
//       code:200,
//       message:"Edit task successfully!",
//       data:data
//     })
//   }catch(error){
//       res.json({
//         code:400,
//         message:error
//       })
//   }
// }

// // [POST] /api/v1/tasks/delete/:id
// module.exports.delete = async (req,res)=>{
//   try{
//     const id = req.params.id
//     await Task.updateOne({
//       _id:id
//     },{
//       deleted:true
//     })
//     res.json({
//       code:200,
//       message:"Delete task successfully!",
//       data:data
//     })
//   }catch(error){
//       res.json({
//         code:400,
//         message:error
//       })
//   }
// }

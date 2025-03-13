import paginationHelper from "../../../helpers/pagination";
import searchHelper from "../../../helpers/search";
import Task from "../models/task.model";
import { Request, Response } from "express";

//[GET] /api/v1/tasks
export const index = async (req: Request, res: Response) => {
  // find
  interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp
  }
  const find: Find = {
    deleted: false,
  };
  // status
  if(req.query.status){
    find.status = req.query.status.toString()
  }
  // end status
  //Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.title = objectSearch.regex;
    }

    //End Search
  // sort
  const sort = {}
  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey.toString()]=req.query.sortValue
  }
  // end sort
  let initPagination={
    currentPage:1,
    limitItems:2,
  }
  const countTasks =await Task.countDocuments(find);
  const objectPagination = paginationHelper(initPagination,req.query,countTasks)
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

export const changeStatus =async (req:Request,res:Response)=>{
  try{
    const id: string=req.params.id
    const status: string = req.body.status

    await Task.updateOne({
      _id:id
    },{
      status: status
    })
    res.json({
      code:200,
      message:"Change status successfully"
    })
  }catch(error){
    res.json({
      code:400,
      message:error
    })
  }
}
// // [PATCH] /api/v1/tasks/change-multi
export const changeMulti = async (req:Request,res:Response)=>{
  try{


    const ids: string[]= req.body.ids
    const key: string = req.body.key
    const value: string = req.body.value
    switch(key){
      case "status":
        await Task.updateMany({
          _id:{$in:ids}
        },{
          status:value
        })
        res.json({
          code:200,
          message:"Change multi status successfully!"
        })
        break

      case "delete":
        await Task.updateMany({
          _id:{$in:ids}
        },{
          deleted:true,
          deletedAt:new Date()
        })
        res.json({
          code:200,
          message:"Delete multi successfully!"
        })

        break

      default:
        res.json({
          code:400,
          message:"Is not existence!"
        })
        break
    }
  }catch(error){
    res.json({
      code:400,
      message:"Is not existence!"
    })
  }
}
// // [POST] /api/v1/tasks/create
export const create = async (req:Request,res:Response)=>{
  try{
    // req.body.createdBy = req.user.id
    const task = new Task(req.body)  
    const data= await task.save()
    res.json({
      code:200,
      message:"Create new task successfully!",
      data:data
    })
  }catch(error){
      res.json({
        code:400,
        message:error
      })
  }
}
// // [POST] /api/v1/tasks/edit/:id
// export const edit = async (req,res)=>{
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
// export const delete = async (req,res)=>{
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

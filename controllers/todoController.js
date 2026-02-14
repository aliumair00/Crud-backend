
import Todo from "../models/todoModel.js";
import mongoose from "mongoose";
// CREATE TODP POST API..........
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    // validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description,
    });

    return res.status(201).json({
      success: true,
      message: "todo is created successfully",
      todo,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};


//Get all todos by GetApi....
export const getTodos = async(req,res)=>{
  try{
    //query param
    let {search, sort, page=1, limit=10} = req.query;
    
    page = Number(page);
    limit = Number(limit);

    const query = {}
    //search
     if(search){
      query.title = {$regex: search, $options: "i"}
     }

     //sorting 
     const sortOption = {}
     if(sort === 'asc') {
      sortOption.createdAt = 1
     }
     else{
      sortOption.createdAt = -1
     }
     //pagination
     const skip = (page-1) * limit; 

     const todos = await Todo.find(query)
     .sort(sortOption)
     .skip(skip)
     .limit(limit)

     const TotalTodos = await Todo.countDocuments(query)
    
     return res.status(200).json({
      success: true,
      message: "todos fetched successfully",
      total: TotalTodos,
      page,
      limit,
      data: todos
     })
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    })
  }

};

// GET single todo by id
export const getTodoById = async (req, res) => {
  try{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid todo id",
      })
    }

    const todo = await Todo.findById(id);
    if(!todo){
      return res.status(404).json({
        success: false,
        message: "todo not found",
      })
    }
    return res.status(200).json({
      success: true,
      message: "todo fetched successfully",
      data: todo,
    })

  }catch(error){
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    })

  }
}

// update todo by id API..........
export const updateTodoById = async (req, res) => {
  try{
    const { id } = req.params;
    const {title , description} = req.body;
  
    // title validation
   if(!title || title.trim()===""){
    return res.status(400).json({
      success:false,
      message:"title is required",
    })
   }
   // id validation
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid todo id",
      })
    }
    // update todo
    const todo = await Todo.findByIdAndUpdate(id, 
      {
      title: title.trim(),
      description,
    },
     {new: true, runValidators: true}
    )
    // check if todo not exists
    if(!todo){
      return res.status(404).json({
        success: false,
        message: "todo not found",
      })
    }
    // success response
    return res.status(200).json({
      success: true,
      message: "todo updated successfully",
      data: todo,
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    })
  }
}

//toogle todo status by patch API..........
export const toggleTodoStatus = async (req, res) => {
  try{
    const { id } = req.params;
    // id validation
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid todo id",
      })
    }
    // toggle todo status
    const todo = await Todo.findById(id);
    if(!todo){
      return res.status(404).json({
        success: false,
        message: "todo not found",
      })
    }
    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    // success response
    return res.status(200).json({
      success: true,
      message: "todo status toggled successfully",
      data: todo,
    })

  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    })
  }
}

export const deleteTodoById = async (req, res) => {
  try{
    const { id } = req.params;
    // id validation
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({
        success: false,
        message: "Invalid todo id",
      })
    }
    const todo = await Todo.findByIdAndDelete(id);
    if(!todo){
      return res.status(404).json({
        success: false,
        message: "todo not found",
      })
    }
    return res.status(200).json({
      success: true,
      message: "todo deleted successfully",
      data: todo,
    })

  }
  catch(error){
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    })  

  }
}
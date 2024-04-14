import mongoose, {  model, models, Schema} from "mongoose";

const EmailSchema = new Schema({
    email: {type: String, required:true} ,
});

export const Email = models?.Email || model('Email', EmailSchema);
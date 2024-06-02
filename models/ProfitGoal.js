import mongoose, {  model, models, Schema} from "mongoose";

const ProfitGoalSchema = new Schema({
    goal: {type: Number, required:true} ,
});

export const ProfitGoal = models?.ProfitGoal || model('ProfitGoal', ProfitGoalSchema);
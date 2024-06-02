import {mongooseConnect} from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";
import { ProfitGoal } from "@/models/ProfitGoal";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);
    
    if(method === 'GET'){
        res.json(await ProfitGoal.find());
    }
    
    if(method === "POST") {
        const {goal} = req.body
        const ProfitGoalDoc = await ProfitGoal.create({
          goal,
        });
        res.json(ProfitGoalDoc);
    }

    if(method === 'PUT'){
      const {goal, _id} = req.body
      const ProfitGoalDoc = await ProfitGoal.updateOne({_id}, {
        goal,
      });
      res.json(ProfitGoalDoc);
  }
 
    if(method === 'DELETE'){
        const {_id} = req.query;
        await ProfitGoal.deleteOne({_id:_id});
        res.json('ok');
    }

}
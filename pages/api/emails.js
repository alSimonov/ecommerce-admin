import {  Email } from "@/models/Email";
import {mongooseConnect} from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);
    
    if(method === 'GET'){
        res.json(await Email.find());
    }
    
    if(method === "POST") {
        const {email} = req.body
        const EmailDoc = await Email.create({
            email,
        });
        res.json(EmailDoc);
    }

    if(method === 'PUT'){
      const {email, _id} = req.body
      const EmailDoc = await Email.updateOne({_id}, {
          email,
      });
      res.json(EmailDoc);
  }
 
    if(method === 'DELETE'){
        const {_id} = req.query;
        await Email.deleteOne({_id:_id});
        res.json('ok');
    }

}
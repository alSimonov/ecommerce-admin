import {  Email } from "@/models/Email";
import {mongooseConnect} from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";
import { FeaturedProduct } from "@/models/FeaturedProduct";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);
    
    if(method === 'GET'){
        res.json(await FeaturedProduct.find());
    }
    
    if(method === "POST") {
        const {productId} = req.body
        const FeaturedProductDoc = await FeaturedProduct.create({
          productId,
        });
        res.json(FeaturedProductDoc);
    }

    if(method === 'PUT'){
      const {productId, _id} = req.body
      const FeaturedProductDoc = await FeaturedProduct.updateOne({_id}, {
          productId,
      });
      res.json(FeaturedProductDoc);
  }
 
    if(method === 'DELETE'){
        const {_id} = req.query;
        await FeaturedProduct.deleteOne({_id});
        res.json('ok');
    }

}
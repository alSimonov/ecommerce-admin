import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler (req,res) {
	const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req, res);


  if(method === 'GET'){
 
   
    if (req.query?.title && req.query?.sort) {
        
        let sortSel =  "";
       
        if(req.query?.sort === "date"){
            sortSel =  {sort: { "createdAt" : req.query?.sortVect}};
        } else if (req.query?.sort === "paid"){
            sortSel =  {sort: { "paid" : req.query?.sortVect}};
        }  else if (req.query?.sort === "clientInfo"){
          sortSel =  {sort: { "name" : req.query?.sortVect}};
        } else if (req.query?.sort === "statusOrder"){
          sortSel =  {sort: { "statusOrder" : req.query?.sortVect}};
        }

        const queryDB = { "name": { "$regex": req.query?.title, "$options": "i" } };

      res.json(await Order.find(queryDB, null, sortSel));	
    }
    else if (  req.query?.sort ) {
       
       
        let sortSel =  "";

        if(req.query?.sort === "date"){
          sortSel =  {sort: { "createdAt" : req.query?.sortVect}};
        } else if (req.query?.sort === "paid"){
            sortSel =  {sort: { "paid" : req.query?.sortVect}};
        }  else if (req.query?.sort === "clientInfo"){
          sortSel =  {sort: { "name" : req.query?.sortVect}};
        } else if (req.query?.sort === "statusOrder"){
          sortSel =  {sort: { "statusOrder" : req.query?.sortVect}};
        }

        res.json(await Order.find({}, null, sortSel));	
      }
      else {
       

        res.json(await Order.find().sort({createdAt:-1}));	
      }
    
  }



  if( method === 'PUT') {
    const {name, email, city, postalCode, streetAddress, country, houseNumber, line_items, statusOrder, _id } = req.body;
		await Order.updateOne({_id}, {name, email, city, postalCode, streetAddress, country, houseNumber, line_items, statusOrder});
		res.json(true);
	}
}
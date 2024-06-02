import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler (req,res) {
	const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

	const limitNum = 8;


  if(method === 'GET'){
 
    var skipNum = 0;
		if(req.query?.page){
				skipNum = ( req.query.page - 1 ) * limitNum;
		}

		var objQuery = {};



    
		if(req.query?.count){

      if(req.query?.title){
        
        const queryDB = { "name": { "$regex": req.query?.title, "$options": "i" } };

        res.json( Math.ceil( (await Order.find(queryDB, null, {})).length / limitNum));	


       }else{
        res.json( Math.ceil( (await Order.find({}, null, {})).length / limitNum ) );
      }


		}
		else if (req.query?.title && req.query?.sort) {
        
        let sortSel =  "";
       
        sortSel =  {sort: { [req.query?.sort] : req.query?.sortVect}, skip: skipNum, limit: limitNum};

        const queryDB = { "name": { "$regex": req.query?.title, "$options": "i" } };

      res.json(await Order.find(queryDB, null, sortSel));	
    }
    else if (  req.query?.sort ) {
       
       
        let sortSel =  "";

        sortSel =  {sort: { [req.query?.sort] : req.query?.sortVect}, skip: skipNum, limit: limitNum};

        res.json(await Order.find({}, null, sortSel));	
      }
      else {
       

        res.json(await Order.find().sort({createdAt:-1}, null, { skip: skipNum, limit: limitNum}));	
      }
    
  }



  if( method === 'PUT') {
    const {name, email, city, postalCode, streetAddress, country, houseNumber, line_items, statusOrder, _id } = req.body;
		await Order.updateOne({_id}, {name, email, city, postalCode, streetAddress, country, houseNumber, line_items, statusOrder});
		res.json(true);
	}
}
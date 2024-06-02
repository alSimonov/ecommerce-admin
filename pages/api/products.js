import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res){
	const {method} = req;
	await mongooseConnect();
	await isAdminRequest(req, res);

	const limitNum = 20;



	if( method === 'GET'){

		var skipNum = 0;
		if(req.query?.page){
				skipNum = ( req.query.page - 1 ) * limitNum;
		}

		var objQuery = {};
        
		if(req.query?.filters){
				
				var filtersObj = JSON.parse( req.query?.filters );
				var index;
				var arrTemp = [];
				var bigArrTemp = [ {active: true}, {category: req.query.id, }];
				var nameTemp;
				
				for (const [key, value] of Object.entries(filtersObj)) {
						arrTemp = [];
						for (index = 0; index < value.length; ++index) {
								nameTemp = "properties."+key;
								arrTemp.push({ [nameTemp]:  value[index] });
								// console.log(key, value[index]);
						}
						bigArrTemp.push({"$or" : arrTemp});
				}

				objQuery["$and"] = bigArrTemp;

		}


		if(req.query?.count){

				if(req.query?.id){
						const queryDB = { 
								$and: [ {active: true}, {category: req.query.id, }],
						} ;

						res.json( Math.ceil( (await Product.find(objQuery, null, {})).length / limitNum ) );

				} else if (req.query?.title) {
					

					const queryDB = { "title": { "$regex": req.query?.title, "$options": "i" } };
		
					res.json(Math.ceil( ( await Product.find(queryDB, null, {})).length / limitNum));	
				} else{
						res.json( Math.ceil( (await Product.find({}, null, {})).length / limitNum ) );
				}
		}
		else if (req.query?.id) {
			res.json(await Product.findOne({_id:req.query.id}));
		} else if (req.query?.title) {
        
			let sortSel =  {sort: {'title': -1}, skip: skipNum, limit: limitNum};

			const queryDB = { "title": { "$regex": req.query?.title, "$options": "i" } };

		res.json(await Product.find(queryDB, null, sortSel));	
		}	else {
			res.json(await Product.find({}, null, {sort: {'title': -1}, skip: skipNum, limit: limitNum}));
		}
	}

	
	if(method === 'POST') {
		const {title, description, price, measures, images, category, rate, properties, available, active } = req.body;
		const productDoc = await Product.create({
			title, description, price, measures, images, category, rate, properties, available, active,
		})
		res.json(productDoc);
	}

	if( method === 'PUT') {
		const {title, description, price, measures, images, category, rate, properties, available, active, _id } = req.body;
		await Product.updateOne({_id}, {title, description, price, measures, images, category, rate, properties, available, active});
		res.json(true);
	}

	if(method === 'DELETE') {
		if (req.query?.id) {
			await Product.deleteOne({_id:req.query?.id});
			res.json(true);
		}
	}
}
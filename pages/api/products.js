import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res){
	const {method} = req;
	await mongooseConnect();
    await isAdminRequest(req, res);


	if( method === 'GET'){
		if (req.query?.id) {
			res.json(await Product.findOne({_id:req.query.id}));
		} else {
			res.json(await Product.find());
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
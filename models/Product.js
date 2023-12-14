const {model, Schema, models, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
	title: {type: String, required: true}, 
	description: String,
	price: {type: Number, required: true}, 
	images: [{type: String}],
	category: {type: mongoose.Types.ObjectId, ref:'Category'},
	rate: {type: Number, min: 0, max: 100},
	properties: {type:Object},
});


export const Product = models.Product || model('Product', ProductSchema);
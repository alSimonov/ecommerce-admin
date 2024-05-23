import mongoose, {  model, models, Schema} from "mongoose";

const FeaturedProductSchema = new Schema({
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
});

export const FeaturedProduct = models?.FeaturedProduct || model('FeaturedProduct', FeaturedProductSchema);
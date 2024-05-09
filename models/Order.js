import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  city: String,
  email: String,
  postalCode: String,
  streetAddress: String,
  houseNumber: String,
  country: String,
  paid: Boolean,
  statusOrder: String,
}, {
  timestamps: true,
});

export const Order = models.Order || model('Order', OrderSchema);
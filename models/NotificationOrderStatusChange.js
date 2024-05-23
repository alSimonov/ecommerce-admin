import mongoose, { Schema, model, models } from "mongoose";


const NotificationOrderStatusChangeSchema = new Schema({
	order: {type: mongoose.Types.ObjectId, ref:'Order'},
  email: {type: String, required:true},
  watched: Boolean,
  statusOrder: String,
}, {
  timestamps: true,
});


export const NotificationOrderStatusChange = models.NotificationOrderStatusChange || model('NotificationOrderStatusChange', NotificationOrderStatusChangeSchema);


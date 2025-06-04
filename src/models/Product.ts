import mongoose, { Schema, Types } from "mongoose";

// Kiểu interface dùng khi xử lý dữ liệu từ MongoDB (lean object)
export interface IProduct {
  _id: Types.ObjectId | string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
});

// Lấy ra type document tự động từ schema
type ProductDocument = mongoose.HydratedDocument<IProduct>;

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
export type { ProductDocument };

import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/product";
import mongoose from "mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
export default async function Handle(req, res) {
  const { method } = req;
  mongoose.Promise = clientPromise;
  await isAdminRequest(req, res);
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    }
    res.json(await Product.find());
  }

  if (method === "POST") {
    const { title, description, price, images, selectedCategory, properties } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category: selectedCategory,
      properties,
    });

    res.json(productDoc);
  }

  if (method === "PUT") {
    const { title, description, images, price, _id, selectedCategory, properties } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category: selectedCategory, properties }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
    }
    res.json(true);
  }
}

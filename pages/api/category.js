import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/category";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function categories(req, res) {
  const { method } = req;
  mongoose.Promise = clientPromise;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "POST") {
    try {
      const { name, parentCategory, properties } = req.body;
      const newCategory = await Category.create({
        name,
        parent: parentCategory,
        properties,
      });
      res.json(newCategory);
    } catch (err) {
      res.json(false);
    }
  }

  if (method === "GET") {
    try {
      res.json(await Category.find().populate("parent"));
    } catch (err) {
      res.json(false);
    }
  }

  if (method === "PUT") {
    try {
      const { name, parentCategory, properties, _id } = req.body;
      await Category.updateOne({ _id }, { name, parent: parentCategory, properties });
      res.json("done");
    } catch (err) {
      res.json(false);
    }
  }

  if (method === "DELETE") {
    try {
      if (req.query?._id) {
        await Category.deleteOne({ _id: req.query?._id });
      }
      res.json("Ok");
    } catch (err) {
      res.json(false);
    }
  }
}

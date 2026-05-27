import { Request, Response } from "express";
import DestinationModel from "../models/destinationModel";
import cloudinary from "../config/cloudinary";

export const createDestination = async (req: Request, res: Response) => {
  const { name, slug, description, location, category, pricePerNight } =
    req.body;

  try {
    const files = req.files as Express.Multer.File[];

    const imageUrls: string[] = [];
    for (const file of files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "destinations",
      });
      imageUrls.push(result.secure_url);
    }

    const newDest = new DestinationModel({
      name,
      slug,
      description,
      location,
      category,
      pricePerNight,
      images: imageUrls,
    });

    const savedDest = await newDest.save();
    res.status(201).json({ message: "Success!", data: savedDest });
  } catch (error) {
    res.status(500).json({ message: "Error uploading images!" });
  }
};

export const getAllDestinations = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };

    const destinations = await DestinationModel.find(query);
    res.status(200).json({ data: destinations });
  } catch (error) {
    res.status(500).json({ message: "Failed to get Destinations" });
  }
};

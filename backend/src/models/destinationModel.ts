import mongoose, { Schema, Document, model } from "mongoose";

export interface IDestination extends Document {
  name: string;
  slug: string;
  description: string;
  images: string[];
  location: string;
  category: string;
  pricePerNight: number;
}

const destinationSchema = new Schema<IDestination>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
});

const DestinationModel = model<IDestination>(
  "DestinationModel",
  destinationSchema,
);
export default DestinationModel;

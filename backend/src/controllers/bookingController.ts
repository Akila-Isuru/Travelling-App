import { Request, Response } from "express";
import BookingModel from "../models/bookingModel";
import DestinationModel from "../models/destinationModel";
import { AuthRequest } from "../middleware/auth";
import { populate } from "dotenv";

const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Create Booking

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { destinationId, checkIn, checkOut, guests, specialRequests } =
    req.body;

  try {
    const destination = await DestinationModel.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const nights = calculateNights(checkInDate, checkOutDate);
    if (nights < 1) {
      return res
        .status(400)
        .json({ message: "At least 1 night stay required" });
    }

    const totalPrice = nights * destination.pricePerNight;

    const booking = new BookingModel({
      user: req.user.sub,
      destination: destinationId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      specialRequests: specialRequests || "",
      totalPrice: totalPrice,
      status: "pending",
    });

    const savedBooking = await booking.save();
    await savedBooking.populate("destination", "name location images slug");
    return res
      .status(201)
      .json({ message: "Booking created successfully!", data: savedBooking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: " Failed to create Booking!" });
  }
};

// Get my bookings

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await BookingModel.find({ user: req.user.sub })
      .populate("destination", "name location images slugh pricePerNight")
      .sort({ createdAt: -1 });

    res.status(200).json({ meesage: "Success!", data: bookings });
  } catch (error) {
    res.status(500).json({ meesage: "Failed to get Bookings" });
  }
};

// get booking by id user and admin
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id)
      .populate(
        "destination",
        "name location images slug pricePerNight description",
      )
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is owner or admin
    const isOwner = booking.user._id.toString() === req.user.sub;
    const isAdmin = req.user.roles?.includes("ADMIN");

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ message: "Success", data: booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get booking" });
  }
};

// canel booking user only
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findOne({ _id: id, user: req.user.sub });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already canceled" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        message:
          "Confirmed bookings cannot be canceled. Please contact support.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully!",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// getall bookings admin only
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query: any = {};
    if (status) query.status = status;

    const bookings = await BookingModel.find(query)
      .populate("destination", "name location pricePerNight")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Success",
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get all bookings" });
  }
};

// update booking admin only
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: `Booking ${status} successfully!`,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

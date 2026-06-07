import { Request, Response } from "express";
import BookingModel from "../models/bookingModel";
import DestinationModel from "../models/destinationModel";
import { AuthRequest } from "../middleware/auth";

export const createBooking = async (req: AuthRequest, res: Response) => {
  const {
    destination,
    checkIn,
    checkOut,
    guests,
    specialRequests,
    totalPrice,
  } = req.body;
  try {
    const dest = await DestinationModel.findById(destination);
    if (!dest)
      return res.status(404).json({ message: "Destination not found" });

    const newBooking = new BookingModel({
      user: req.user.sub,
      destination,
      checkIn,
      checkOut,
      guests,
      specialRequests,
      totalPrice,
      itineraryId: req.body.itineraryId || null,
    });

    const saved = await newBooking.save();
    await saved.populate(
      "destination",
      "name slug location images pricePerNight",
    );
    res.status(201).json({ message: "Booking created!", data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await BookingModel.find({ user: req.user.sub })
      .populate("destination", "name slug location images pricePerNight")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await BookingModel.findOne({
      _id: req.params.id,
      user: req.user.sub,
    }).populate("destination", "name slug location images pricePerNight");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to get booking" });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await BookingModel.findOne({
      _id: req.params.id,
      user: req.user.sub,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({ message: "Booking cancelled", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.find()
      .populate("destination", "name slug location images pricePerNight")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const booking = await BookingModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .populate("destination", "name slug location")
      .populate("user", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Status updated", data: booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  pricePerNight: number;
  images: string[];
  createdAt: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

import usersJson from '../../users.json';
import servicesJson from '../../services.json';
import testimonialsJson from '../../testimonials.json';
import faqJson from '../../faq.json';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  address: string;
  preferredService: string;
  assetType: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  role: 'admin' | 'client';
  status: string;
  isPremium?: boolean;
  createdAt: string;
  updatedAt: string;
  assetDetails?: {
    assetType: string;
    quantity: string;
    consignmentValue: number;
    currency: string;
    monthlyCharges: number;
    dateIssued: string;
    securityCode: string;
    storageLocation: string;
  };
  logistics?: {
    transportMethod: string;
    vehicleType: string;
    numberOfVehicles: number;
    securityLevel: string;
    status: string;
  };
  clientImage?: string;
}

export interface Service {
  title: string;
  icon: string;
  desc: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  image: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export const users: User[] = (usersJson as { users: User[] }).users;
export const services: Service[] = servicesJson as Service[];
export const testimonials: Testimonial[] = testimonialsJson as Testimonial[];
export const faqs: FAQ[] = faqJson as FAQ[];

export function authenticateUser(email: string, password: string): User | null {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password) || null;
}

export function getUserByEmail(email: string): User | null {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

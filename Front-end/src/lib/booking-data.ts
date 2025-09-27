export interface BookingData {
  id: string;
  customerName: string;
  service: string;
  datetime: Date;
  status: "booked" | "cancelled";
  amount: number;
  currency: string;
  verified: boolean;
  location?: string;
  notes?: string;
}

export const generateBookingData = (): BookingData[] => {
  const customers = [
    "Emma Thompson",
    "James Wilson",
    "Sofia Rodriguez",
    "Michael Chen",
    "Isabella Brown",
    "Alexander Davis",
    "Olivia Miller",
    "Lucas Garcia",
    "Ava Martinez",
    "Benjamin Lee",
    "Mia Johnson",
    "Noah Anderson",
  ];

  const services = [
    "Premium Spa Package",
    "Business Consultation",
    "Wedding Photography",
    "Interior Design",
    "Personal Training",
    "Luxury Car Rental",
    "Private Chef Service",
    "Event Planning",
    "Language Tutoring",
    "Pet Grooming",
    "House Cleaning",
    "Massage Therapy",
  ];

  const locations = [
    "Downtown Studio",
    "Beverly Hills",
    "Manhattan Office",
    "Westside Location",
    "Central Park",
    "Marina District",
    "Hollywood Hills",
    "Sunset Boulevard",
  ];

  const bookings: BookingData[] = [];

  for (let i = 1; i <= 12; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 30));
    randomDate.setHours(
      9 + Math.floor(Math.random() * 9),
      Math.floor(Math.random() * 60)
    );

    const booking: BookingData = {
      id: `booking-${i.toString().padStart(3, "0")}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      service: services[Math.floor(Math.random() * services.length)],
      datetime: randomDate,
      status: i <= 8 ? "cancelled" : i <= 10 ? "booked" : "booked",
      amount: [75, 150, 250, 450, 720, 1200, 1850][
        Math.floor(Math.random() * 7)
      ],
      currency: "MNT",
      verified: Math.random() > 0.2,
      location: locations[Math.floor(Math.random() * locations.length)],
      notes: Math.random() > 0.7 ? "Special requirements noted" : undefined,
    };

    bookings.push(booking);
  }

  return bookings;
};

export const formatCurrency = (
  amount: number,
  currency: string = "MNT"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

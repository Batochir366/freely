import { CompanyList } from "./CompanyList";

export const BookingListsAdmin = () => {
  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center justify-between">
        <CompanyList />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-600">
          Bookings{" "}
          <p className="text-gray-600 text-sm mt-1">
            List of all bookings in your company
          </p>
        </h1>
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import axiosInstance from "@/utils/axios";

interface Company {
  _id: string;
  name: string;
  description: string;
  location: Array<{
    address: string;
    coordinate: [number, number];
  }>;
  phoneNumber: string;
  category: string[];
  socialMedia: {
    Facebook: string;
    instagram: string;
    website: string;
  };
  images: string[];
  companyLogo: string;
}

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get(
        "/company/get-companies-by-user"
      );
      if (response.data?.success && response.data?.companies) {
        setCompanies(response.data.companies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleEdit = (companyId: string) => {
    router.push(`/admin/settings/${companyId}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-600">
        My Companies{" "}
        <p className="text-gray-600 text-sm mt-1">
          List of all companies in your company
        </p>
      </h1>

      {companies.length === 0 ? (
        <p className="text-gray-500">No companies found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <Card
              key={company._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {company.name}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(company._id)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{company.description}</p>
                  <p className="text-sm text-gray-600">
                    Location: {company.location[0]?.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {company.phoneNumber}
                  </p>
                  {company.socialMedia.website && (
                    <p className="text-sm text-gray-600">
                      Website: {company.socialMedia.website}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CompanyName = ({
  avatarURL,
  name,
}: {
  avatarURL: string | undefined;
  name: string | undefined;
}) => {
  return (
    <div className="bg-black px-4 py-3 flex items-center border-b border-gray-800">
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarURL} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-black text-white">{name}</h1>
      </div>
    </div>
  );
};

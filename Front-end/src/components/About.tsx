import { Card } from "./ui/card";

export const About = ({ description }: { description: string | undefined }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <div className="p-4">
        <h2 className="font-semibold mb-2 text-white">ABOUT THIS PLACE</h2>
        <p className="text-white/80">{description}</p>
      </div>
    </Card>
  );
};

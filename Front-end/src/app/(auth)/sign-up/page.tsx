import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <SignUp routing="hash" signInUrl="/sign-in" />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

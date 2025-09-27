import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import { SignIn } from "@clerk/nextjs";

export default function SigninPage() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <SignIn routing="hash" signUpUrl="/sign-up" />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

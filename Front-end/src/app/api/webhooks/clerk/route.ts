import { Webhook } from "svix";
import { headers } from "next/headers";
import { auth, clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axiosInstance from "@/utils/axios";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { email_addresses, image_url, username, first_name, last_name } =
      evt.data;

    if (!email_addresses || email_addresses.length === 0) {
      console.error("Error: No email addresses found in event data");
      return new Response("Error: No email addresses", { status: 400 });
    }

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      userName: username || "",
      firstName: first_name ?? "",
      lastName: last_name ?? "",
      isAdmin: false,
      photo: image_url,
    };

    try {
      const newUser = await axiosInstance.post("/user/create-user", user);

      if (newUser && newUser.data && newUser.data._id) {
        try {
          const client = await clerkClient();
          if (!id) {
            console.error("Error: No user ID found in event data");
            return new Response("Error: No user ID", { status: 400 });
          }
          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser.data._id,
            },
          });
        } catch (error) {
          console.error("Error updating user metadata:", error);
        }
      } else {
        console.warn("New user or user ID is undefined.");
      }

      return NextResponse.json({
        message: "User created",
        data: newUser.data,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}

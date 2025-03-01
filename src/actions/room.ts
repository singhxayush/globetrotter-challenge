"use server";

import {auth} from "@/auth";
import {getUserByID} from "@/data/user";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

// const getRoom = async(): Pr

// Generate a unique 6-character alphanumeric room key.
// Retries if the generated key already exists.
const generateRoomKey = async (): Promise<string> => {
  let key: string;
  let exists = true;
  while (exists) {
    key = Math.random().toString(36).substring(2, 8);
    const room = await db.room.findUnique({where: {key}});
    if (!room) {
      exists = false;
    }
  }
  return key!;
};

// This server action creates a new room or,
// if one already exists for the user, redirects to it.
export const createRoom = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const user = await getUserByID(session.user.id as string);
  if (!user) {
    console.warn("Stale session detected. Clearing session...");

    return {error: "Invalid user session, re-login."};
  }

  const existingRoom = await db.room.findFirst({
    where: {adminId: session.user.id},
  });

  if (existingRoom) {
    redirect(`/room/${existingRoom.key}`);
  }

  const key = await generateRoomKey();

  await db.room.create({
    data: {
      key,
      adminId: session.user.id!,
    },
  });

  redirect(`/room/${key}`);
};

// This server action deletes a specific room identified by its key.
export const deleteRoom = async (formData: FormData) => {
  const roomId = formData.get("roomId")?.toString();
  // Ensure the user is authenticated and we have a room key.
  const session = await auth();
  if (!session || !session.user || !roomId) {
    redirect("/");
  }

  console.log(
    "Request to delete room-",
    roomId,
    "made by user-",
    session.user.email
  );

  // Delete the room only if it matches the provided key and belongs to the user.
  await db.room.delete({
    where: {key: roomId, adminId: session.user.id},
  });

  // Redirect back to the landing page.
  redirect("/");
};

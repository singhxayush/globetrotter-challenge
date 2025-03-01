"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {cn} from "@/lib/utils";
import {Roboto} from "next/font/google";
import {Button} from "@/components/ui/button";

const font = Roboto({
  subsets: ["cyrillic"],
  weight: "500",
});

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleChange = (value: string) => {
    setRoomId(value);
  };

  const handleSubmit = () => {
    if (roomId.length === 6) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="text-neutral-400 flex flex-col gap-4 w-full sm:h-full h-[80%] items-center justify-center">
      <div
        className={cn(
          "flex items-center flex-wrap text-3xl sm:text-4xl drop-shadow-md",
          font.className
        )}
      >
        <h1 className="header_bg">Enter 6 digit room-id</h1>
      </div>

      <InputOTP maxLength={6} value={roomId} onChange={handleChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button size="lg" className="mt-10" onClick={handleSubmit}>
        Enter
      </Button>
    </div>
  );
};

export default Room;

// import {auth, signOut} from "@/auth";
// import {Button} from "@/components/ui/button";
// import React from "react";

// const Room = async () => {
//   const session = await auth();
//   return (
//     <div className="text-white">
//       {JSON.stringify(session)}
//       <form
//         action={async () => {
//           "use server";
//           await signOut({redirectTo: "/"});
//         }}
//       >
//         <Button type="submit" variant={"classy"}>
//           sign out
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Room;

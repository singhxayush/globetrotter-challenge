import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({label}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col text-clip gap-y-0 items-center justify-center">
      <h1
        className={cn(
          "group flex items-center text-3xl font-semibold text-neutral-700 drop-shadow-md cursor-default",
          font.className
        )}
      >
        Instant Stream
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

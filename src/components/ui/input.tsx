import * as React from "react";
import {useState} from "react";
import {MdOutlineAlternateEmail} from "react-icons/md";
import {VscKey} from "react-icons/vsc";
import {RxPerson} from "react-icons/rx";
import {cn} from "@/lib/utils";
import {RiEyeLine, RiEyeOffLine} from "react-icons/ri";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    icon?: React.ReactNode;
    kind?: "name" | "password" | "email";
  }
>(({className, type, icon, kind, ...props}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-10 pl-[30px] text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {/* Email Icon */}
      {kind === "email" && (
        <span className="absolute inset-y-0 left-2 flex items-center text-muted-foreground">
          <MdOutlineAlternateEmail size={16} />
        </span>
      )}
      {kind === "password" && (
        <span className="absolute inset-y-0 left-2 flex items-center text-muted-foreground">
          <VscKey size={18} />
        </span>
      )}
      {kind === "name" && (
        <span className="absolute inset-y-0 left-2 flex items-center text-muted-foreground">
          <RxPerson size={18} />
        </span>
      )}

      {/* Password Toggle Button */}
      {isPassword ? (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
        >
          {showPassword ? <RiEyeLine size={18} /> : <RiEyeOffLine size={18} />}
        </button>
      ) : (
        icon && (
          <span className="absolute inset-y-0 right-2 flex items-center">
            {icon}
          </span>
        )
      )}
    </div>
  );
});

Input.displayName = "Input";

export {Input};

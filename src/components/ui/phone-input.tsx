import * as React from "react";
import PhoneInputWithCountry, {
  type Country,
  type Props as PhoneInputProps,
  type Value,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";

export type PhoneValue = Value;

type Props = Omit<PhoneInputProps<React.ComponentProps<"input">>, "onChange" | "value"> & {
  value?: PhoneValue;
  onChange?: (value?: PhoneValue) => void;
  className?: string;
  defaultCountry?: Country;
};

const PhoneInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, onChange, defaultCountry = "TZ", ...props }, ref) => {
    return (
      <PhoneInputWithCountry
        {...props}
        ref={ref as never}
        flags={flags}
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        onChange={(value) => onChange?.(value)}
        className={cn("PhoneInput--atomcard", className)}
        numberInputProps={{
          className:
            "PhoneInputInput flex h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60 md:text-sm",
        }}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };

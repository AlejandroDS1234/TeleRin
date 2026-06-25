import type { InputHTMLAttributes } from "react";
import type { InputWithIconBaseProps } from "../../types";

interface InputWithIconProps
  extends InputHTMLAttributes<HTMLInputElement>, InputWithIconBaseProps {}

function InputWithIcon({
  icon,
  register,
  className = "",
  classNamePadre = "",
  ...props
}: InputWithIconProps) {
  return (
    <div className={`relative ${classNamePadre}`}>
      <div className="absolute inset-y-0 left-3 flex items-center text-gray-600 z-10">{icon}</div>
      <input
        autoComplete="off"
        className={`w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`}
        {...props}
        {...register}
      />
    </div>
  );
}

export default InputWithIcon;

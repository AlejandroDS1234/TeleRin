import { ReactNode, InputHTMLAttributes } from "react";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode;
    register?: any;
}

function InputWithIcon({ icon, register, className = "", ...props }: InputWithIconProps) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                {icon}
            </div>
            <input
                className={`w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 ${className}`}
                {...props}
                {...register}
            />
        </div>
    );
}

export default InputWithIcon;
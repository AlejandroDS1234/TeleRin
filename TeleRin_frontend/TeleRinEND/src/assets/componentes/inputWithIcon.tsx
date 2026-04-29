import { ReactNode, InputHTMLAttributes } from "react";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode;
    register?: any;
}

function InputWithIcon({ icon, register, className = "", ...props }: InputWithIconProps) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
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
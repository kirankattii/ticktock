import { type InputHTMLAttributes, type TextareaHTMLAttributes  } from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className">, BaseInputProps {
  as?: "input";
}

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">, BaseInputProps {
  as: "textarea";
}

type Props = InputProps | TextareaProps;

export default function Input(props: Props) {
  const { label, error, required, helperText, className = "", ...rest } = props;
  const isTextarea = props.as === "textarea";

  const baseInputClasses = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputClasses = error 
    ? `${baseInputClasses} border-red-300 focus:border-red-500` 
    : `${baseInputClasses} border-gray-300 focus:border-blue-500`;

  const inputElement = isTextarea ? (
    <textarea
      {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      className={`${inputClasses} resize-none ${className}`}
    />
  ) : (
    <input
      {...(rest as InputHTMLAttributes<HTMLInputElement>)}
      className={`${inputClasses} ${className}`}
    />
  );

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {inputElement}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

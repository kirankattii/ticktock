interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({ 
  size = "md", 
  text, 
  fullScreen = false,
  className = "" 
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center bg-white/80 z-50 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {text && <span className="text-sm text-gray-600">{text}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {spinner}
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

import React from "react";

const Avatar = ({ user, size = "md" }) => {
  if (!user) return null;

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full 
                  bg-indigo-600 dark:bg-indigo-500 text-white font-medium`}
    >
      {getInitials(user.name)}
    </div>
  );
};

export default Avatar;

"use client";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { IconDelete, IconEdit, IconEye } from "../icons";

export interface TableActionProps extends ComponentProps<"button"> {
  icon: "edit" | "delete" | "view";
  url?: string;
}

export function TableAction({ icon, url, ...props }: TableActionProps) {
  const iconVariants = {
    edit: <IconEdit />,
    delete: <IconDelete />,
    view: <IconEye />,
  };
  const router = useRouter();

  const handleActionClick = () => {
    if (url) {
      router.push(url);
      return;
    }
  };

  return (
    <button
      className="size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80"
      onClick={handleActionClick}
      type="button"
      {...props}
    >
      {iconVariants[icon]}
    </button>
  );
}

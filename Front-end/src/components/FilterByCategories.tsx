"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  _id: string;
  name: string;
  icons: string;
};

type CategoryFilterProps = {
  categories: Category[];
  value: string[];
  onChange: (newValue: string[]) => void;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  value,
  onChange,
}) => {
  const toggleSelect = (cat: Category) => {
    const newValue = value.includes(cat._id)
      ? value.filter((id) => id !== cat._id)
      : [...value, cat._id];
    onChange(newValue);
  };

  const selectedNames = categories
    .filter((cat) => value.includes(cat._id))
    .map((cat) => cat.name)
    .join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left overflow-x-scroll"
        >
          {selectedNames.length > 0 ? selectedNames : "Select categories"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        {categories.length > 0 ? (
          <div className="gap-2 max-h-60 overflow-y-auto flex flex-col">
            {categories.map((cat) => {
              const isSelected = value.includes(cat._id);
              return (
                <div
                  key={cat._id}
                  onClick={() => toggleSelect(cat)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-md text-sm cursor-pointer select-none border transition-colors",
                    isSelected
                      ? "bg-accent text-accent-foreground border-primary"
                      : "hover:bg-accent border-muted"
                  )}
                >
                  <span className="text-lg">{cat.icons}</span>
                  <span className="flex-1">{cat.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center">
            No categories available
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
};

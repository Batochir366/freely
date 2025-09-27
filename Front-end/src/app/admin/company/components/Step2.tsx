import { X } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";

import { step2formSchema } from "./formSchema";
import { z } from "zod";
import { useCategory } from "@/app/context/CategoryContext";

type Category = {
  _id: string;
  name: string;
  icons: string;
};

// type Step2Props = {
//   control: Control<typeof step2formSchema>;
//   name: string;
// };

interface Step2Props {
  control: Control<z.infer<typeof step2formSchema>>;
  name: keyof z.infer<typeof step2formSchema>;
}

// const categoryIconsData: Category[] = [
//   { id: 1, name: "Archery", icon: "🏹" },
//   { id: 3, name: "Badminton", icon: "🏸" },
//   { id: 4, name: "Baseball", icon: "⚾" },
//   { id: 5, name: "Basketball", icon: "🏀" },
//   { id: 6, name: "Boxing", icon: "🥊" },
//   { id: 9, name: "Cycling", icon: "🚴" },
//   { id: 13, name: "Football", icon: "⚽" },
//   { id: 14, name: "Golf", icon: "🏌️" },
//   { id: 15, name: "Gymnastics", icon: "🤸" },
//   { id: 18, name: "Ice Hockey", icon: "🏒" },
//   { id: 19, name: "Judo", icon: "🥋" },
//   { id: 20, name: "Karate", icon: "🥋" },
//   { id: 28, name: "Shooting", icon: "🔫" },
//   { id: 35, name: "Swimming pool", icon: "🏊" },
//   { id: 38, name: "Tennis", icon: "🎾" },
//   { id: 41, name: "Volleyball", icon: "🏐" },
//   { id: 44, name: "Wrestling", icon: "🤼" },
//   { id: 47, name: "Art & Craft", icon: "🎨" },
//   { id: 48, name: "Billiards", icon: "🎱" },
//   { id: 49, name: "Board Games", icon: "🎲" },
//   { id: 50, name: "Bowling", icon: "🎳" },
//   { id: 53, name: "Cooking Classes", icon: "👨‍🍳" },
//   { id: 54, name: "Dance", icon: "💃" },
//   { id: 56, name: "Fishing", icon: "🎣" },
//   { id: 58, name: "Hiking", icon: "🥾" },
//   { id: 61, name: "Karaoke", icon: "🎤" },
//   { id: 64, name: "Movie Night", icon: "🎬" },
//   { id: 70, name: "Roller Skating", icon: "🛼" },
//   { id: 82, name: "PC Video Games", icon: "🎮" },
//   { id: 86, name: "Zip Lining", icon: "🌲" },
// ];

export const Step2 = ({ control, name }: Step2Props) => {
  const [search, setSearch] = useState("");

  const { categories } = useCategory();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = categories.filter((c) =>
          field.value.includes(c._id || "")
        );

        const toggleSelect = (cat: Category) => {
          const newValue = field.value.includes(cat._id || "")
            ? field.value.filter((id: string) => id !== cat._id || "")
            : [...(field.value || []), cat._id];
          field.onChange(newValue);
        };

        const remove = (id: string) => {
          field.onChange(field.value.filter((n: string) => n !== id));
        };

        const filtered = categories.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        );

        return (
          <FormItem>
            <div
              style={
                {
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e3e8ffe6 transparent",
                  msOverflowStyle: "none",
                } as React.CSSProperties
              }
              className="flex py-2 gap-2 mb-2 w-full max-w-[500px] max-h-[60px] overflow-x-scroll overflow-y-hidden scrollbar-thin "
            >
              {selected.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center w-min-[200px] w-fit bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-shrink-0"
                >
                  <span className="mr-1">{cat.icons}</span>
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => remove(cat._id)}
                    className="ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#e3e8ffe6] text-sm sm:text-base"
            />

            <div
              style={
                {
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e3e8ffe6 transparent",
                  msOverflowStyle: "none",
                } as React.CSSProperties
              }
              className="max-h-60 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 "
            >
              {filtered.length > 0 ? (
                filtered.map((cat) => {
                  const isSelected = field.value?.includes(cat._id);
                  return (
                    <div
                      key={cat._id}
                      onClick={() => toggleSelect(cat)}
                      className={`flex items-center gap-2 px-2 py-1 border rounded cursor-pointer transition hover:bg-blue-50  ${
                        isSelected
                          ? "bg-blue-100 border-blue-400"
                          : "border-gray-200"
                      }`}
                    >
                      <span className="text-lg">{cat.icons}</span>
                      <span className="text-[#e3e8ffe6]  hover:text-black">
                        {cat.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 col-span-1 sm:col-span-2 text-center">
                  No categories found
                </p>
              )}
            </div>
            <div className="flex w-full items-start">
              <FormMessage />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

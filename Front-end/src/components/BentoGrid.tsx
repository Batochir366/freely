import React from "react";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          image={item.image}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const items = [
  {
    title: "Freedom and Joy",
    description:
      "Embrace life's beautiful moments with open arms and boundless energy.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://www.allprodad.com/wp-content/uploads/2014/01/iStock-1450052495-scaled.jpg"
        alt="Freedom and Joy"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "Aquatic Excellence",
    description:
      "Dive deep into your passion and swim towards your goals with determination.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://i0.wp.com/blog.myswimpro.com/wp-content/uploads/2022/12/freestyle-swimming-stroke-myswimpro-taylor.jpg?fit=2000%2C1500&ssl=1"
        alt="Aquatic Excellence"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "Outdoor Adventures",
    description:
      "Create unforgettable memories under the stars with friends and family.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://www.attwoolls.co.uk/media/catalog/category/easycamptents.jpg"
        alt="Outdoor Adventures"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "The Open Road",
    description:
      "Journey through life's winding paths and discover new horizons on two wheels.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://ek5jbm9x6ox.exactdn.com/wp-content/uploads/2022/10/19025737/Royal_Enfield_Scram_411_shoot_%C2%A9_Stories_of_Bike_2022-45-1.jpg?lossy=1&ssl=1"
        alt="The Open Road"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "Competitive Spirit",
    description:
      "Channel your inner athlete and strive for excellence in every game.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://cdn.britannica.com/50/219150-050-0032E44D/Marc-Andre-Fleury-Vegas-Golden-Knights-Stanley-Cup-Final-2018.jpg"
        alt="Competitive Spirit"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "Mountain Exploration",
    description:
      "Conquer new heights and find inspiration in nature's grandest landscapes.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://cdn.prod.website-files.com/5f50b1a1d93e167ad6648e8a/6086536af4646f4ff8bfcb24_Scott%20Bergsport%20so21%202.jpg"
        alt="Mountain Exploration"
        width={400}
        height={170}
      />
    ),
  },
  {
    title: "Strike and Precision",
    description:
      "Master the art of focus and aim for perfect execution in every attempt.",
    image: (
      <Image
        className="h-[170px] w-full object-cover rounded-xl"
        src="https://images.squarespace-cdn.com/content/v1/5e9e0dfba94cde48f0501a9c/1709916615120-G5Q11MNZKKJYQI9BTOPX/Bowling_Pins_2.jpg"
        alt="Strike and Precision"
        width={400}
        height={170}
      />
    ),
  },
];

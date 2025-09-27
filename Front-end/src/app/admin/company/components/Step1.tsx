import React from "react";
import { Field } from "./Field";
import { Control } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

export const Step1 = ({
  control,
}: {
  control: Control<z.infer<typeof formSchema>>;
}) => {
  return (
    <div className=" flex flex-col w-full gap-2">
      <Field
        placeholder="enter name here"
        inputType={true}
        name="name"
        LabelName="Company name"
        control={control}
      />
      <Field
        placeholder="write about your company"
        inputType={false}
        name="description"
        LabelName="description"
        control={control}
      />

      <Field
        type="number"
        placeholder="enter company price"
        inputType={true}
        name="pricing"
        LabelName="Price"
        control={control}
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Field
          placeholder="enter phone number here"
          inputType={true}
          name="phoneNumber"
          LabelName="Phone number"
          control={control}
        />
        <Field
          placeholder="enter website url here"
          inputType={true}
          name="website"
          LabelName="Social media URL"
          control={control}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Field
          placeholder="enter instagram here"
          inputType={true}
          name="instagram"
          LabelName="Instagram"
          control={control}
        />
        <Field
          placeholder="enter facebook here"
          inputType={true}
          name="Facebook"
          LabelName="Facebook"
          control={control}
        />
      </div>
    </div>
  );
};

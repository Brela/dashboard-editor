import React from "react";

const ColorPicker = ({ color, setColor }) => {
  return (
    <div>
      <div className="px-3 flex gap-x-2">
        <section className="relative">
          <input
            id="color-picker"
            className="opacity-0 absolute top-4 mt-1"
            type="color"
            name="primaryColor"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
          <label
            htmlFor="color-picker"
            className="w-8 h-8 rounded-md cursor-pointer block border"
            style={{ background: `${color}` }}
          ></label>
        </section>
      </div>
    </div>
  );
};

export default ColorPicker;

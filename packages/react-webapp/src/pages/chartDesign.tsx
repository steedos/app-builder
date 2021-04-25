import React, { useState } from "react";
import { Renderer, Editor } from "@redash/viz";

const exampleData = {
  columns: [
    { type: "string", name: "Country" },
    { type: "float", name: "Amount" },
  ],
  rows: [
    { Amount: 37.620000000000005, Country: "Argentina" },
    { Amount: 37.620000000000005, Country: "Australia" },
    { Amount: 42.62, Country: "Austria" },
    { Amount: 37.62, Country: "Belgium" },
    { Amount: 190.09999999999997, Country: "Brazil" },
    { Amount: 303.9599999999999, Country: "Canada" },
    { Amount: 46.62, Country: "Chile" },
    { Amount: 90.24000000000001, Country: "Czech Republic" },
    { Amount: 37.620000000000005, Country: "Denmark" },
    { Amount: 41.620000000000005, Country: "Finland" },
    { Amount: 195.09999999999994, Country: "France" },
  ],
};

export function ChartDesign() {
  const [options, setOptions] = useState({ countRows: true });
  return (
    <div>
      <Editor
        type="CHART"
        visualizationName="Example Visualization"
        options={options}
        data={exampleData}
        onChange={setOptions}
      />
      <Renderer type="CHART" options={options} data={exampleData} />
    </div>
  );
}
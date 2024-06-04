interface Transform {
  [dataPath: string]: string;
}

interface Params {
  [parameter: string]: string | number;
}

interface Action {
  actionName: string;
  description: string;
  parameters: Params;
  transform?: Transform; // transforms the output object before the next action
}

interface Hook {
  trigger: string; // e.g. beforeNFTReceiptMinted
  action: Action[];
}

const x: Hook = {
  trigger: "beforeNFTReceiptMinted", // outputted JSON gets included in the NFT metadata
  action: [
    {
      actionName: "fetchDataForNFT",
      description: "Get the lbs CO2 estimate from",
      parameters: {
        endpoint:
          "https://stellarcarbon.com/api/v1/examplethingy/${donation_amount}",
      },
      // Extract the data we want from the response
      transform: {
        "response.data.lbsCO2": "lbsCO2",
        "response.data.meta.name": "name",
      },
    },
    {
      actionName: "math", // outputs { value: number }
      description: "Convert lbs CO2 into tons CO2",
      parameters: {
        multiply: 1000,
      },
    },
    {
      actionName: "rename",
      description: "Change the output value name",
      parameters: {
        value: "tonsCO2",
      },
    },
  ],
};

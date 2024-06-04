import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { getRegistryBaseUrl } from '../src/init';
import { ActionTypes, Triggers } from '../src/types';
import { CreateStoryParameters, Story } from '../src/actions/createStory';

const handlers = [
  http.get(`${getRegistryBaseUrl()}/test`, () => {
    return HttpResponse.json({ message: "Hello test!" })
  }),
  http.get(`${getRegistryBaseUrl()}/hooks`, ({ request }) => {
    const url = new URL(request.url);
    const trigger = url.searchParams.get("triggerName");
    const orgId = url.searchParams.get("orgId");
    if (orgId === 'stellar' && trigger === Triggers.onceDaily) {
      return HttpResponse.json(stellarRetirementHook);
    }
    return trigger === Triggers.addMetadataToNFTReceipt
      ? HttpResponse.json(addMetadataToNFTReceiptHook)
      : HttpResponse.json(onceDailyHook)
  }),
  http.post(`${getRegistryBaseUrl()}/stories`, async ({ request }) => {
    const data = await request.formData();
    // console.log({ data });
    const parameters = {} as Story;
    parameters.organizationId = data.get("organizationId") as string;
    parameters.initiativeId = data.get("initiativeId") as string;
    parameters.name = data.get("name") as string;
    parameters.description = data.get("description") as string;
    parameters.image = data.get("image") as string;
    parameters.amount = Number(data.get("amount"));
    parameters.metadata = JSON.parse(data.get("metadata") as string);
    // parameters.files = data.getAll("files").map((file: any) => file as File);

    const story = {
      ...parameters,
      tokenId: "1234",
      image: "QmNvTh8ZRjcYZM5TtY41HXmdfXcB5vZpctBFLeTJugTJHV",
      created: "2024-04-02T20:46:36.986Z",
      id: "366d09a1-a1af-4f38-9938-5a25bf4ea031",
    }

    return HttpResponse.json(story);
  }),
  http.get(`https://api-beta.stellarcarbon.io/carbon-quote?carbon_amount=1`, () => {
    return HttpResponse.json({
      "carbon_amount": "1",
      "total_cost": "20",
      "average_price": "20"
    });
  }),
  http.get(`https://api-beta.stellarcarbon.io/registry/retirements`, ({ request }) => {
    const url = new URL(request.url);
    const address = url.searchParams.get("for_address");
    const date = url.searchParams.get("date_gte");
    const wrongAddress = address !== "GC53JCXZHW3SVNRE4CT6XFP46WX4ACFQU32P4PR3CU43OB7AKKMFXZ6Y";
    // should mock date as 5/1/23
    const wrongDate = Number(date) !== +new Date("2023-04-30");
    if (wrongAddress || wrongDate) {
      return HttpResponse.json({ "retirements": [] });
    }
    return HttpResponse.json(retirementData);
  })
];

const server = setupServer(...handlers);

const addMetadataToNFTReceiptHook = {
  trigger: Triggers.addMetadataToNFTReceipt,
  actions: [
    {
      actionDefinition: {
        key: "carbonCreditQuote",
        action: ActionTypes.fetchDataFromApi,
        parameters: {
          body: null,
          method: "GET",
          headers: null,
          endpoint: "https://api-beta.stellarcarbon.io/carbon-quote?carbon_amount=1"
        },
        description: "Get the lbs CO2 estimate"
      }
    },
    {
      actionDefinition: {
        key: "tonsCO2",
        action: ActionTypes.math,
        parameters: {
          inputA: 'input.amountUSD',
          inputB: 'carbonCreditQuote.total_cost',
          operation: 'divide'
        },
        description: "Convert lbs CO2 into tons CO2"
      }
    },
    {
      actionDefinition: {
        key: "output",
        action: ActionTypes.transform,
        parameters: {
          'tonsCO2': "tonsCO2",
          'input.walletAddress': "walletAddress",
        },
        description: "Set the NFT metadata"
      }
    }
  ],
}

const onceDailyHook = {
  trigger: Triggers.onceDaily,
  actions: [
    {
      actionDefinition: {
        key: "inputValues",
        action: ActionTypes.inputValues,
        parameters: {
          array: [
            { key: "userId", value: "1234" },
            { key: "walletAddress", value: "0xABCD" },
            { key: "walletAddressChain", value: "ETH" },
            { key: "amountUSD", value: "20" }
          ],
          string: "Hello world",
          number: 1234,
          boolean: true,
        }
      }
    },
    {
      actionDefinition: {
        key: "transformEach",
        action: ActionTypes.transformEach,
        parameters: {
          collectionPath: "inputValues.array",
          transformParameter: {
            value: "amount",
          }
        },
        description: "Set the NFT metadata"
      }
    },
    {
      actionDefinition: {
        key: "createStories",
        action: ActionTypes.createStories,
        parameters: {
          organizationId: "org_123",
          initiativeId: "init_123",
          storyPath: "transformEach",
        },
        description: "Set the NFT metadata"
      }
    }
  ]
}

const stellarRetirementHook = {
  trigger: Triggers.onceDaily,
  actions: [
    {
      actionDefinition: {
        key: "yesterday",
        action: ActionTypes.math,
        parameters: {
          inputA: "input.date",
          inputB: 24 * 60 * 60 * 1000,
          operation: "subtract"
        }
      },
    },
    {
      actionDefinition: {
        key: "retirements",
        action: ActionTypes.fetchDataFromApi,
        parameters: {
          body: null,
          method: "GET",
          headers: null,
          endpoint: `https://api-beta.stellarcarbon.io/registry/retirements?for_address={input.walletAddress}&date_gte={yesterday}`
        }
      }
    },
    {
      actionDefinition: {
        key: "transformedStories",
        action: ActionTypes.transformEach,
        parameters: {
          collectionPath: "retirements.retirements",
          transformParameter: {
            "retirement_beneficiary": "metadata.walletAddress",
            "certificate_id": "metadata.certificateId",
            "retirement_date": "metadata.retirementDate",
            "serial_numbers": "metadata.serialNumbers",
            "vcs_id": "metadata.vcsId",
          }
        },
        description: "Set the NFT metadata"
      }
    },
    {
      actionDefinition: {
        key: "createStories",
        action: ActionTypes.createStories,
        parameters: {
          organizationId: "org_123",
          initiativeId: "init_123",
          storyPath: "transformedStories",
        },
        description: "Set the NFT metadata"
      }
    }
  ]
}

export const retirementData = {
  "total_count": 3,
  "count_exceeded": false,
  "total_amount_retired": 15,
  "retirements": [
    {
      "issuance_date": "2020-03-20",
      "instrument_type": "VCU",
      "vintage_start": "2013-07-01",
      "vintage_end": "2014-06-30",
      "total_vintage_quantity": 97259,
      "vcs_id": "1360",
      "vcs_name": "Forest Management to reduce deforestation and degradation in Shipibo Conibo and Cacataibo Indigenous communities of Ucayali region",
      "vcs_category": "Agriculture Forestry and Other Land Use",
      "vcs_protocol": "VM0015",
      "additional_certifications": "CCB-Gold",
      "region": "Latin America",
      "country": "Peru",
      "vcu_amount": 9,
      "serial_numbers": "8040-449402283-449402291-VCU-042-MER-PE-14-1360-01072013-30062014-1",
      "retirement_date": "2023-05-07",
      "retirement_beneficiary": "GC53JCXZHW3SVNRE4CT6XFP46WX4ACFQU32P4PR3CU43OB7AKKMFXZ6Y via stellarcarbon.io",
      "retirement_details": "stellarcarbon.io d58b08d1cbc27fe931752e4cfcbdfdcfc057b0bf1bd312b05a41c298b7c54f7e 263f997b4a2326df41ec2b346d79cbca4c06d2d72cff381620d39ca3ebe552f4 6854d5fc7690776dddba92fd0754e9f69ce7f5a3d3180373bc77d359d8e83d9f 063d8428b79a080eee39f5a8a39e4e199d43dbfe529a0b402ede160bb997b816 a36ffd373d153cf2e8fda674f5c9da9115d0322c29e1bad6a6c0b96030c09ed6 48d69bb7691c02df2ed5e79a89b7a89f5ae944409dc0450e59cefd5636d3cfc9 2ec3bb8fa3975ee46aa61ed14912c7c26d68e04fe293d388e3579807ec53282e",
      "certificate_id": "188439"
    }
  ]
}

export default server;
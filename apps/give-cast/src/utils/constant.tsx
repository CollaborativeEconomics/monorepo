/** @jsxImportSource frog/jsx */

import { Button, TextInput } from "frog"

const IntentStory = {
  intents: [
    <Button value="Impact" key="impact">
      Read Impact Story
    </Button>,
    <Button value="donate" key="donate">
      Donate
    </Button>,
  ],
}

const IntentNext = {
  intents: [
    <Button value="Next" key="next">
      Next Story
    </Button>,
    <Button value="donate" key="donate">
      Donate
    </Button>,
  ],
}

const IntentFirst = {
  intents: [
    <Button value="Impact" key="impact">
      Go Back to First Frame
    </Button>,
    <Button value="donate" key="donate">
      Donate
    </Button>,
  ],
}

const DonateIntent = {
  intents: [
    <TextInput placeholder="0.00" key="amount" />,
    <Button.Transaction target="/send-ether" key="donate">
      Donate
    </Button.Transaction>,
    <Button value="cancel" key="cancel">
      Go Back
    </Button>,
  ],
}

const ConfirmIntent = {
  intents: [
    <TextInput
      placeholder="Enter email for tax-deductible receipt [optional]"
      key="email"
    />,
    <Button.Transaction target="/send-ether" key="donate">
      Donate
    </Button.Transaction>,
  ],
}

export { IntentStory, IntentNext, IntentFirst, DonateIntent, ConfirmIntent }

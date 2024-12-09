import { createSystem } from "frog/ui"

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem({
  colors: {},
  fonts: {
    default: [
      {
        name: "Poppins",
        source: "google",
        weight: 900,
      },
      {
        name: "Poppins",
        source: "google",
        weight: 400,
      },
    ],
  },
})

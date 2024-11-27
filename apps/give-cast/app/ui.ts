import { createSystem } from 'frog/ui';

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
  colors: {
    nipple: '#F098C6',
    diarrhea: '#655C31',
    jaundice: '#FEDB1D',
    banality: '#F9E1A3',
    death: '#000000',
    angel: '#FFFFFF',
  },
  fonts: {
    default: [
      {
        name: 'Poppins',
        source: 'google',
        weight: 900,
      },
      {
        name: 'Poppins',
        source: 'google',
        weight: 400,
      },
    ],
  },
});

import '../app/globals.css';
import OrganizationCard from '@/components/OrganizationCard';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof OrganizationCard> = {
  title: 'organization/OrganizationCard',
  component: OrganizationCard,
};

export default meta;

type Story = StoryObj<typeof OrganizationCard>;

export const Default: Story = {
  args: {
    organizationId: 'orgId',
  },
};

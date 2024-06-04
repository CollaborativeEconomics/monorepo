import '../app/globals.css'
import OrganizationAvatar from '@/components/OrganizationAvatar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof OrganizationAvatar> = {
  title: 'organization/Avatar',
  component: OrganizationAvatar,
};

export default meta;

type Story = StoryObj<typeof OrganizationAvatar>;

export const Default: Story = {
  args: {
    organizationId: 'orgId',
  },
};

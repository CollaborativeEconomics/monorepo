export enum FormMode {
  New,
  View,
  Edit,
  Delete
}

export interface CategoryItem {
  id: string;
  name: string;
}

export type OrganizationData = {
  name: string;
  slug?: string;
  description: string;
  email: string;
  EIN?: string;
  phone?: string;
  mailingAddress?: string;
  country?: string;
  image?: File;
  background?: File;
  imageUrl?: string;
  backgroundUrl?: string;
  url?: string;
  twitter?: string;
  facebook?: string;
  categoryId?: string;
};

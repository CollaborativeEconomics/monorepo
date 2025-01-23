'use client';
import type { User } from '@cfce/database';
import { ipfsCIDToUrl } from '@cfce/utils';
import Image from 'next/image';
import { v7 as uuidv7 } from 'uuid';
import TextInput from '../../form/textinput';
import { Input, Label } from '../../ui';

type Props = {
  user: User;
};

export function ProfileForm({ user }: Props) {
  const nopic = '/media/nopic.png';

  async function saveImage(file: File) {
    const name = uuidv7();
    const body = new FormData();
    body.append('name', name);
    body.append('folder', 'avatars');
    body.append('file', file);
    const resp = await fetch('/api/upload', { method: 'POST', body });
    const result = await resp.json();
    return result;
  }

  async function handleSaveProfile(formData: FormData) {
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    let image = (formData.get('currentImage') as string) ?? '';
    if (file) {
      const fileUploadResponse = await saveImage(file);
      if (fileUploadResponse.success) {
        image = fileUploadResponse.url ?? '';
      }
    }

    const data = { name, email, image };
    const res = await fetch(`/api/profile/${user.id}`, {
      method: 'post',
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  }

  return (
    <div className="border rounded-md p-8 w-full lg:w-2/4 bg-card">
      <form action={handleSaveProfile}>
        <div className="flex flex-row flex-start items-start rounded-full">
          <Image
            className="mr-8 rounded-full"
            src={user.image ? ipfsCIDToUrl(user.image) : nopic}
            width={100}
            height={100}
            alt="Avatar"
          />
          <div className="flex flex-col flex-start items-start w-full rounded-full gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              className="pl-4 w-full bg-transparent"
              name="name"
              defaultValue={user?.name || ''}
              placeholder="name"
            />
            <Label htmlFor="email">Email</Label>
            <Input
              className="pl-4 w-full bg-transparent"
              name="email"
              defaultValue={user?.email || ''}
              placeholder="email"
            />
            <Label htmlFor="file">Avatar</Label>
            <Input
              type="file"
              name="file"
              // className="mt-4 mr-4 w-[130px] text-wrap"
            />
            <input
              type="hidden"
              name="currentImage"
              value={user?.image || ''}
            />
            {/* <h2>
              Wallet: {user?.wallet ? `${user.wallet.substr(0, 10)}...` : '?'}
            </h2> */}
          </div>
        </div>
        <div className="mt-4 text-right">
          {user && (
            <button
              className="px-8 py-2 bg-blue-700 text-white rounded-full"
              type="submit"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

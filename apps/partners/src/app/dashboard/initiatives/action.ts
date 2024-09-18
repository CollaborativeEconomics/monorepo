'use server';

import { randomString, randomNumber } from '~/utils/random';
import dateToPrisma from '~/utils/dateToPrisma';

async function saveImage(data: { name: string; file: File }) {
  const body = new FormData();
  body.append('name', data.name);
  body.append('file', data.file);
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ipfs`, { method: 'POST', body });
  return resp.json();
}

export async function createInitiative(data: any, orgId: string) {
  if (!data.title || !data.description || !data.image) {
    return { success: false, error: 'Missing required fields' };
  }

  const file = data.image[0];
  const ext = file.type.split('/')[1];
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return { success: false, error: 'Invalid image format' };
  }

  try {
    const image = {
      name: `${randomString()}.${ext}`,
      file: file,
    };

    const resimg = await saveImage(image);
    if (resimg.error) {
      return { success: false, error: `Error saving image: ${resimg.error}` };
    }

    const record = {
      title: data.title,
      description: data.description,
      start: data.start ? dateToPrisma(data.start) : undefined,
      finish: data.finish ? dateToPrisma(data.finish) : undefined,
      defaultAsset: resimg.uri || '',
      organizationId: orgId,
      tag: Number.parseInt(randomNumber(8)),
    };

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/initiative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });

    const result = await resp.json();

    if (result.error || !result.success) {
      return { success: false, error: result.error || 'Unknown error' };
    }

    return { success: true, data: result };
  } catch (ex) {
    console.error(ex);
    return { success: false, error: ex instanceof Error ? ex.message : 'Unknown error' };
  }
}
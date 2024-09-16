// /components/AddStoryForm.tsx
'use client';

import type { Category, Initiative } from '@cfce/database';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Checkbox from '~/components/form/checkbox';
import Select from '~/components/form/select';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { saveFile, saveStory } from './storyActions'; // Server actions

interface AddStoryFormProps {
  orgId: string;
  initiatives: Initiative[];
  categories: Category[];
}

interface FormData {
  initiativeId: string;
  name: string;
  desc: string;
  amount: string;
  image1: FileList;
  image2: FileList;
  image3: FileList;
  image4: FileList;
  image5: FileList;
  media: FileList;
  yesNFT: boolean;
  categoryId: string;
}

export default function AddStoryForm({
  orgId,
  initiatives,
  categories,
}: AddStoryFormProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState('Enter story info and upload images');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const imageFields = watch(['image1', 'image2', 'image3', 'image4', 'image5']);
  const mediaFile = watch('media');

  async function onSubmit(data: FormData) {
    if (!data.name || !data.desc || !data.image1 || !data.initiativeId) {
      setMessage('All required fields must be filled');
      return;
    }

    setButtonDisabled(true);
    setButtonText('WAIT');
    setMessage('Uploading files...');

    const uploadedImages: string[] = [];

    try {
      // Process each image file field
      for (const [i, image] of Object.entries(imageFields)) {
        if (image?.[0]) {
          const imageResponse = await saveFile(image[0]); // Upload image
          if (imageResponse.error) {
            setMessage(`Error uploading image ${i}: ${imageResponse.error}`);
            setButtonDisabled(false);
            return;
          }
          uploadedImages.push(imageResponse.uri); // Store the uploaded image URL
        }
      }

      // Upload media file if present
      let mediaUri;
      if (mediaFile?.[0]) {
        const mediaResponse = await saveFile(mediaFile[0]); // Upload media file
        if (mediaResponse.error) {
          setMessage(`Error uploading media: ${mediaResponse.error}`);
          setButtonDisabled(false);
          return;
        }
        mediaUri = mediaResponse.uri;
      }

      // Create story with uploaded images and media
      const storyData = {
        organizationId: orgId,
        initiativeId: data.initiativeId,
        name: data.name,
        description: data.desc,
        amount: Number.parseInt(data.amount),
        categoryId: data.categoryId,
        image: uploadedImages[0] || '', // Use the first image as the main one
        storyMedia: uploadedImages.slice(1), // The rest of the images
        media: mediaUri || undefined, // Media file if present
      };

      const storyResponse = await saveStory(storyData);
      if (storyResponse.error) {
        setMessage(`Error saving story: ${storyResponse.error}`);
        setButtonDisabled(false);
        return;
      }

      setMessage('Story saved successfully!');
      setButtonText('DONE');
    } catch (error) {
      console.error('Error saving story:', error);
      setMessage('An error occurred while saving the story.');
      setButtonDisabled(false);
    }
  }

  return (
    <div className={styles.mainBox}>
      <form className={styles.vbox} onSubmit={handleSubmit(onSubmit)}>
        {/* Image Upload Inputs */}
        <FileView
          id="image1"
          register={register('image1')}
          width={250}
          height={250}
        />
        <div className={`${styles.hbox} justify-center`}>
          <FileView
            id="image2"
            register={register('image2')}
            width={128}
            height={128}
          />
          <FileView
            id="image3"
            register={register('image3')}
            width={128}
            height={128}
          />
          <FileView
            id="image4"
            register={register('image4')}
            width={128}
            height={128}
          />
          <FileView
            id="image5"
            register={register('image5')}
            width={128}
            height={128}
          />
        </div>

        {/* Media Input */}
        <div>
          <label>Other media (PDF, MP3, MP4, etc.):</label>
          <input
            type="file"
            {...register('media')}
            accept=".pdf,.mp3,.mp4,.webm"
          />
        </div>

        {/* Additional form inputs */}
        <Select
          label="Initiative"
          register={register('initiativeId', { required: true })}
          options={initiatives}
        />
        <Select
          label="Category"
          register={register('categoryId', { required: true })}
          options={categories}
        />
        <TextInput
          label="Title"
          register={register('name', { required: true })}
        />
        <TextArea
          label="Description"
          register={register('desc', { required: true })}
        />
        <TextInput
          label="Estimated Amount Spent"
          register={register('amount', { required: true })}
        />
        <Checkbox
          label="Mint Story NFT"
          register={register('yesNFT')}
          check={true}
        />

        <ButtonBlue text={buttonText} disabled={buttonDisabled} type="submit" />

        {/* Validation error handling */}
        {errors.name && <p className="error">Title is required</p>}
        {errors.desc && <p className="error">Description is required</p>}
        {errors.amount && <p className="error">Amount is required</p>}
      </form>

      <p className="text-center">{message}</p>
    </div>
  );
}

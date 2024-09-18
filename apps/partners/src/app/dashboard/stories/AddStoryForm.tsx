// /components/AddStoryForm.tsx
'use client';

import type { Category, Initiative } from '@cfce/database';
import type { File } from 'formidable';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Checkbox from '~/components/form/checkbox';
import Select from '~/components/form/select';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import FileView from '~/components/form/fileview';
import styles from '~/styles/dashboard.module.css';
import { saveStory } from './actions'; // Update this import

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
  image1: File[];
  image2: File[];
  image3: File[];
  image4: File[];
  image5: File[];
  media: File[];
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

  const initiativesOptions = initiatives.map(initiative => ({
    id: initiative.id,
    name: initiative.title,
  }));

  const categoriesOptions = categories.map(category => ({
    id: category.id,
    name: category.title,
  }));

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

    try {
      const images = [
        data.image1,
        data.image2,
        data.image3,
        data.image4,
        data.image5,
      ]
        .filter(img => img && img.length > 0)
        .map(img => img[0]);

      const media =
        data.media && data.media.length > 0 ? data.media[0] : undefined;

      const storyData = {
        story: {
          name: data.name,
          description: data.desc,
          amount: Number.parseInt(data.amount),
          categoryId: data.categoryId,
        },
        organizationId: orgId,
        initiativeId: data.initiativeId,
        images,
        media,
      };

      const storyResponse = await saveStory(storyData);
      if ('error' in storyResponse) {
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
          options={initiativesOptions}
        />
        <Select
          label="Category"
          register={register('categoryId', { required: true })}
          options={categoriesOptions}
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

        <ButtonBlue text={buttonText} disabled={buttonDisabled} />

        {/* Validation error handling */}
        {errors.name && <p className="error">Title is required</p>}
        {errors.desc && <p className="error">Description is required</p>}
        {errors.amount && <p className="error">Amount is required</p>}
      </form>

      <p className="text-center">{message}</p>
    </div>
  );
}

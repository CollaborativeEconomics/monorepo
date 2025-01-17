'use client';

import type { Category, Initiative } from '@cfce/database';
import React, { useState, type FormEvent } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
//import Checkbox from '~/components/form/checkbox';
import { Checkbox, CheckboxWithText } from '@cfce/components/ui';
import FileView from '~/components/form/fileview';
import Select from '~/components/form/select';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { saveStory } from './actions'; // Update this import

interface AddStoryFormProps {
  userId: string;
  orgId: string;
  initiatives: Initiative[];
  categories: Category[];
}

interface DataForm {
  initiativeId: string;
  categoryId: string;
  name: string;
  description: string;
  amount: string;
  unitvalue: string;
  unitlabel: string;
  image1: File[];
  image2: File[];
  image3: File[];
  image4: File[];
  image5: File[];
  media:  File[];
}

export default function AddStoryForm({
  userId,
  orgId,
  initiatives,
  categories,
}: AddStoryFormProps) {
  // const userId = useAuth();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState('Enter story info and upload images');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DataForm>();

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
  const imgSource = '/media/upload.jpg'

  //const onSubmit: SubmitHandler<DataForm> = async (data: DataForm) => {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const fields = new FormData(form) // simpler but files get passed even if empty
    const data = Object.fromEntries(fields.entries())
    console.log('FORM DATA:', data)
    if (!data.name || !data.description || !data.image1 || !data.initiativeId) {
      setMessage('All required fields must be filled');
      return;
    }

    setButtonDisabled(true);
    setButtonText('WAIT');
    setMessage('Uploading files and saving story...');

    try {
      const images:File[] = [
        data.image1 as File,
        data.image2 as File,
        data.image3 as File,
        data.image4 as File,
        data.image5 as File,
      ].filter(img => img && img.size > 0)
      const mediaFile = data.media as File || undefined
      const media = mediaFile && mediaFile.size > 0 ? mediaFile : undefined

      const storyData = {
        userId: userId,
        story: {
          name: data.name as string,
          description: data.description as string,
          amount: data.amount as string,
          unitvalue: data.unitvalue as string,
          unitlabel: data.unitlabel as string
        },
        categoryId: data.categoryId as string,
        organizationId: orgId,
        initiativeId: data.initiativeId as string,
        images,
        media
      };
      console.log('STORY:', storyData)

      const storyResponse = await saveStory(storyData, true); // TBA
      if ('error' in storyResponse) {
        setMessage(`Error saving story: ${storyResponse.error}`);
        setButtonDisabled(false);
        return;
      }

      setMessage('Story saved successfully!');
      setButtonText('DONE');
    } catch (error) {
      console.error('Error saving story:', error);
      setMessage('An error occurred while saving the story');
      setButtonText('ERROR');
      setButtonDisabled(true);
    }
  };

  return (
    <div className={styles.mainBox}>
      <form className={styles.vbox} onSubmit={onSubmit}>
        {/* Image Upload Inputs */}
        <div className={`${styles.hbox} justify-center`}>
          <FileView
            id="image1"
            width={250}
            height={250}
            source={imgSource}
            register={register("image1")}
          />
        </div>
        <div className={`${styles.hbox} justify-center`}>
          <FileView
            id="image2"
            width={128}
            height={128}
            source={imgSource}
            register={register("image2")}
          />
          <FileView
            id="image3"
            width={128}
            height={128}
            source={imgSource}
            register={register("image3")}
          />
          <FileView
            id="image4"
            width={128}
            height={128}
            source={imgSource}
            register={register("image4")}
          />
          <FileView
            id="image5"
            width={128}
            height={128}
            source={imgSource}
            register={register("image5")}
          />
        </div>

        {/* Media Input */}
        <div>
          <label htmlFor="media">Other media (PDF, MP3, MP4, etc.):</label>
          <input
            type="file"
            id="media"
            {...register('media')}
            accept=".pdf,.mp3,.mp4,.webm"
          />
        </div>

        {/* Additional form inputs */}
        <Select
          name="initiativeId"
          label="Initiative"
          register={register('initiativeId', { required: true })}
          options={initiativesOptions}
        />
        <Select
          name="categoryId"
          label="Category"
          register={register('categoryId', { required: true })}
          options={categoriesOptions}
        />
        <TextInput label="Title" name="name" register={register('name', { required: true })} />
        <TextArea
          label="Description"
          {...register('description', { required: true })}
        />
        <TextInput
          label="Estimated Amount Spent"
          register={register('amount', { required: true })}
        />
        <TextInput
          label="Dollars per unit ($20 per tree, $5 per meal, $150 per wheelchair)"
          register={register('unitvalue')}
        />
        <TextInput
          label="Unit label (tree, meal, wheelchair)"
          register={register('unitlabel')}
        />
        <ButtonBlue
          type="submit"
          text={buttonText}
          disabled={buttonDisabled}
        />
        {/* Validation error handling */}
        {errors.name && <p className="error">Title is required</p>}
        {errors.description && <p className="error">Description is required</p>}
        {errors.amount && <p className="error">Amount is required</p>}
      </form>

      <p className="text-center">{message}</p>
    </div>
  );
}

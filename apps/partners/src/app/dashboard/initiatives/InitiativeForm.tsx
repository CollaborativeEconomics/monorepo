'use client';

import { DatePicker } from '@cfce/universe-components/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import FileView from '~/components/form/fileview';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import { createInitiative } from './action';
import dateToPrisma from '~/utils/DateToPrisma';

type InitiativeFormProps = {
  orgId: string;
};

type FormData = {
  title: string;
  description: string;
  start: string;
  finish: string;
  image: FileList;
};

export default function InitiativeForm({ orgId }: InitiativeFormProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState(
    'Enter initiative info and upload image',
  );

  const today = dateToPrisma()
  const nextMonth = dateToPrisma(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      start: today,
      finish: nextMonth,
    },
  });

  const image = watch('image');

  const onSubmit = async (data: FormData) => {
    console.log('FORM', data)

    if (!data.title || !data.description || !data.image) {
      setMessage('Error: Missing required fields');
      return
    }

    setButtonDisabled(true);
    setButtonText('WAIT');
    setMessage('Saving initiative...');
    try {
      const result = await createInitiative(data, orgId)

      if (result.success) {
        setMessage('Initiative saved successfully');
        setButtonText('DONE');
      } else {
        setMessage(`Error: ${result.error}`);
        setButtonText('SUBMIT');
        setButtonDisabled(false);
      }
    } catch (error) {
      setMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setButtonText('SUBMIT');
      setButtonDisabled(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/*<FileView
        id="imgFile"
        register={register('image', { required: true })}
        source="/media/upload.jpg"
        width={250}
        height={250}
        multiple={false}
      />*/}
      <input type="file" {...register('image')} className="mt-4 w-full" />
      <TextInput label="Title" register={register('title')} />
      <TextArea label="Description" register={register('description')} />
      <DatePicker label="Start Date" register={register('start')} />
      <DatePicker label="End Date" register={register('finish')} />
      <ButtonBlue
        id="buttonSubmit"
        text={buttonText}
        disabled={buttonDisabled}
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </form>
  );
}

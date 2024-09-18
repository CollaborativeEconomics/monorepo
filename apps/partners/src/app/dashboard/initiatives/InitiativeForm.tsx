'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from '@cfce/universe-components/form';
import ButtonBlue from '~/components/buttonblue';
import FileView from '~/components/form/fileview';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import { createInitiative } from './action';

type InitiativeFormProps = {
  orgId: string;
  providers: any[]; // Replace 'any' with the correct type for providers
};

export default function InitiativeForm({
  orgId,
  providers,
}: InitiativeFormProps) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState(
    'Enter initiative info and upload image',
  );

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      start: new Date().toJSON().substr(0, 10),
      finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toJSON()
        .substr(0, 10),
      image: null as FileList | null,
    },
  });

  const image = watch('image');

  const onSubmit = async (data: any) => {
    setButtonDisabled(true);
    setButtonText('WAIT');
    setMessage('Saving initiative...');

    try {
      const result = await createInitiative(data, orgId);
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
      <FileView
        id="imgFile"
        register={register('image')}
        source="/media/upload.jpg"
        width={250}
        height={250}
      />
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

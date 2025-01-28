'use client';

import { DatePicker } from '@cfce/components/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import FileView from '~/components/form/fileview';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import Select from '~/components/form/select'
import dateToPrisma from '~/utils/DateToPrisma';
import { createInitiative } from './action';

type InitiativeFormProps = {
  orgId: string;
};

type FormData = {
  title: string;
  description: string;
  start?: string;
  finish?: string;
  image: FileList;
  unitlabel: string;
  unitvalue: string;
};

export default function InitiativeForm({ orgId }: InitiativeFormProps) {
  //const [providers, setProviders] = useState([])
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState(
    'Enter initiative info and upload image',
  );

  const today = dateToPrisma();
  const nextMonth = dateToPrisma(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  );

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      start: today,
      finish: nextMonth,
      unitvalue: '',
      unitlabel: '',
    },
  });

  const image = watch('image');

/*
  function listCredits() {
    return [
      { id: '0', name: 'No credits' },
      { id: '1', name: 'Carbon credits' },
      { id: '2', name: 'Plastic credits' },
      { id: '3', name: 'Biodiversity credits' }
    ]
  }

  function listProviders() {
    if (!providers) {
      return [{ id: 0, name: 'No providers' }]
    }
    const list = []
    for (let i = 0; i < providers.length; i++) {
      list.push({ id: providers[i].id, name: providers[i].name })
    }
    return list
  }
*/
  
  const onSubmit = async (data: FormData) => {
    console.log('FORM', data);

    if (!data.title || !data.description || !data.image) {
      setMessage('Error: Missing required fields');
      return;
    }
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
        {...register('image')}
        source="/media/upload.jpg"
        width={250}
        height={250}
        multiple={false}
      />
      {/*<input type="file" {...register('image')} className="mt-4 w-full" />*/}
      <TextInput label="Title" {...register('title')} />
      <TextArea label="Description" {...register('description')} />
      <DatePicker label="Start Date" {...register('start')} />
      <DatePicker label="End Date" {...register('finish')} />
      <TextInput label="Dollars per unit ($20 per tree, $5 per meal, $150 per wheelchair)" {...register('unitvalue')} />
      <TextInput label="Unit label (tree, meal, wheelchair)" {...register('unitlabel')} />

{/*
      <Select
        label="Credits"
        register={register('creditType')}
        options={listCredits()}
      />
      {typeof creditType === 'undefined' || creditType === '0' ? (
        ''
      ) : (
        <div className="mb-6 px-12 py-6 bg-slate-700 rounded-lg">
          <Select
            label="Provider"
            register={register('provider')}
            options={listProviders()}
          />
          <TextInput
            label="Description"
            register={register('creditDesc')}
          />
          <TextInput label="Amount to offset one credit" register={register('creditAmount')} />
        </div>
      )}
*/}

      <ButtonBlue
        id="buttonSubmit"
        type="submit"
        text={buttonText}
        disabled={buttonDisabled}
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </form>
  );
}

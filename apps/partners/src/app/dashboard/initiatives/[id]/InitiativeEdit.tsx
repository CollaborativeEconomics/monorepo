'use client';

import { useState } from 'react';
import { Controller, useForm } from "react-hook-form"
import type { Initiative } from "@cfce/database"
import { DatePicker } from '@cfce/components/form';
import ButtonBlue from '~/components/buttonblue';
import FileView from '~/components/form/fileview';
import Select from '~/components/form/select'
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import dateToPrisma from '~/utils/DateToPrisma';
import { editInitiative } from '../action';
import InitiativeStatusSelect from '~/components/InitiativeStatusSelect'

type FormProps = {
  initiative: Initiative 
}

type FormData = {
  initiativeId: string;
  organizationId: string;
  title: string;
  description: string;
  start?: Date;
  finish?: Date;
  image: FileList;
  imageUri?: string;
  defaultAsset?: string;
  status?: number;
};

export default function InitiativeEdit({ initiative }: FormProps) {
  //console.log('INIT', initiative)
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, setMessage] = useState('Enter initiative info and upload image');
  const [initiativeStatus, setInitiativeStatus] = useState(initiative.status||0);
  const iniDate = new Date(initiative.start||new Date().toJSON());
  const endDate = new Date(initiative.finish||new Date().toJSON());
  const { register, handleSubmit, watch, control } = useForm<FormData>({
    defaultValues: {
      title: initiative.title,
      description: initiative.description,
      start: iniDate,
      finish: endDate,
      status: initiative.status || 0
    },
  });

  const image = watch('image');
  const imageSource = initiative.defaultAsset

  const onSubmit = async (data: FormData) => {
    console.log('INIT', initiative)
    data.initiativeId = initiative.id
    data.organizationId = initiative.organizationId
    data.imageUri = initiative.imageUri || undefined
    data.defaultAsset = initiative.defaultAsset || undefined
    data.status = initiativeStatus // from select control
    console.log('FORM', data);

    setButtonDisabled(true);
    setButtonText('WAIT');
    setMessage('Saving initiative...');
    try {
      const result = await editInitiative(data);
      if (result.success) {
        setMessage('Initiative saved successfully');
        setButtonText('DONE');
      } else {
        setMessage(`Error: ${result.error}`);
        setButtonText('SUBMIT');
        setButtonDisabled(false);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setButtonText('SUBMIT');
      setButtonDisabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FileView
        id="imgFile"
        {...register('image')}
        source={imageSource}
        width={250}
        height={250}
        multiple={false}
      />
      {/*<input type="file" {...register('image')} className="mt-4 w-full" />*/}
      <TextInput label="Title" {...register('title')} />
      <TextArea label="Description" {...register('description')} />
      <Controller
        control={control}
        name="start"
        render={({ field }) => (
          <DatePicker
            label="Start Date"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="finish"
        render={({ field }) => (
          <DatePicker
            label="End Date"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />

      <InitiativeStatusSelect 
        status={initiative.status||0}
        handler={val => {
          const newStatus = Number.parseInt(val)
          console.log('STATUS CHANGED', newStatus)
          setInitiativeStatus(newStatus)
        }}
      />
{/*

      <DatePicker label="Start Date"  {...register('start')} onChange={(x)=>{console.log(x)}} />
      <DatePicker label="End Date"  {...register('finish')} onChange={(y)=>{console.log(y)}} />

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

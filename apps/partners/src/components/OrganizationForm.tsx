'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Organization } from '@cfce/database';
import FileView from '~/components/form/fileview';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import type { CategoryItem, OrganizationData, FormMode } from '~/types/data'
import { FormMode as Mode } from '~/types/data'
import { createOrganizationAction, updateOrganizationAction } from '~/app/dashboard/organization/actions';


export default function OrganizationForm({
  id,
  organization,
  categories,
  formMode
}: {
  id?: string;
  organization: OrganizationData;
  categories: CategoryItem[];
  formMode: FormMode
}) {

  async function onSubmit(data:OrganizationData) {
    console.log('SUBMIT', data);

    if (!data.name) {
      showMessage('Name is required');
      return;
    }
    if (!data.email) {
      showMessage('Email is required');
      return;
    }

    showMessage('Saving organization, it may take a while...');
    setButtonState(ButtonState.WAIT);

    try {
      let result = null
      switch(formMode){
        case Mode.New: {
          const useTBA = true;
          result = await createOrganizationAction(data, useTBA);
          break;
        }
        case Mode.Edit: {
          data.imageUrl = organization.imageUrl || ''
          data.backgroundUrl = organization.backgroundUrl || ''
          if(id){
            result = await updateOrganizationAction(id, data);
          }
          break;
        }
        default: break;
      }
      if (result?.success) {
        showMessage('Organization saved');
        setButtonState(ButtonState.DONE);
      } else {
        showMessage(`Error saving organization: ${result?.error}`);
        setButtonState(ButtonState.READY);
      }
    } catch (ex: unknown) {
      console.error(ex);
      showMessage(`Error saving organization: ${(ex as Error).message}`);
      setButtonState(ButtonState.READY);
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');

  function setButtonState(state: number) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('SUBMIT');
        setButtonDisabled(false);
        break;
      case ButtonState.WAIT:
        setButtonText('WAIT');
        setButtonDisabled(true);
        break;
      case ButtonState.DONE:
        setButtonText('DONE');
        setButtonDisabled(true);
        break;
    }
  }

  const [message, showMessage] = useState('Enter organization info and click on submit');
  const imageSource = organization.imageUrl || '/media/upload.jpg'
  const backSource = organization.backgroundUrl || '/media/upload.jpg'

  const { register, handleSubmit, watch } = useForm<OrganizationData>({
    defaultValues: {
      name: organization.name,
      description: organization.description,
      email: organization.email,
      EIN: organization.EIN,
      phone: organization.phone,
      mailingAddress: organization.mailingAddress,
      country: organization.country,
      image: organization.image,
      background: organization.background,
      url: organization.url,
      twitter: organization.twitter,
      facebook: organization.facebook,
      categoryId: organization.categoryId,
    }
  })

  const [
    name,
    description,
    email,
    EIN,
    phone,
    mailingAddress,
    country,
    image,
    background,
    url,
    twitter,
    facebook,
    categoryId,
  ] = watch([
    'name',
    'description',
    'email',
    'EIN',
    'phone',
    'mailingAddress',
    'country',
    'image',
    'background',
    'url',
    'twitter',
    'facebook',
    'categoryId',
  ]);


  return (
    <>
      <form className={styles.vbox} onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center">Organization image</p>
        <FileView
          id="imgFile"
          {...register('image')}
          source={imageSource}
          width={250}
          height={250}
          multiple={false}
          accept="image/jpeg,image/png,image/webp"
        />
        <p className="text-center">Background image</p>
        <FileView
          id="bgFile"
          {...register('background')}
          source={backSource}
          width={500}
          height={250}
          multiple={false}
          accept=".pdf,.mp3,.mp4,.webm"
        />
        <TextInput label="Name" {...register('name')} />
        <TextInput label="Description" {...register('description')} />
        <TextInput label="Email" {...register('email')} />
        <TextInput label="EIN" {...register('EIN')} />
        <TextInput label="Phone" {...register('phone')} />
        <TextInput label="Address" {...register('mailingAddress')} />
        <TextInput label="Country" {...register('country')} />
        <TextInput label="Website" {...register('url')} />
        <TextInput label="Twitter" {...register('twitter')} />
        <TextInput label="Facebook" {...register('facebook')} />
        <Select
          label="Category"
          {...register('categoryId')}
          options={categories}
        />
        <ButtonBlue
          type="submit"
          id="buttonSubmit"
          text={buttonText}
          disabled={buttonDisabled}
        />
      </form>
      <p id="message" className="text-center">
        {message}
      </p>
    </>
  )
}

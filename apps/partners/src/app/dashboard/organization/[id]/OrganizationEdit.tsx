'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Prisma, Organization } from '@cfce/database';
import FileView from '~/components/form/fileview';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { updateOrganizationAction } from '../actions';

interface Category {
  id: string;
  name: string;
}

type EditData = {
  //id: string;
  name: string;
  slug?: string;
  description: string;
  email: string;
  EIN?: string;
  phone?: string;
  mailingAddress?: string;
  country?: string;
  image?: File;
  background?: File;
  imageUrl?: string;
  backgroundUrl?: string;
  url?: string;
  twitter?: string;
  facebook?: string;
  categoryId?: string;
};

export default function OrganizationEdit({
  organization,
  categories
}: {
  organization: Organization;
  categories: Category[];
}) {
  // Sort categories
  const categoryOptions = categories.sort((item1, item2) => {
    if (item1.name.toLowerCase() < item2.name.toLowerCase()) return -1;
    if (item1.name.toLowerCase() > item2.name.toLowerCase()) return 1;
    return 0;
  });

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };

  function getFormData(form: HTMLFormElement) {
    //const data = {} as Prisma.OrganizationUpdateInput;
    const data = {} as EditData
    const formData = new FormData(form);
    //console.log('FORM', formData);
    for (const [name, value] of formData) {
      console.log(name, value);
      //if (name === 'categoryId') {
      //  data.category = { connect: { id: value as string } };
      //} else {
        // @ts-ignore: I hate this
        data[name as string] = value as string;
      //}
    }
    return data;
  }

  //async function onSubmit(data: Prisma.OrganizationUpdateInput) {
  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const data = getFormData(event.currentTarget as HTMLFormElement);
    console.log('SUBMIT', data);
    
    if (!data.name) {
      showMessage('Name is required');
      return;
    }
    if (!data.email) {
      showMessage('Email is required');
      return;
    }

    //data.id = organization.id
    data.imageUrl = organization.image || ''
    data.backgroundUrl = organization.background || ''

    try {
      showMessage('Saving organization to database...');
      setButtonState(ButtonState.WAIT);
      const result = await updateOrganizationAction(organization.id, data);
      if (result.success) {
        setChange(change + 1);
        showMessage('Organization saved');
        setButtonState(ButtonState.DONE);
      } else {
        showMessage(`Error saving organization: ${result.error}`);
        setButtonState(ButtonState.READY);
      }
    } catch (ex: unknown) {
      console.error(ex);
      showMessage(`Error saving organization: ${(ex as Error).message}`);
      setButtonState(ButtonState.READY);
    }
  }

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

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, showMessage] = useState('Enter organization info and click on submit');
  const [change, setChange] = useState(0);

  // Form data
  const { register, watch } = useForm({
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
    },
  });
  const imageSource = organization.image || '/media/upload.jpg'
  const backSource = organization.background || '/media/upload.jpg'

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

  useEffect(() => {
    console.log('Org changed!', change);
  }, [change]);

  return (
    <div className={styles.mainBox}>
      <form className={styles.vbox} onSubmit={onSubmit}>
        <p className="text-center">Organization image</p>
        <FileView
          id="imgFile"
          {...register('image')}
          source={imageSource}
          width={250}
          height={250}
          multiple={false}
        />
        <p className="text-center">Background image</p>
        <FileView
          id="bgFile"
          {...register('background')}
          source={backSource}
          width={500}
          height={250}
          multiple={false}
        />
        <TextInput label="Name" {...register('name')} />
        <TextInput label="Description" {...register('description')} />
        <TextInput label="Email" {...register('email')} />
        <TextInput label="EIN" {...register('EIN')} />
        <TextInput label="Phone" {...register('phone')} />
        <TextInput label="Address" {...register('mailingAddress')} />
        <TextInput label="Country" {...register('country')} />
        {/*<TextInput label="Image (url)" {...register('image')} />*/}
        {/*<TextInput label="Background (url)" {...register('background')} />*/}
        <TextInput label="website" {...register('url')} />
        <TextInput label="Twitter" {...register('twitter')} />
        <TextInput label="Facebook" {...register('facebook')} />
        <Select
          label="Category"
          {...register('categoryId')}
          options={categoryOptions}
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
    </div>
  );
}

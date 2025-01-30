'use client';
import type { Prisma } from '@cfce/database';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';
import { createOrganizationAction } from './actions';

interface Category {
  id: string;
  name: string;
}

export default function AddOrganizationForm({
  categories,
}: {
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
    const data = {} as Prisma.OrganizationCreateInput;
    const formData = new FormData(form);
    //console.log('FORM', formData);
    for (const [name, value] of formData) {
      console.log(name, value);
      if (name === 'categoryId') {
        data.category = { connect: { id: value as string } };
      } else {
        // @ts-ignore: I hate this
        data[name as string] = value as string;
      }
    }
    return data;
  }

  //async function onSubmit(data: Prisma.OrganizationCreateInput) {
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

    try {
      showMessage('Saving organization to database...');
      setButtonState(ButtonState.WAIT);
      const useTBA = true;
      const result = await createOrganizationAction(data, useTBA);
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
  const [message, showMessage] = useState(
    'Enter organization info and click on submit',
  );
  const [change, setChange] = useState(0);

  // Form data
  const { register, watch } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      email: '',
      EIN: '',
      phone: '',
      mailingAddress: '',
      country: '',
      image: '',
      background: '',
      url: '',
      twitter: '',
      facebook: '',
      categoryId: '',
    },
  });
  const [
    name,
    slug,
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
    'slug',
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
        <TextInput label="Name" {...register('name')} />
        <TextInput label="Slug" {...register('slug')} />
        <TextInput label="Description" {...register('description')} />
        <TextInput label="Email" {...register('email')} />
        <TextInput label="EIN" {...register('EIN')} />
        <TextInput label="Phone" {...register('phone')} />
        <TextInput label="Address" {...register('mailingAddress')} />
        <TextInput label="Country" {...register('country')} />
        <TextInput label="Image (url)" {...register('image')} />
        <TextInput label="Background (url)" {...register('background')} />
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

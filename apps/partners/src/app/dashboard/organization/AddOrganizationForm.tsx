'use client';
import type { Category, Prisma } from '@cfce/database';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createOrganizationAction } from '~/actions/createOrganizationAction';
import ButtonBlue from '~/components/buttonblue';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import styles from '~/styles/dashboard.module.css';

export default function AddOrganizationForm({
  categories,
}: {
  categories: Category[];
}) {
  const list = categories.map(it => {
    return { id: it.id, name: it.title };
  });
  const categoryOptions = list.sort((item1, item2) => {
    if (item1.name.toLowerCase() < item2.name.toLowerCase()) return -1;
    if (item1.name.toLowerCase() > item2.name.toLowerCase()) return 1;
    return 0;
  });

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };

  async function onSubmit(data: Prisma.OrganizationCreateInput) {
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
      const result = await createOrganizationAction(data);
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
  const { register, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      slug: '',
      EIN: '',
      country: '',
      description: '',
      image: '',
      background: '',
      phone: '',
      mailingAddress: '',
      url: '',
      twitter: '',
      facebook: '',
      categoryId: '',
    },
  });
  const [
    name,
    email,
    slug,
    EIN,
    country,
    description,
    image,
    background,
    phone,
    mailingAddress,
    url,
    twitter,
    facebook,
    categoryId,
  ] = watch([
    'name',
    'email',
    'slug',
    'EIN',
    'country',
    'description',
    'image',
    'background',
    'phone',
    'mailingAddress',
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
      <form className={styles.vbox}>
        <TextInput label="Name" register={register('name')} />
        <TextInput label="Slug" register={register('slug')} />
        <TextInput label="Description" register={register('description')} />
        <TextInput label="Email" register={register('email')} />
        <TextInput label="EIN" register={register('EIN')} />
        <TextInput label="Phone" register={register('phone')} />
        <TextInput label="Address" register={register('mailingAddress')} />
        <TextInput label="Country" register={register('country')} />
        <TextInput label="Image (url)" register={register('image')} />
        <TextInput label="Background (url)" register={register('background')} />
        <TextInput label="website" register={register('url')} />
        <TextInput label="Twitter" register={register('twitter')} />
        <TextInput label="Facebook" register={register('facebook')} />
        <Select
          label="Category"
          register={register('categoryId')}
          options={categoryOptions}
        />
      </form>
      <ButtonBlue
        id="buttonSubmit"
        text={buttonText}
        disabled={buttonDisabled}
        onClick={() =>
          onSubmit({
            name,
            email,
            slug,
            EIN,
            country,
            description,
            image,
            background,
            phone,
            mailingAddress,
            url,
            twitter,
            facebook,
            category: { connect: { id: categoryId } },
          })
        }
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  );
}

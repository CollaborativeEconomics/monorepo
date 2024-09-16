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

  const { register, handleSubmit } = useForm<
    Prisma.OrganizationCreateInput & { categoryId: string }
  >({
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

  const onSubmit = handleSubmit(
    async (data: Prisma.OrganizationCreateInput) => {
      try {
        showMessage('Saving organization to database...');
        setButtonState(ButtonState.WAIT);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const result = await saveOrganization(formData);

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
    },
  );

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, showMessage] = useState(
    'Enter organization info and click on submit',
  );
  const [change, setChange] = useState(0);

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
          id="buttonSubmit"
          text={buttonText}
          disabled={buttonDisabled}
          type="submit"
        />
      </form>
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  );
}

import { getCategories } from '@cfce/database';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import Dashboard from '~/components/dashboard';
import Select from '~/components/form/select';
import TextInput from '~/components/form/textinput';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';

export async function getServerSideProps({ req, res }) {
  const categories = await getCategories({});
  return { props: { categories } };
}

export default function Page(props) {
  const data = props?.categories || [];
  const list = data.map(it => {
    return { id: it.id, name: it.title };
  });
  const categories = list.sort((item1, item2) => {
    if (item1.name.toLowerCase() < item2.name.toLowerCase()) return -1;
    if (item1.name.toLowerCase() > item2.name.toLowerCase()) return 1;
    return 0;
  });

  async function onSubmit(data) {
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
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body: JSON.stringify(data),
      };
      const saved = await fetch('/api/organization', opts);
      const result = await saved.json();
      if (result.success) {
        setChange(change + 1);
        showMessage('Organization saved');
        setButtonState(ButtonState.DONE);
      } else {
        showMessage(`Error saving organization: ${result.error}`);
        setButtonState(ButtonState.READY);
      }
    } catch (ex) {
      console.error(ex);
      showMessage(`Error saving organization: ${ex.message}`);
      setButtonState(ButtonState.READY);
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };

  function setButtonState(state) {
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
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="New Organization" />
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
            <TextInput
              label="Background (url)"
              register={register('background')}
            />
            <TextInput label="website" register={register('url')} />
            <TextInput label="Twitter" register={register('twitter')} />
            <TextInput label="Facebook" register={register('facebook')} />
            <Select
              label="Category"
              register={register('categoryId')}
              options={categories}
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
                categoryId,
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
      </div>
    </Dashboard>
  );
}

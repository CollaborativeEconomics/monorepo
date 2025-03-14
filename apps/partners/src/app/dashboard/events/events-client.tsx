'use client';
import type {
  Event,
  EventType,
  Initiative,
  OrganizationData,
  Prisma,
} from '@cfce/database';
import { Decimal } from 'decimal.js';
//import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonBlue from '~/components/buttonblue';
import EventView from '~/components/event';
import Checkbox from '~/components/form/checkbox';
import FileView from '~/components/form/fileview';
import Label from '~/components/form/label';
import Select from '~/components/form/select';
import TextArea from '~/components/form/textarea';
import TextFile from '~/components/form/textfile';
import TextInput from '~/components/form/textinput';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import dateToPrisma from '~/utils/DateToPrisma';
import { apiFetch } from '~/utils/api';
import { randomNumber, randomString } from '~/utils/random';
import { saveEvent, uploadToIPFS } from './actions';

type DataFile = { file: File; name: string };
type DataSubmit = {
  initiativeId: string;
  name?: string;
  desc?: string;
  budget?: string;
  unitvalue?: string;
  unitlabel?: string;
  quantity?: string;
  payrate?: string;
  volunteers?: string;
  image?: File[];
  yesNFT?: boolean;
};

function getImageExtension(mime: string) {
  let ext = '';
  switch (mime) {
    case 'image/jpg':
    case 'image/jpeg':
      ext = '.jpg';
      break;
    case 'image/png':
      ext = '.png';
      break;
    case 'image/webp':
      ext = '.webp';
      break;
  }
  return ext;
}

function getMediaExtension(mime: string) {
  let ext = '';
  switch (mime) {
    case 'application/pdf':
      ext = '.pdf';
      break;
    case 'audio/mpeg':
    case 'audio/mp3':
      ext = '.mp3';
      break;
    case 'video/mp4':
      ext = '.mp4';
      break;
    case 'video/mpeg':
      ext = '.mpeg';
      break;
    case 'video/webm':
      ext = '.webm';
      break;
  }
  return ext;
}

interface PageProps {
  organization: OrganizationData;
  events: Event[];
}

export default function Page({ organization, events }: PageProps) {
  console.log('Events org', organization?.id);
  const organizationId = organization?.id || '';
  const initiatives = organization?.initiative || [];
  const selectInitiative = listInitiatives(initiatives);

  function listInitiatives(initiatives: Initiative[]) {
    if (!initiatives) {
      return [{ id: 'null', name: 'No initiatives' }];
    }
    const list = [];
    for (let i = 0; i < initiatives.length; i++) {
      list.push({ id: initiatives[i].id, name: initiatives[i].title });
    }
    return list;
  }

  async function saveImage(data: DataFile) {
    if (!data?.file) {
      return { error: 'no image provided' };
    }
    console.log('IMAGE', data);
    const body = new FormData();
    body.append('name', data.name);
    body.append('file', data.file);
    try {
      const response = await uploadToIPFS(
        `${organization.slug}-event-${data.name}.jpg`,
        data.file,
      );
      return { uri: response };
    } catch (error) {
      console.error('Error uploading image to IPFS', error);
      return { error: 'Error uploading image to IPFS' };
    }
  }

  async function saveMedia(data: DataFile) {
    if (!data?.file) {
      return { error: 'no media provided' };
    }
    console.log('MEDIA', data);
    const body = new FormData();
    body.append('name', data.name);
    body.append('file', data.file);
    body.append('folder', 'media'); // put all media files here (pdf, audio, video) except images
    const resp = await fetch('/api/upload', { method: 'POST', body });
    const result = await resp.json();
    return result;
  }

  function clearForm() {
    setButtonState(ButtonState.READY);
    showMessage('Enter event info and upload image');
  }

  async function onSubmit(data: DataSubmit) {
    if (buttonText === 'DONE') {
      clearForm();
      return;
    }
    showMessage('Processing form...');
    console.log('SUBMIT', data);
    const selectObject = document.getElementById(
      'selectInit',
    ) as HTMLInputElement;
    const selectedInitiative = selectObject?.value;
    console.log(selectedInitiative);
    data.initiativeId = selectedInitiative;

    // Validate data
    if (!data.name) {
      showMessage('Title is required');
      return;
    }
    if (!data.desc) {
      showMessage('Description is required');
      return;
    }
    if (!data.image) {
      showMessage('Image is required');
      return;
    }
    if (!data.initiativeId) {
      showMessage('Initiative is required');
      return;
    }
    const file = data.image[0];
    const ext = getImageExtension(file?.type);
    if (file && !ext) {
      showMessage('Only JPG, PNG and WEBP images are allowed');
      return;
    }

    const imgName = randomString();
    const image = { name: imgName + ext, file };
    const payrate = Number.parseFloat(data.payrate || '0');
    //const event: Omit<Prisma.EventCreateInput, "id" | "created" | "status" | "inactive"> = {
    //const event: Prisma.EventCreateInput = {
    //const event: Event = {
    //const event: Omit<Event, "id" | "created" | "status" | "inactive"> = {
    const event: EventType = {
      organizationid: organizationId,
      initiativeid: data.initiativeId,
      name: data?.name ?? 'Event',
      description: data.desc,
      location: '',
      budget: Number.parseInt(data.budget || '0', 10),
      unitvalue: Number.parseInt(data.unitvalue || '0', 10),
      unitlabel: data.unitlabel || null,
      quantity: Number.parseInt(data.quantity || '0', 10),
      payrate: new Decimal(payrate),
      volunteers: Number.parseInt(data.volunteers || '0', 10),
      voltoearn: payrate > 0,
      image: '',
    };

    try {
      showMessage('Saving image...');
      setButtonState(ButtonState.WAIT);
      const resimg = await saveImage(image);
      console.log('RESIMG', resimg);
      if (resimg.error) {
        showMessage(`Error saving image: ${resimg.error}`);
        setButtonState(ButtonState.READY);
        return;
      }
      if (typeof resimg?.uri === 'string') {
        event.image = resimg.uri; // Main image
      }
      console.log('EVENT', event);
      showMessage('Saving info to database...');
      const resp1 = await saveEvent(event);
      console.log('RESULT1', resp1);
      if (!resp1) {
        showMessage('Error saving event');
        setButtonState(ButtonState.READY);
      } else {
        const eventId = resp1.id;
        events.push(resp1);
        setChange(change + 1);
        showMessage('Event info saved');

        /*
        if(data.yesNFT && eventId){
          showMessage('Event info saved, minting NFT...')
          const eventId = result1.data.id
          console.log('Minting NFT for event', eventId)
          const resMint = await fetch('/api/mint?eventid='+eventId)
          const okNft = await resMint.json()
          console.log('RESULT', okNft)
          if(okNft?.error){
            showMessage('Event saved, error minting NFT')
          } else {
            showMessage('Event saved, NFT minted')
          }
        }
        */
        setButtonState(ButtonState.DONE);
      }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (ex: any) {
      console.error(ex);
      showMessage(`Error saving event: ${ex.message}`);
      setButtonState(ButtonState.READY);
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 };
  const imgSource = '/media/upload.jpg';

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
        setButtonDisabled(false);
        break;
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('SUBMIT');
  const [message, showMessage] = useState('Enter event info and upload image');
  const [change, setChange] = useState(0);
  const { register, watch } = useForm({
    defaultValues: {
      initiativeId: '',
      name: '',
      desc: '',
      budget: '',
      unitvalue: '',
      unitlabel: '',
      quantity: '',
      payrate: '',
      volunteers: '',
      image: undefined,
      yesNFT: false,
    },
  });
  const [
    initiativeId,
    name,
    desc,
    budget,
    unitvalue,
    unitlabel,
    quantity,
    payrate,
    volunteers,
    image,
    yesNFT,
  ] = watch([
    'initiativeId',
    'name',
    'desc',
    'budget',
    'unitvalue',
    'unitlabel',
    'quantity',
    'payrate',
    'volunteers',
    'image',
    'yesNFT',
  ]);

  // Used to refresh list of events after new record added
  useEffect(() => {
    console.log('Events changed!', change);
  }, [change]);

  async function onOrgChange(id: string) {
    console.log('ORG CHANGED', organizationId, 'to', id);
  }

  return (
    <div>
      <Title text="Start a Volunteer-to-Earn Event" />
      <p className={styles.intro}>
        Volunteer-to-Earn Events reward participants with tokens for their
        contribution to make the world a better place. Increase volunteer
        participation in your initiatives with V2E
      </p>
      <div className={styles.mainBox}>
        <form className={styles.vbox}>
          <FileView
            id="image"
            {...register('image')}
            source={imgSource}
            width={250}
            height={250}
          />
          <Select
            id="selectInit"
            label="Initiative"
            {...register('initiativeId')}
            options={selectInitiative}
          />
          <TextInput label="Title" {...register('name')} />
          <TextArea label="Description" {...register('desc')} />
          <TextInput
            label="Estimated Budget for the event (in USD)"
            {...register('budget')}
          />
          <TextInput
            label="Dollars per unit ($20 per tree, $5 per meal, $150 per wheelchair)"
            {...register('unitvalue')}
          />
          <TextInput
            label="Unit label (tree, meal, wheelchair)"
            {...register('unitlabel')}
          />
          <TextInput label="Total units to deliver" {...register('quantity')} />
          <TextInput
            label="Number of volunteers expected to participate"
            {...register('volunteers')}
          />
          <TextInput
            label="Estimated payment to volunteers per unit (in USD)"
            {...register('payrate')}
          />
          <small className="mb-8 text-slate-300">
            * If you leave the payment blank it will not be considered
            Volunteer-to-Earn
          </small>
          {/* <Checkbox label="Mint Event NFT" {...register('yesNFT')} check={false} /> */}
        </form>
        <ButtonBlue
          id="buttonSubmit"
          text={buttonText}
          disabled={buttonDisabled}
          onClick={() =>
            onSubmit({
              initiativeId,
              name,
              desc,
              budget,
              unitvalue,
              unitlabel,
              quantity,
              payrate,
              volunteers,
              image,
              yesNFT,
            })
          }
        />
        <p id="message" className="text-center">
          {message}
        </p>
      </div>
      <div className={styles.listBox}>
        <h1 className="w-full text-center text-2xl my-8">Latest events</h1>
        {events?.length > 0 ? (
          events.map(item => (
            <div className={styles.itemBox} key={item.id}>
              <Link href={`/dashboard/events/${item.id}`}>
                <EventView key={item.id} {...item} />
              </Link>
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl my-24">No events found</h1>
        )}
      </div>
    </div>
  );
}

//import { getOrganizationById, getProviders } from 'utils/registry'
import type { Initiative, Prisma, Provider } from '@cfce/database';
import { DatePicker } from '@cfce/universe-components/form';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InitiativeCard from '~/components/InitiativeCard';
import ButtonBlue from '~/components/buttonblue';
import Dashboard from '~/components/dashboard';
import FileView from '~/components/form/fileview';
import Select from '~/components/form/select';
import TextArea from '~/components/form/textarea';
import TextInput from '~/components/form/textinput';
import Sidebar from '~/components/sidebar';
import Title from '~/components/title';
import styles from '~/styles/dashboard.module.css';
import dateToPrisma from '~/utils/dateToPrisma';
import { randomNumber, randomString } from '~/utils/random';

/*
export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgId = token?.orgId || ''
  if(!orgId){
    return { props: { organization:null, providers:null } }
  }
  const organization = await getOrganizationById(orgId)
  if(!organization){
    return { props: { organization:null, providers:null } }
  }
  const providers = await getProviders()
  //console.log('org', organization)
  return { props: { organization, providers } }
}
*/

//export default function Page({organization, providers}) {
export default function Page() {
  const { data: session, update } = useSession();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [orgId, setOrgid] = useState(session?.orgId || '');

  useEffect(() => {
    async function loadData() {
      const oid = session?.orgId ?? '';
      console.log('GET ORG:', oid);
      const orgResponse = await fetch(`/api/organizations/${oid}`);
      const orgData = await orgResponse.json();
      if (orgData.success) {
        const organization = orgData.data as Prisma.OrganizationGetPayload<{
          include: { initiative: true };
        }>;
        console.log('ORG:', organization);
        setOrgid(oid);
        setInitiatives(organization?.initiative || []);
      }

      const fetchedProvider = await fetch('/api/providers');
      const providerData = await fetchedProvider.json();
      console.log('PRV:', fetchedProvider);
      if (providerData.success) {
        setProviders(providerData.data as Provider[]);
      }
    }
    loadData();
  }, [session?.orgId]);

  function dayFromNow(days: number) {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now.toJSON().substr(0, 10);
  }

  const creditsList = [
    { id: '0', name: 'No credits' },
    { id: '1', name: 'Carbon credits' },
    { id: '2', name: 'Plastic credits' },
    { id: '3', name: 'Biodiversity credits' },
  ];

  const providersList = useMemo(() => {
    if (!providers) {
      return [{ id: '0', name: 'No providers' }];
    }
    const list = [];
    for (let i = 0; i < providers.length; i++) {
      list.push({ id: providers[i].id, name: providers[i].name });
    }
  }, [providers]);

  async function saveImage(data: { name: string; file: File }) {
    console.log('IMAGE', data);
    const body = new FormData();
    body.append('name', data.name);
    body.append('file', data.file);
    const resp = await fetch('/api/ipfs', { method: 'POST', body });
    const result = await resp.json();
    return result;
  }

  async function saveCredit(
    data: {
      creditType: string;
      creditDesc: string;
      creditAmount: string;
      provider: string;
    },
    id: string,
  ) {
    console.log('Save credit', id, data);
    const credit = {
      type: data.creditType,
      description: data.creditDesc,
      currency: 'USD',
      value: data.creditAmount,
      start: dateToPrisma(0),
      providerId: data.provider,
      initiativeId: id,
    };
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf8' },
      body: JSON.stringify(credit),
    };
    const resp = await fetch('/api/credit', opts);
    const result = await resp.json();
    console.log('CREDIT', result);
    return result;
  }

  async function onSubmit(
    data: Omit<
      Prisma.InitiativeCreateInput,
      'slug' | 'defaultAsset' | 'tag' | 'organization'
    > & { image: FileList | null },
  ) {
    console.log('SUBMIT', data);
    // TODO: Validate data
    if (!data.title) {
      showMessage('Title is required');
      return;
    }
    if (!data.description) {
      showMessage('Description is required');
      return;
    }
    if (!data.image) {
      showMessage('Image is required');
      return;
    }
    const file = data.image[0];
    let ext = '';
    switch (file.type) {
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
    if (!ext) {
      showMessage('Only JPG, PNG and WEBP images are allowed');
      return;
    }
    const image = {
      name: randomString() + ext,
      file: file,
    };
    const record = {
      title: data.title,
      description: data.description,
      start: data.start ? dateToPrisma(data.start) : undefined,
      finish: data.finish ? dateToPrisma(data.finish) : undefined,
      defaultAsset: '',
      organizationId: orgId,
      tag: Number.parseInt(randomNumber(8)),
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
        record.defaultAsset = resimg.uri;
      }
      console.log('REC', record);
      showMessage('Saving info to database...');
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body: JSON.stringify(record),
      };
      const resp = await fetch('/api/initiative', opts);
      const result = await resp.json();
      console.log('RESULT', result);
      if (result.error) {
        showMessage(`Error saving initiative: ${result.error}`);
        setButtonState(ButtonState.READY);
      } else if (typeof result?.success === 'boolean' && !result.success) {
        showMessage('Error saving initiative: unknown');
        setButtonState(ButtonState.READY);
      } else {
        // TODO: add to db maybe?
        // if (data.creditType !== '0') {
        //   saveCredit(data, result.id);
        // }
        //if(data.yesNFT){
        // TODO: Save initiative 1155 collection
        //}
        showMessage('Initiative saved');
        setButtonState(ButtonState.DONE);
      }
    } catch (ex) {
      console.error(ex);
      showMessage(
        `Error saving initiative: ${ex instanceof Error ? ex.message : 'Unknown error'}`,
      );
      setButtonState(ButtonState.READY);
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 } as const;
  const imgSource = '/media/upload.jpg';

  function setButtonState(
    state: (typeof ButtonState)[keyof typeof ButtonState],
  ) {
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
    'Enter initiative info and upload image',
  );
  //const {register, watch} = useForm({defaultValues:{creditType:'0'}})
  const { register, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      start: new Date().toJSON().substr(0, 10),
      finish: dayFromNow(30),
      creditType: '0',
      creditDesc: '',
      creditAmount: '',
      provider: '',
      image: null as FileList | null,
    },
  });
  const [
    title,
    description,
    start,
    finish,
    creditType,
    creditDesc,
    creditAmount,
    provider,
    image,
  ] = watch([
    'title',
    'description',
    'start',
    'finish',
    'creditType',
    'creditDesc',
    'creditAmount',
    'provider',
    'image',
  ]);

  console.log('creditType', creditType);

  // async function onOrgChange(id) {
  //   console.log('ORG CHAGED', orgId, 'to', id);
  // }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Create a Funding Initiative" />
        <p className={styles.intro}>
          Creating an initiative allows donors to contribute to a specific
          campaign. This helps get your donors excited about the impact they can
          make, and helps them visualize how they’ll make the world a better
          place!
        </p>
        <div className={styles.mainBox}>
          <form className={styles.vbox}>
            <FileView
              id="imgFile"
              register={register('image')}
              source={imgSource}
              width={250}
              height={250}
            />
            {/*<Label text="Upload Image" className="text-center" />*/}
            <TextInput label="Title" register={register('title')} />
            <TextArea label="Description" register={register('description')} />
            <DatePicker label="Start Date" register={register('start')} />
            <DatePicker label="End Date" register={register('finish')} />
            <Select
              label="Credits"
              register={register('creditType')}
              options={creditsList}
            />
            {typeof creditType === 'undefined' || creditType === '0' ? (
              ''
            ) : (
              <div className="mb-6 px-12 py-6 bg-slate-700 rounded-lg">
                <Select
                  label="Provider"
                  register={register('provider')}
                  options={providersList}
                />
                <TextInput
                  label="Description"
                  register={register('creditDesc')}
                />
                <TextInput
                  label="Amount to offset one credit"
                  register={register('creditAmount')}
                />
              </div>
            )}
            {/*<Checkbox label="Mint Story NFT" register={register('yesNFT')} check={true} />*/}
          </form>

          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                title,
                description,
                start,
                finish,
                // creditType,
                // creditDesc,
                // creditAmount,
                // provider,
                image,
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        {initiatives ? (
          initiatives.map(item => (
            <div className={styles.mainBox} key={item.id}>
              <InitiativeCard key={item.id} {...item} />
            </div>
          ))
        ) : (
          <h1 className="text-center text-2xl my-24">No initiatives found</h1>
        )}
      </div>
    </Dashboard>
  );
}

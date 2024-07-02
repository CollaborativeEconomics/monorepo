import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import Title from 'components/title'
import Initiative from 'components/initiative'
import Label from 'components/form/label'
import TextInput from 'components/form/textinput'
import TextArea from 'components/form/textarea'
import FileView from 'components/form/fileview'
import Select from 'components/form/select'
import Checkbox from 'components/form/checkbox'
import ButtonBlue from 'components/buttonblue'
import styles from 'styles/dashboard.module.css'
//import { getOrganizationById, getProviders } from 'utils/registry'
import { randomString, randomNumber } from 'utils/random'
import dateToPrisma from 'utils/dateToPrisma'
import { apiFetch } from 'utils/api'

type Dictionary = { [key:string]:any }

/*
export async function getServerSideProps({req,res}) {
  const token:Dictionary = await getToken({ req })
  const orgid = token?.orgid || ''
  if(!orgid){
    return { props: { organization:null, providers:null } }
  }
  const organization = await getOrganizationById(orgid)
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
  const { data: session, update } = useSession()
  //const orgid = organization?.id || ''
  //const initiatives = organization?.initiative || []
  const [initiatives, setInitiatives] = useState([])
  const [providers, setProviders] = useState([])
  const [orgid, setOrgid] = useState(session?.orgid || '')

  useEffect(()=>{
    async function loadData(){
      const oid = session?.orgid ?? ''
      console.log('GET ORG:', oid)
      const org = await apiFetch('organization?id='+oid) || {}
      console.log('ORG:', org)
      const prv = await apiFetch('providers') || []
      console.log('PRV:', prv)
      setOrgid(oid)
      setInitiatives(org?.initiative || [])
      setProviders(prv || [])
    }
    loadData()
  },[update])

  function startDate() {
    return new Date().toJSON().substr(0, 10)
  }

  function addDays(days) {
    const now = new Date()
    now.setDate(now.getDate() + days)
    return now.toJSON().substr(0, 10)
  }

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

  async function saveImage(data) {
    console.log('IMAGE', data)
    const body = new FormData()
    body.append('name', data.name)
    body.append('file', data.file)
    const resp = await fetch('/api/ipfs', { method: 'POST', body })
    const result = await resp.json()
    return result
  }

  async function saveCredit(data, id) {
    console.log('Save credit', id, data)
    const credit = {
      type: data.creditType,
      description: data.creditDesc,
      currency: 'USD',
      value: data.creditAmount,
      start: dateToPrisma(0),
      providerId: data.provider,
      initiativeId: id
    }
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf8' },
      body:JSON.stringify(credit)
    }
    const resp = await fetch('/api/credit', opts)
    const result = await resp.json()
    console.log('CREDIT', result)
    return result
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data)
    // TODO: Validate data
    if (!data.title) {
      showMessage('Title is required')
      return
    }
    if (!data.desc) {
      showMessage('Description is required')
      return
    }
    if (!data.image){
      showMessage('Image is required')
      return
    }
    const file = data.image[0]
    let ext = ''
    switch (file.type) {
      case 'image/jpg':
      case 'image/jpeg':
        ext = '.jpg'
        break
      case 'image/png':
        ext = '.png'
        break
      case 'image/webp':
        ext = '.webp'
        break
    }
    if (!ext) {
      showMessage('Only JPG, PNG and WEBP images are allowed')
      return
    }
    const image = {
      name: randomString() + ext,
      file: file
    }
    const record = {
      title: data.title,
      description: data.desc,
      start: dateToPrisma(data.inidate),
      end: dateToPrisma(data.enddate),
      defaultAsset: '',
      organizationId: orgid,
      tag: parseInt(randomNumber(8))
    }
    try {
      showMessage('Saving image...')
      setButtonState(ButtonState.WAIT)
      const resimg = await saveImage(image)
      console.log('RESIMG', resimg)
      if (resimg.error) {
        showMessage('Error saving image: ' + resimg.error)
        setButtonState(ButtonState.READY)
        return
      }
      if (typeof resimg?.uri === "string") {
        record.defaultAsset = resimg.uri
      }
      console.log('REC', record)
      showMessage('Saving info to database...')
      const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf8' },
        body:JSON.stringify(record)
      }
      const resp = await fetch('/api/initiative', opts)
      const result = await resp.json()
      console.log('RESULT', result)
      if (result.error) {
        showMessage('Error saving initiative: ' + result.error)
        setButtonState(ButtonState.READY)
      } else if (typeof result?.success == 'boolean' && !result.success) {
        showMessage('Error saving initiative: unknown')
        setButtonState(ButtonState.READY)
      } else {
        if (data.creditType !== '0') {
          saveCredit(data, result.id)
        }
        //if(data.yesNFT){
          // TODO: Save initiative 1155 collection
        //}
        showMessage('Initiative saved')
        setButtonState(ButtonState.DONE)
      }
    } catch (ex) {
      console.error(ex)
      showMessage('Error saving initiative: ' + ex.message)
      setButtonState(ButtonState.READY)
    }
  }

  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }
  const imgSource = '/media/upload.jpg'

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('SUBMIT')
        setButtonDisabled(false)
        break
      case ButtonState.WAIT:
        setButtonText('WAIT')
        setButtonDisabled(true)
        break
      case ButtonState.DONE:
        setButtonText('DONE')
        setButtonDisabled(true)
        break
    }
  }

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [buttonText, setButtonText] = useState('SUBMIT')
  const [message, showMessage] = useState('Enter initiative info and upload image')
  //const {register, watch} = useForm({defaultValues:{creditType:'0'}})
  const { register, watch } = useForm({
    defaultValues: {
      title: '',
      desc: '',
      inidate: startDate(),
      enddate: addDays(30),
      creditType: '0',
      creditDesc: '',
      creditAmount: '',
      provider: '',
      image: ''
    }
  })
  const [
    title,
    desc,
    inidate,
    enddate,
    creditType,
    creditDesc,
    creditAmount,
    provider,
    image
  ] = watch([
    'title',
    'desc',
    'inidate',
    'enddate',
    'creditType',
    'creditDesc',
    'creditAmount',
    'provider',
    'image'
  ])

  console.log('creditType', creditType)

  async function onOrgChange(id) {
    console.log('ORG CHAGED', orgid, 'to', id)
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <Title text="Create a Funding Initiative" />
        <p className={styles.intro}>Creating an initiative allows donors to contribute to a specific campaign. This helps get your donors excited about the impact they can make, and helps them visualize how they’ll make the world a better place!</p>
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
            <TextArea label="Description" register={register('desc')} />
            <TextInput
              label="Start Date"
              register={register('inidate')}
              type="date"
            />
            <TextInput
              label="End Date"
              register={register('enddate')}
              type="date"
            />
            <Select
              label="Credits"
              register={register('creditType')}
              options={listCredits()}
            />
            {typeof creditType == 'undefined' || creditType == '0' ? (
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
            {/*<Checkbox label="Mint Story NFT" register={register('yesNFT')} check={true} />*/}
          </form>

          <ButtonBlue
            id="buttonSubmit"
            text={buttonText}
            disabled={buttonDisabled}
            onClick={() =>
              onSubmit({
                title,
                desc,
                inidate,
                enddate,
                creditType,
                creditDesc,
                creditAmount,
                provider,
                image
              })
            }
          />
          <p id="message" className="text-center">
            {message}
          </p>
        </div>
        { initiatives ? initiatives.map((item) => (
          <div className={styles.mainBox} key={item.id}>
            <Initiative key={item.id} {...item} />
          </div>
        )) : (
          <h1 className="text-center text-2xl my-24">No initiatives found</h1>
        )}
      </div>
    </Dashboard>
  )
}

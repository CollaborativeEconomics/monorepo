import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Title from 'components/title'
import TextInput from 'components/form/textinput'
import Select from 'components/form/select'
import ButtonBlue from 'components/buttonblue'
import Chains from 'chains'
import styles from 'styles/dashboard.module.css'
import { apiFetch, apiPost } from 'utils/api'

function ContractNFTReceipt(props){
  console.log('PROPS', props)
  const { chain, network, wallet, organizationId, organization } = props
  const contract_type = 'NFTReceipt'
  //const [organization, setOrganization] = useState(null)
  const [initiative, setInitiative] = useState(organization?.initiative[0].id||'')
  const [initialURI, setInitialURI] = useState(organization?.initiative[0].imageUri||'')
  const [buttonText, setButtonText] = useState('NEW CONTRACT')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [message, showMessage] = useState('Enter contract options')
  const ButtonState = { READY: 0, WAIT: 1, DONE: 2 }

  function setButtonState(state) {
    switch (state) {
      case ButtonState.READY:
        setButtonText('NEW CONTRACT')
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

  const { register, watch } = useForm({
    defaultValues: {      
      name: 'Give Credits',
      symbol: 'GIVE',
      baseuri: initialURI,
      initiativeId: initiative
    }
  })

  const [
    name,
    symbol,
    baseuri,
    initiativeId
  ] = watch([
    'name',
    'symbol',
    'baseuri',
    'initiativeId'
  ])

  function listInitiatives() {
    if(!organization || organization.initiative?.length < 1){
      return [{id:'ALL', name:'All initiatives'}]
    }
    const list = organization.initiative?.map(it=>{ return { id: it.id, name: it.title } })
    console.log('LIST', list)
    return list
  }

  async function onSubmit(data) {
    console.log('SUBMIT', data)
    if (!data.chain) {
      showMessage('Chain is required')
      return
    }
    if (!data.wallet) {
      showMessage('Wallet is required')
      return
    }
    try {
      showMessage('Deploying contract, please sign transaction...')
      setButtonState(ButtonState.WAIT)

      // DEPLOY
      const deployer = Chains[chain]?.contracts[contract_type]
      const ok = await deployer?.deploy(data)
      console.log('OK', ok)
      if(!ok || ok?.error){
        showMessage('Error deploying contract: ' + (ok?.error||'Contract not found'))
        setButtonState(ButtonState.READY)
        return
      }
      showMessage('Contract deployed successfully')
      setButtonState(ButtonState.READY)
      // Save to db contracts
      const contract = {
        chain: chain.toLowerCase(),
        network,
        contract_type,
        contract_address: ok?.contractId,
        start_block: ok?.block,
        entity_id: data.initiativeId,
        admin_wallet_address: wallet
      }
      console.log('CTR', contract)
      const saved = await apiPost('contracts', contract)
      console.log('SAVED', saved)
    } catch (ex) {
      console.error(ex)
      showMessage('Error deploying contract: ' + ex.message)
      setButtonState(ButtonState.READY)
    }
  }

  function selectInitiative(selected){
    console.log('SEL', selected)
    setInitiative(selected)
  }

  function setBaseUri(){
    const uri = document?.getElementById('baseUri') as HTMLInputElement
    if(!uri){ return }
    console.log('ID', initiative)
    if(!initiative || !organization || organization.initiative.length<1){ uri.value = ''; return }
    const items = organization.initiative.filter(it=>it.id==initiative)
    console.log('ITEMS',items)
    if(!items || items.length<1){ uri.value = ''; return }
    uri.value = items[0].imageUri
  }

  useEffect(() => {
    async function loadData() {
      console.log('LOAD')
      //console.log('ORGID', organizationId)
      //const org = await apiFetch('organization?id='+organizationId)
      //console.log('ORG', org)
      //setOrganization(org)
      listInitiatives()
      setBaseUri()      
    }
    loadData()
  }, [])

  return (
    <div className={styles.vbox}>
      <Title text="NFT Receipt Contract" />
      <form>
        <div className="">
          <div className="">
            <Select
              label="Initiative"
              register={register('initiativeId')}
              options={listInitiatives()}
              onChange={selectInitiative}
            />
            <TextInput label="Name" register={register('name')} />
            <TextInput label="Symbol" register={register('symbol')} />
            <TextInput label="Image URI" id="baseUri" register={register('baseuri')} />
          </div>
        </div>
      </form>
      <ButtonBlue
        id="buttonSubmit"
        text={buttonText}
        disabled={buttonDisabled}
        onClick={() =>
          onSubmit({
            chain,
            network,
            wallet,
            contract_type,
            name,
            symbol,
            baseuri,
            initiativeId
          })
        }
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  )
}

export default ContractNFTReceipt

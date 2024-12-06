import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Title from 'components/title'
import TextInput from 'components/form/textinput'
import ButtonBlue from 'components/buttonblue'
import Chains from 'chains'
import styles from 'styles/dashboard.module.css'
import { apiPost } from 'utils/api'

/*
interface ContractProps {
  contractName: string
  vendor: string
  vendor_fees: string
  provider: string
  provider_fees: string
  bucket: string
  minimum: string
}
*/

function ContractCredits(props){
  console.log('props', props)
  const { organizationId, chain, network, wallet } = props
  const contract_type = 'Credits'

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
      chain: props.chain,
      wallet: props.wallet,
      vendor: '',
      vendor_fees: '90',
      provider: '',
      provider_fees: '10',
      minimum: '1',
      bucket: '20'
    }
  })
  const [
    vendor,
    vendor_fees,
    provider,
    provider_fees,
    minimum,
    bucket
  ] = watch([
    'vendor',
    'vendor_fees',
    'provider',
    'provider_fees',
    'minimum',
    'bucket'
  ])

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
      // TODO: get args from form component
      //console.log(Chains[data.chain])
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
        chain,
        network,
        contract_type,
        contract_address: ok?.contractId,
        start_block: ok?.block,
        entity_id: organizationId,
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

  return (
    <div className={styles.vbox}>
      <Title text="Credits Contract" />
      <form>
        {/* PAGER */}
        <div className="">
          {/* PAGE */}
          <div className="">
            <TextInput label="Credit Vendor (Wallet address)" register={register('vendor')} />
            <TextInput label="Vendor Fees (percentage)" register={register('vendor_fees')} />
            <TextInput label="Credit Provider (Wallet address)" register={register('provider')} />
            <TextInput label="Provider Fees (percentage)" register={register('provider_fees')} />
            <TextInput label="Bucket Size" register={register('bucket')} />
            <TextInput label="Minimum Donation" register={register('minimum')} />
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
            vendor,
            vendor_fees,
            provider,
            provider_fees,
            minimum,
            bucket
          })
        }
      />
      <p id="message" className="text-center">
        {message}
      </p>
    </div>
  )
}

export default ContractCredits

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'
import {
  addValidation,
  AddressContainer,
  CountrySelector,
  PostalCodeGetter,
  AddressForm,
  AutoCompletedFields,
  AddressRules,
  AddressSubmitter,
} from '@vtex/address-form'
import StyleguideInput from '@vtex/address-form/lib/inputs/StyleguideInput'
import AddressShape from '@vtex/address-form/lib/propTypes/AddressShape'
import ContentBox from '../shared/ContentBox'
import emptyAddress from './emptyAddress'
import AddressDeletter from './AddressDeletter'

class FormAddressBox extends Component {
  constructor(props) {
    super(props)
    const baseAddress = this.props.isNew ? emptyAddress : this.props.address
    this.state = {
      address: this.prepareAddress(baseAddress),
      shipsTo: this.getShippingCountries(),
    }
  }

  prepareAddress(address) {
    const { __typename, ...addr } = address
    return addValidation(addr)
  }

  getShippingCountries() {
    const { intl } = this.props

    return [
      'ARG',
      'BOL',
      'BRA',
      'CAN',
      'CHL',
      'COL',
      'ECU',
      'ESP',
      'GTM',
      'MEX',
      'PER',
      'PRT',
      'PRY',
      'URY',
      'USA',
      'VEN',
    ].map(countryCode => ({
      label: intl.formatMessage({ id: 'country.' + countryCode }),
      value: countryCode,
    }))
  }

  handleAddressChange = newAddress => {
    this.setState(prevState => ({
      address: {
        ...prevState.address,
        ...newAddress,
      },
    }))
  }

  handleSubmit = (valid, address) => {
    console.log('field is being submitted')
    console.log(valid)
    console.log(address)
  }

  render() {
    const { onAddressDeleted, isNew, intl } = this.props
    const { address, shipsTo } = this.state

    const intlId = isNew ? 'addresses.addAddress' : 'addresses.saveAddress'
    return (
      <ContentBox width={'third'}>
        <AddressRules
          country={address.country.value}
          fetch={country => import('@vtex/address-form/lib/country/' + country)}
        >
          <AddressContainer
            address={address}
            onChangeAddress={this.handleAddressChange}
            Input={StyleguideInput}
            autoCompletePostalCode={true}
          >
            <div>
              <CountrySelector shipsTo={shipsTo} />
              <PostalCodeGetter />
              <AutoCompletedFields>
                <a>{intl.formatMessage({ id: 'address-form.edit' })}</a>
              </AutoCompletedFields>
              <AddressForm />
              <AddressSubmitter onSubmit={this.handleSubmit}>
                {handleSubmit => (
                  <Button
                    onClick={handleSubmit}
                    variation="secondary"
                    block
                    size="small"
                  >
                    {intl.formatMessage({ id: intlId })}
                  </Button>
                )}
              </AddressSubmitter>
            </div>
          </AddressContainer>
        </AddressRules>
        {!isNew && (
          <AddressDeletter
            addressId={address.addressId.value}
            onAddressDeleted={onAddressDeleted}
          />
        )}
      </ContentBox>
    )
  }
}

FormAddressBox.propTypes = {
  isNew: PropTypes.bool,
  onAddressDeleted: PropTypes.func,
  address: AddressShape,
  intl: intlShape.isRequired,
}

export default injectIntl(FormAddressBox)

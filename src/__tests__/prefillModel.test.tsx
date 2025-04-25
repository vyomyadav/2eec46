import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PrefillModal from '../components/prefillModel'

const upstreamForms = [
  { formId: '1', formName: 'Form A', fields: ['field1', 'field2'] }
]

const globalOptions = [
  { label: 'Client ID', value: { type: 'global', key: 'client_id' } }
]

describe('PrefillModal', () => {
  it('shows upstream form fields and global fields', () => {
    render(
      <PrefillModal
        onSelect={() => {}}
        onClose={() => {}}
        upstreamForms={upstreamForms}
        globalOptions={globalOptions}
        modalRef={{ current: null }}
      />
    )

    expect(screen.getByText('Form A → field1')).toBeInTheDocument()
    expect(screen.getByText('Form A → field2')).toBeInTheDocument()
    expect(screen.getByText('Global → Client ID')).toBeInTheDocument()
  })

  it('filters fields based on search input', () => {
    render(
      <PrefillModal
        onSelect={() => {}}
        onClose={() => {}}
        upstreamForms={upstreamForms}
        globalOptions={globalOptions}
        modalRef={{ current: null }}
      />
    )

    fireEvent.change(screen.getByPlaceholderText('Search fields...'), { target: { value: 'field2' } })

    expect(screen.queryByText('Form A → field1')).not.toBeInTheDocument()
    expect(screen.getByText('Form A → field2')).toBeInTheDocument()
  })
})

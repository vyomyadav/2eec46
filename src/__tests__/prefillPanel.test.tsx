import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PrefillPanel from '../components/prefillPanel'
import { NodePrefillConfig } from '../utils/types'

const node = {
  id: '1',
  data: { label: 'Test Form', component_id: 'form-123' }
}

const forms = [{
  id: 'form-123',
  name: 'Form A',
  description: '',
  is_reusable: false,
  field_schema: { type: 'object', properties: { field1: {}, field2: {} } },
  ui_schema: {},
  dynamic_field_config: {}
}]

const allNodes = [{ id: '1', data: { label: 'Test Form', component_id: 'form-123', prerequisites: [] } }]
const edges: any = []

const config: NodePrefillConfig = {}

describe('PrefillPanel', () => {
  it('displays field names', () => {
    render(
      <PrefillPanel
        node={node}
        forms={forms}
        allNodes={allNodes}
        edges={edges}
        config={config}
        setConfig={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('field1')).toBeInTheDocument()
    expect(screen.getByText('field2')).toBeInTheDocument()
  })

  it('opens editing modal on edit click', () => {
    render(
      <PrefillPanel
        node={node}
        forms={forms}
        allNodes={allNodes}
        edges={edges}
        config={config}
        setConfig={() => {}}
        onClose={() => {}}
      />
    )

    const editButtons = screen.getAllByText('Edit')
    fireEvent.click(editButtons[0])

    expect(screen.getByPlaceholderText('Search fields...')).toBeInTheDocument()
  })
})

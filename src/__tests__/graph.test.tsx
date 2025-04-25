import { render, screen, waitFor } from '@testing-library/react'
import Graph from '../components/graph'
import axios from 'axios'


jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { nodes: [], edges: [], forms: [] } })),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Graph', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        nodes: [
          { id: '1', position: { x: 0, y: 0 }, data: { name: 'Test Form', component_id: 'form-123', prerequisites: [] } }
        ],
        edges: [],
        forms: []
      }
    })
  })

  it('renders the graph nodes', async () => {
    render(<Graph />)

    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument()
    })
  })
})

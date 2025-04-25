import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import axios from 'axios'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({
    data: {
      nodes: [
        {
          id: '1',
          position: { x: 0, y: 0 },
          data: {
            name: 'Test Form',
            component_id: 'form-123',
            prerequisites: []
          }
        }
      ],
      edges: [],
      forms: []
    }
  })
})

describe('App', () => {
  it('renders the main App', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument()
    })
  })
})

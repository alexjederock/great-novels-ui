import axios from 'axios'

// eslint-disable-next-line import/prefer-default-export
export const fetchNovels = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/novels`) // eslint-disable-line no-undef

  return data
}

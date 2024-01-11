// would set up OpenAPI or another opt here to handle typing and share/assert correct formats
type ResultType = {
  numberOfPages?: number
  text?: string
  wordFrequency?: { count: number; word: string }[]
  error?: string
}

const uploadFile = async (file: File | null): Promise<null | ResultType> => {
  if (!file) return null
  // upload the file to the third party service

  const formData = new FormData()

  formData.append('file', file, file.name)
  // POST request using fetch inside useEffect React hook
  const requestOptions = {
    method: 'POST',
    body: formData,
  }
  const res = await fetch('http://127.0.0.1:5000/api/upload', requestOptions)

  // would set up OpenAPI or another opt here to handle typing and assert correct formats
  // do error handling or pass control back to state/controller here
  return res.json()
}

export type { ResultType }
export { uploadFile }

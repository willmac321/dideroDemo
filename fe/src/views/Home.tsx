import { useRef, useState, ChangeEvent, useEffect } from 'react'
import { ResultType, uploadFile } from '../controller/uploader'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Bar } from 'react-chartjs-2'

import { pdfjs } from 'react-pdf'
import { ChartData, Colors } from 'chart.js'
import { CategoryScale, Chart, LinearScale, Tooltip, BarElement } from 'chart.js'

Chart.register(Colors,CategoryScale, LinearScale,Tooltip,  BarElement)

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

const Home = () => {
  const inputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [chartData, setChartData] = useState<null | ChartData<'bar'>>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(false)
    if (e.target.files && e.target.files.length) {
      setPreview(null)

      // TODO handle multiple files
      const objUrl = URL.createObjectURL(e.target.files[0])
      setFile(e.target.files[0])
      setPreview(objUrl)
    }
  }
  const handleOnSend = async () => {
    setIsLoading(true)
    setChartData(null)
    const res = await uploadFile(file)
    // do better error handling
    if (res && !res.error) {
      if (res.wordFrequency && res.wordFrequency !== null) {
        setChartData({
          labels: res.wordFrequency.filter(res=>res.count > 1).map((row) => row.word),
          datasets: [
            {
              label: 'Word Frequency',
              data: res.wordFrequency.filter(res=>res.count > 1).map((row) => row.count),
            },
          ],
        })
      }
    }
    setIsLoading(false)
  }

  return (
    <Stack spacing={3} sx={{ alignItems: 'center' }}>
      <Typography id='uploadInstructions' component='h1' variant='h2'>
        Upload a pdf for parsing
      </Typography>
      {chartData && (
        <Box>
          <Typography id='uploadInstructions' component='h2' variant='h6'>
            Resulting Word Frequency in Document > 1
          </Typography>
          <Bar data={chartData} />
        </Box>
      )}
      <input
        type='file'
        aria-labelledby='uploadInstructions'
        ref={inputRef}
        multiple={false}
        accept='.pdf'
        onChange={handleOnChange}
      />
      {/** for now only allow a single file at a time, should in the future allow batch, or mutliple file uploads? **/}
      {preview && (
        // usually would do this without static widths and heights
        <Box sx={{ width: '290px' }}>
          <Document file={preview}>
            <Page height={400} pageNumber={1} />
          </Document>
        </Box>
      )}
      {file && (
        <Button
          // disabled={isLoading}
          onClick={handleOnSend}
          variant='outlined'
        >
          Send
        </Button>
      )}
    </Stack>
  )
}

export default Home

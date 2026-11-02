import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import multer from 'multer'
import morgan from 'morgan'
import path from 'node:path'
import fs from 'node:fs'

const app = express()
const port = Number(process.env.PORT) || 4000
const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || 'uploads')

fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDirectory),
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9-_]/gi, '-').toLowerCase()
    callback(null, `${baseName}-${Date.now()}${extension}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 10 },
  fileFilter: (_request, file, callback) => {
    const allowed = /image\/(jpeg|png|gif|webp)|application\/(pdf|zip|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)|text\/plain/.test(file.mimetype)
    callback(allowed ? null : new Error('Unsupported file type'), allowed)
  },
})

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())
app.use(morgan('dev'))
app.use('/uploads', express.static(uploadDirectory, { maxAge: '1d' }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'cloudcase-upload-api' }))
app.get('/api/files', (_request, response) => {
  const files = fs.readdirSync(uploadDirectory).map((name) => {
    const filePath = path.join(uploadDirectory, name)
    const stats = fs.statSync(filePath)
    return { name, size: stats.size, updatedAt: stats.mtime.toISOString(), url: `/uploads/${encodeURIComponent(name)}` }
  })
  response.json({ files })
})
app.post('/api/upload', upload.array('files', 10), (request, response) => {
  response.status(201).json({ message: 'Files uploaded successfully', files: request.files })
})
app.delete('/api/files/:name', (request, response) => {
  const safeName = path.basename(request.params.name)
  const filePath = path.join(uploadDirectory, safeName)
  if (!fs.existsSync(filePath)) return response.status(404).json({ message: 'File not found' })
  fs.unlinkSync(filePath)
  return response.status(204).send()
})

app.use((error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  response.status(400).json({ message: error.message || 'Upload failed' })
})

app.listen(port, () => console.log(`Cloudcase upload API listening on port ${port}`))

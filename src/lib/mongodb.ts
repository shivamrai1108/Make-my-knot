import { MongoClient, Db, Collection, Document } from 'mongodb'

declare global {
  // This must be a var and not let/const
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || ''
const MONGODB_DB = process.env.MONGODB_DB || 'makemyknot'

if (!MONGODB_URI) {
  console.warn('⚠️  MongoDB URI not configured. Blog system will use fallback in-memory storage.')
  console.warn('   To enable persistent blog storage, add MONGODB_URI to your .env.local file')
  // Don't throw error to allow fallback to in-memory storage
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise.
export default clientPromise

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(MONGODB_DB)
}

// Helper function to get specific collection
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(collectionName)
}

// Blog-specific helper
export async function getBlogsCollection() {
  return getCollection('blogs')
}
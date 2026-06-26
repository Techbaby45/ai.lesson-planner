const DB_NAME = "LessonPlannerDB"
const DB_VERSION = 1
const TOPICS_STORE = "topics"

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(TOPICS_STORE)) {
        db.createObjectStore(TOPICS_STORE, { keyPath: "topic_id" })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror   = () => reject(request.error)
  })
}

export async function saveTopicsOffline(topics) {
  try {
    const db = await openDB()
    const tx = db.transaction(TOPICS_STORE, "readwrite")
    const store = tx.objectStore(TOPICS_STORE)
    topics.forEach(topic => store.put(topic))
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true)
      tx.onerror    = () => reject(tx.error)
    })
  } catch (e) {
    console.error("Failed to save topics offline:", e)
    return false
  }
}

export async function loadTopicsOffline() {
  try {
    const db = await openDB()
    const tx = db.transaction(TOPICS_STORE, "readonly")
    const store = tx.objectStore(TOPICS_STORE)
    const request = store.getAll()
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror   = () => reject(request.error)
    })
  } catch (e) {
    console.error("Failed to load topics offline:", e)
    return []
  }
}
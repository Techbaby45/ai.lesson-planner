const DB_NAME = "LessonPlannerDB"
const DB_VERSION = 2
const TOPICS_STORE = "topics"
const PLANS_STORE = "plans"

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(TOPICS_STORE)) {
        db.createObjectStore(TOPICS_STORE, { keyPath: "topic_id" })
      }
      if (!db.objectStoreNames.contains(PLANS_STORE)) {
        db.createObjectStore(PLANS_STORE, { keyPath: "plan_id", autoIncrement: true })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror   = () => reject(request.error)
  })
}

// ── TOPICS ──────────────────────────────────────────────

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

// ── PLANS ──────────────────────────────────────────────

export async function savePlanOffline(planData) {
  try {
    const db = await openDB()
    const tx = db.transaction(PLANS_STORE, "readwrite")
    const store = tx.objectStore(PLANS_STORE)

    const record = {
      ...planData,
      saved_at: new Date().toISOString(),
      // summary fields for the list view
      topic_name: planData.topic?.topic_name || "",
      sub_topic: planData.topic?.sub_topic || "",
      name_of_teacher: planData.teacher_input?.name_of_teacher || "",
      class_: planData.teacher_input?.class_ || "",
      date_: planData.teacher_input?.date_ || "",
    }

    const request = store.add(record)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result) // returns the new plan_id
      request.onerror   = () => reject(request.error)
    })
  } catch (e) {
    console.error("Failed to save plan offline:", e)
    return null
  }
}

export async function loadPlansOffline() {
  try {
    const db = await openDB()
    const tx = db.transaction(PLANS_STORE, "readonly")
    const store = tx.objectStore(PLANS_STORE)
    const request = store.getAll()
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // Return newest first
        const plans = request.result.reverse()
        resolve(plans)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.error("Failed to load plans offline:", e)
    return []
  }
}

export async function loadSinglePlanOffline(planId) {
  try {
    const db = await openDB()
    const tx = db.transaction(PLANS_STORE, "readonly")
    const store = tx.objectStore(PLANS_STORE)
    const request = store.get(planId)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror   = () => reject(request.error)
    })
  } catch (e) {
    console.error("Failed to load plan offline:", e)
    return null
  }
}

export async function deletePlanOffline(planId) {
  try {
    const db = await openDB()
    const tx = db.transaction(PLANS_STORE, "readwrite")
    const store = tx.objectStore(PLANS_STORE)
    store.delete(planId)
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true)
      tx.onerror    = () => reject(tx.error)
    })
  } catch (e) {
    console.error("Failed to delete plan offline:", e)
    return false
  }
}

export async function countPlansOffline() {
  try {
    const db = await openDB()
    const tx = db.transaction(PLANS_STORE, "readonly")
    const store = tx.objectStore(PLANS_STORE)
    const request = store.count()
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror   = () => reject(request.error)
    })
  } catch (e) {
    return 0
  }
}
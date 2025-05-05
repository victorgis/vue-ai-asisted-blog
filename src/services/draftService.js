// src/services/draftService.js

// Storage key for drafts in localStorage
const STORAGE_KEY = 'blog_ai_drafts'

/**
 * Service for managing blog post drafts using localStorage
 */
export const draftService = {
  /**
   * Get all saved drafts
   * @returns {Promise<Array>} - Array of draft objects
   */
  async getDrafts() {
    try {
      const draftsJSON = localStorage.getItem(STORAGE_KEY)
      return draftsJSON ? JSON.parse(draftsJSON) : []
    } catch (error) {
      console.error('Error loading drafts from storage:', error)
      return []
    }
  },

  /**
   * Get a specific draft by ID
   * @param {string} id - The draft ID
   * @returns {Promise<Object>} - The draft object
   */
  async getDraft(id) {
    const drafts = await this.getDrafts()
    const draft = drafts.find((draft) => draft.id === id)

    if (!draft) {
      throw new Error(`Draft with ID ${id} not found`)
    }

    return draft
  },

  /**
   * Save or update a draft
   * @param {Object} draft - The draft to save
   * @returns {Promise<Object>} - The saved draft
   */
  async saveDraft(draft) {
    if (!draft.id) {
      throw new Error('Draft must have an ID')
    }

    const drafts = await this.getDrafts()
    const existingIndex = drafts.findIndex((d) => d.id === draft.id)

    if (existingIndex >= 0) {
      // Update existing draft
      drafts[existingIndex] = { ...draft }
    } else {
      // Add new draft
      drafts.push({ ...draft })
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
    return draft
  },

  /**
   * Delete a draft by ID
   * @param {string} id - The draft ID to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteDraft(id) {
    const drafts = await this.getDrafts()
    const filteredDrafts = drafts.filter((draft) => draft.id !== id)

    if (filteredDrafts.length === drafts.length) {
      throw new Error(`Draft with ID ${id} not found`)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts))
    return true
  },

  /**
   * Clear all drafts (for testing purposes)
   * @returns {Promise<boolean>} - Success status
   */
  async clearAllDrafts() {
    localStorage.removeItem(STORAGE_KEY)
    return true
  },
}

// Mock API implementation
export const mockDraftAPI = {
  /**
   * Simulate saving draft to a backend server
   * @param {Object} draft - The draft to save
   * @returns {Promise<Object>} - The saved draft with server-generated ID
   */
  async saveDraft(draft) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate API processing time
        const savedDraft = {
          ...draft,
          id: draft.id || Date.now().toString(),
          updatedAt: new Date(),
        }
        console.log('Mock API: Saved draft', savedDraft)
        resolve(savedDraft)
      }, 300)
    })
  },

  /**
   * Simulate fetching drafts from a backend server
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - Array of draft objects
   */
  async getDrafts(userId = 'current-user') {
    // Reuse the localStorage implementation for the mock API
    const drafts = await draftService.getDrafts()

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock API: Fetched drafts for user', userId)
        resolve(drafts)
      }, 300)
    })
  },

  /**
   * Simulate deleting a draft from a backend server
   * @param {string} id - The draft ID to delete
   * @returns {Promise<Object>} - Response status
   */
  async deleteDraft(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock API: Deleted draft', id)
        resolve({ success: true, message: 'Draft deleted successfully' })
      }, 300)
    })
  },
}

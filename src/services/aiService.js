import { GoogleGenAI } from '@google/genai'

// OpenAI API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

/**
 * Helper function to make API calls to OpenAI
 * @param {string} prompt - The prompt to send to the API
 * @returns {Promise<string>} - The AI-generated response
 */
async function callOpenAI(prompt) {
  try {
    // Real API call
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    })
    return response.candidates[0].content.parts[0].text

    // Extract the response text from Gemini's response format
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
}

export const aiService = {
  /**
   * Generate a title based on blog content
   * @param {string} content - The blog post content
   * @returns {Promise<string>} - The generated title
   */
  async generateTitle(content) {
    const prompt = `Generate a single one line catchy and SEO-friendly title, in simple text, for a blog post with the following content:\n\n${content.substring(0, 500)}...\n\nTitle:`
    return await callOpenAI(prompt)
  },

  /**
   * Generate a summary based on blog content
   * @param {string} content - The blog post content
   * @returns {Promise<string>} - The generated summary
   */
  async generateSummary(content) {
    const prompt = `Summarize the following blog post in 2-3 sentences:\n\n${content.substring(0, 1000)}...\n\nSummary:`
    return await callOpenAI(prompt)
  },

  /**
   * Generate keywords based on blog content and title
   * @param {string} content - The blog post content
   * @param {string} title - The blog post title
   * @returns {Promise<string[]>} - The generated keywords
   */
  async generateKeywords(content, title = '') {
    const prompt = `Generate 5 relevant word tags for a blog post ${title ? `titled: "${title}"` : ''} with the following content:\n\n${content.substring(0, 500)}. one word tags only, separated by commas.\n\nTags:`
    const response = await callOpenAI(prompt)

    // Process response into an array of keywords
    return response
      .split(/,|\n/)
      .map((keyword) => keyword.replace(/^\d+\.\s*/, ''))
      .filter((keyword) => keyword.length > 0)
  },
}

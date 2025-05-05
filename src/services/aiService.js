// src/services/aiService.js

// OpenAI API configuration
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const API_ENDPOINT = import.meta.env.VITE_OPENAI_API_URL

/**
 * Helper function to make API calls to OpenAI
 * @param {string} prompt - The prompt to send to the API
 * @returns {Promise<string>} - The AI-generated response
 */
async function callOpenAI(prompt) {
  try {
    // Real API call
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    console.log('API response:', response)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log('API data:', data.choices[0].message.content)
    return data.choices[0].message.content
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
    const prompt = `Generate a catchy and SEO-friendly title for a blog post with the following content:\n\n${content.substring(0, 500)}...\n\nTitle:`
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
    const prompt = `Generate 5 relevant keywords or tags for a blog post ${title ? `titled "${title}"` : ''} with the following content:\n\n${content.substring(0, 500)}...\n\nKeywords:`
    const response = await callOpenAI(prompt)

    // Process response into an array of keywords
    return response
      .split(/,|\n/)
      .map((keyword) => keyword.replace(/^\d+\.\s*/, ''))
      .filter((keyword) => keyword.length > 0)
  },
}

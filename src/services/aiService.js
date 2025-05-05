// src/services/aiService.js

// OpenAI API configuration
const API_KEY = 'your-openai-api-key' // Replace with your actual API key
const API_ENDPOINT = 'https://api.openai.com/v1/completions'

/**
 * Helper function to make API calls to OpenAI
 * @param {string} prompt - The prompt to send to the API
 * @returns {Promise<string>} - The AI-generated response
 */
async function callOpenAI(prompt) {
  try {
    // For development/demo purposes, simulate API call with mock responses
    if (process.env.NODE_ENV === 'development' || !API_KEY.includes('sk-')) {
      console.log('Using mock AI response for prompt:', prompt)
      return simulateAIResponse(prompt)
    }

    // Real API call
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].text.trim()
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
}

/**
 * Simulate AI responses for development/demo purposes
 * @param {string} prompt - The prompt sent to the API
 * @returns {string} - A simulated response
 */
function simulateAIResponse(prompt) {
  // Wait a random time to simulate API latency
  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 500 // 500-1500ms delay

    setTimeout(() => {
      if (prompt.includes('title')) {
        // Generate mock title based on content length
        const titleOptions = [
          'The Ultimate Guide to Modern Web Development',
          '10 Ways to Improve Your Coding Skills',
          'Understanding the Future of Technology',
          'How AI is Transforming Content Creation',
          'Best Practices for Frontend Development',
        ]
        resolve(titleOptions[Math.floor(Math.random() * titleOptions.length)])
      } else if (prompt.includes('summary')) {
        resolve(
          'This article explores key concepts in web development and artificial intelligence, highlighting how these technologies can be combined to create powerful applications. The author shares practical insights on implementation strategies and best practices for developers.',
        )
      } else if (prompt.includes('keywords')) {
        const keywordSets = [
          ['web development', 'vue.js', 'javascript', 'frontend', 'programming'],
          ['ai', 'machine learning', 'content creation', 'technology', 'automation'],
          ['blog writing', 'web apps', 'tutorial', 'coding', 'software'],
        ]
        resolve(keywordSets[Math.floor(Math.random() * keywordSets.length)])
      } else {
        resolve('Generated content based on your request.')
      }
    }, delay)
  })
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
      .map((keyword) => keyword.trim().replace(/^\d+\.\s*/, ''))
      .filter((keyword) => keyword.length > 0)
  },
}

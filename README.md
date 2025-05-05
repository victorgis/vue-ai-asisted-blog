# vue-ai-assisted-blog

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Blog AI Assistant

A Vue.js application that helps users draft blog posts with AI-powered suggestions for titles, summaries, and keywords.

![Blog AI Assistant Demo](screenshots/demo.png)

## Features

- **Rich Text Editor**: Full-featured editor for writing blog content with formatting options.
- **AI-powered Suggestions**: Generate titles, summaries, and keywords based on your content.
- **Draft Management**: Save, load, and delete blog drafts locally.
- **Responsive Design**: Works on desktop and mobile devices using Bootstrap.

## Technologies Used

- **Frontend**: Vue.js 3, Bootstrap 5
- **AI Integration**: OpenAI API (with fallback to mock responses)
- **Data Storage**: Local storage for drafts (expandable to backend integration)
- **Database Design**: SQL schema included for server implementation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/victorgis/vue-ai-asisted-blog.git
   cd vue-ai-asisted-blog
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your OpenAI API key:
   - Create a `.env` file in the project root
   - Add your API key: `VITE_OPENAI_API_KEY= VITE_OPENAI_API_URL=`

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
blog-ai-assistant/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── RichTextEditor.vue
│   ├── services/
│   │   ├── aiService.js
│   │   └── draftService.js
│   ├── App.vue
│   └── main.js
├── database/
│   └── schema.sql
└── README.md
```

## AI Integration

This application integrates with OpenAI's API to provide AI-powered suggestions:

1. **Title Generation**: Creates catchy, SEO-friendly titles based on your content.
2. **Summary Generation**: Automatically summarizes your blog post content.
3. **Keyword Suggestions**: Identifies relevant keywords and tags for your post.

For development purposes, the application includes mock responses when an API key is not provided.

## Database Schema

The included SQL schema (`database/schema.sql`) defines a relational database structure for a full backend implementation:

- **users**: User accounts and profiles
- **blog_posts**: Blog drafts and published posts
- **ai_suggestions**: Stored AI-generated content
- **keywords**: Tags and keywords for posts
- **blog_post_keywords**: Junction table for post-keyword relationships
- **api_usage**: Tracking of API consumption

## Entity Relationship Diagram

![ER Diagram](screenshots/er-diagram.png)

## Development Roadmap

Future enhancements planned for this project:

1. Backend integration with Express.js or Django
2. User authentication and profiles
3. Publishing to various platforms (WordPress, Medium, etc.)
4. AI-assisted content improvement suggestions
5. Analytics for post performance

## How AI Augments Content Creation

AI can significantly enhance the content creation process by:

1. **Overcoming Writer's Block**: AI suggestions can help writers get started when facing a blank page.
2. **Improving SEO**: AI can suggest optimized titles and keywords based on current SEO best practices.
3. **Enhancing Readability**: Summaries can help writers ensure their key points are clear and concise.
4. **Saving Time**: Automating routine aspects of content creation allows writers to focus on unique insights.
5. **Ensuring Consistency**: AI can help maintain a consistent tone and style across multiple posts.

While AI provides valuable assistance, the human writer remains essential for:
- Adding personal insights and experiences
- Ensuring factual accuracy and ethical content
- Crafting authentic voice and style
- Making creative decisions about narrative and structure

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vue.js](https://vuejs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [OpenAI](https://openai.com/)
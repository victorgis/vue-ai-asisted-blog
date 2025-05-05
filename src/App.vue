<!-- App.vue - Main Application Component -->
<template>
  <div class="container my-4">
    <h1 class="text-center mb-4">Blog AI Assistant</h1>
    
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <span v-if="blogPost.title">{{ blogPost.title }}</span>
              <span v-else class="text-muted">Untitled Blog Post</span>
            </h5>
            <div class="d-flex gap-2">
              <button class="btn btn-success me-2" @click="saveDraft">
                <i class="bi bi-save"></i> Save Draft
              </button>
              <button class="btn btn-primary" @click="toggleDraftsModal">
                <i class="bi bi-folder"></i> My Drafts
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="blogTitle" class="form-label">Blog Title</label>
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  id="blogTitle" 
                  v-model="blogPost.title" 
                  placeholder="Enter blog title"
                >
                <button 
                  class="btn btn-outline-secondary" 
                  type="button" 
                  @click="generateTitle"
                  :disabled="isGenerating.title || !blogPost.content"
                >
                  <span v-if="isGenerating.title" class="spinner-border spinner-border-sm" role="status"></span>
                  <i v-else class="bi bi-magic"></i> Generate Title
                </button>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="editor" class="form-label">Blog Content</label>
              <div class="editor-container border rounded p-2">
                <rich-text-editor v-model="blogPost.content" />
              </div>
            </div>
            
            <div class="d-flex gap-2 mb-3">
              <button 
                class="btn btn-outline-primary" 
                @click="generateSummary"
                :disabled="isGenerating.summary || !blogPost.content"
              >
                <span v-if="isGenerating.summary" class="spinner-border spinner-border-sm" role="status"></span>
                <i v-else class="bi bi-file-earmark-text"></i> Generate Summary
              </button>
              <button 
                class="btn btn-outline-primary" 
                @click="generateKeywords"
                :disabled="isGenerating.keywords || !blogPost.content"
              >
                <span v-if="isGenerating.keywords" class="spinner-border spinner-border-sm" role="status"></span>
                <i v-else class="bi bi-tags"></i> Suggest Keywords
              </button>
            </div>
            
            <div v-if="blogPost.summary" class="mb-3">
              <label for="summary" class="form-label">Summary</label>
              <textarea 
                class="form-control" 
                id="summary" 
                v-model="blogPost.summary" 
                rows="3"
                placeholder="Summary will appear here"
              ></textarea>
            </div>
            
            <div v-if="blogPost.keywords.length > 0" class="mb-3">
              <label class="form-label">Keywords</label>
              <div class="d-flex flex-wrap gap-2">
                <span 
                  v-for="(keyword, index) in blogPost.keywords" 
                  :key="index" 
                  class="badge bg-primary"
                >
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Drafts Modal -->
    <div v-if="showDrafts" class="modal-backdrop fade show" @click="closeDraftsModal"></div>
    <div class="modal fade" :class="{ 'show d-block': showDrafts }" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">My Drafts</h5>
            <button type="button" class="btn-close" @click="closeDraftsModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="drafts.length === 0" class="text-center p-4 text-muted">
              No saved drafts yet
            </div>
            <div v-else class="list-group">
              <button 
                v-for="draft in drafts" 
                :key="draft.id"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                @click="loadDraft(draft.id)"
              >
                <div>
                  <h6 class="mb-1">{{ draft.title || 'Untitled Draft' }}</h6>
                  <small class="text-muted">Last modified: {{ formatDate(draft.updatedAt) }}</small>
                </div>
                <button class="btn btn-sm btn-danger" @click.stop="deleteDraft(draft.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDraftsModal">Close</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notifications -->
    <div class="position-fixed bottom-0 end-0 p-3">
      <div 
        class="toast"
        :class="{ 'show': toast.show }"
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ toast.title }}</strong>
          <button type="button" class="btn-close" @click="toast.show = false"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextEditor from './components/RichTextEditor.vue';
import { aiService } from './services/aiService';
import { draftService } from './services/draftService';

export default {
  name: 'App',
  components: {
    RichTextEditor
  },
  data() {
    return {
      blogPost: {
        id: null,
        title: '',
        content: '',
        summary: '',
        keywords: [],
        createdAt: null,
        updatedAt: null
      },
      isGenerating: {
        title: false,
        summary: false,
        keywords: false
      },
      drafts: [],
      showDrafts: false,
      toast: {
        show: false,
        title: '',
        message: ''
      }
    };
  },
  mounted() {
    this.loadDrafts();
    
    // Add event listener for escape key to close modal
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      // Close modal when ESC key is pressed
      if (event.key === 'Escape' && this.showDrafts) {
        this.closeDraftsModal();
      }
    },
    
    toggleDraftsModal() {
      this.showDrafts = !this.showDrafts;
      if (this.showDrafts) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    },
    
    closeDraftsModal() {
      this.showDrafts = false;
      document.body.classList.remove('modal-open');
    },
    
    async generateTitle() {
      if (!this.blogPost.content) {
        this.showToast('Error', 'Please write some content first');
        return;
      }
      
      this.isGenerating.title = true;
      try {
        const title = await aiService.generateTitle(this.blogPost.content);
        this.blogPost.title = title;
        this.showToast('Success', 'Generated title based on your content');
      } catch (error) {
        console.error('Error generating title:', error);
        this.showToast('Error', 'Failed to generate title');
      } finally {
        this.isGenerating.title = false;
      }
    },
    
    async generateSummary() {
      if (!this.blogPost.content) {
        this.showToast('Error', 'Please write some content first');
        return;
      }
      
      this.isGenerating.summary = true;
      try {
        const summary = await aiService.generateSummary(this.blogPost.content);
        this.blogPost.summary = summary;
        this.showToast('Success', 'Generated summary based on your content');
      } catch (error) {
        console.error('Error generating summary:', error);
        this.showToast('Error', 'Failed to generate summary');
      } finally {
        this.isGenerating.summary = false;
      }
    },
    
    async generateKeywords() {
      if (!this.blogPost.content) {
        this.showToast('Error', 'Please write some content first');
        return;
      }
      
      this.isGenerating.keywords = true;
      try {
        const keywords = await aiService.generateKeywords(this.blogPost.content, this.blogPost.title);
        this.blogPost.keywords = keywords;
        this.showToast('Success', 'Generated keywords based on your content');
      } catch (error) {
        console.error('Error generating keywords:', error);
        this.showToast('Error', 'Failed to generate keywords');
      } finally {
        this.isGenerating.keywords = false;
      }
    },
    
    async saveDraft() {
      if (!this.blogPost.content && !this.blogPost.title) {
        this.showToast('Error', 'Nothing to save');
        return;
      }
      
      try {
        // If this is a new draft or we're creating a copy
        if (!this.blogPost.id) {
          this.blogPost.id = Date.now().toString();
          this.blogPost.createdAt = new Date();
        }
        
        this.blogPost.updatedAt = new Date();
        await draftService.saveDraft(this.blogPost);
        this.loadDrafts();
        this.showToast('Success', 'Draft saved successfully');
      } catch (error) {
        console.error('Error saving draft:', error);
        this.showToast('Error', 'Failed to save draft');
      }
    },
    
    async loadDrafts() {
      try {
        this.drafts = await draftService.getDrafts();
      } catch (error) {
        console.error('Error loading drafts:', error);
        this.showToast('Error', 'Failed to load drafts');
      }
    },
    
    async loadDraft(id) {
      try {
        const draft = await draftService.getDraft(id);
        this.blogPost = { ...draft };
        this.closeDraftsModal();
        this.showToast('Success', 'Draft loaded');
      } catch (error) {
        console.error('Error loading draft:', error);
        this.showToast('Error', 'Failed to load draft');
      }
    },
    
    async deleteDraft(id) {
      try {
        await draftService.deleteDraft(id);
        this.loadDrafts();
        this.showToast('Success', 'Draft deleted');
      } catch (error) {
        console.error('Error deleting draft:', error);
        this.showToast('Error', 'Failed to delete draft');
      }
    },
    
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
    
    showToast(title, message) {
      this.toast = {
        show: true,
        title,
        message
      };
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }
};
</script>

<style>
.editor-container {
  min-height: 300px;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.toast.show {
  display: block;
  opacity: 1;
}

/* Add styles for modal open state */
body.modal-open {
  overflow: hidden;
}
</style>
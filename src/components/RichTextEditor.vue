<!-- RichTextEditor.vue -->
<template>
  <div class="rich-text-editor">
    <div class="toolbar border-bottom p-2 mb-2">
      <div class="btn-group me-2">
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.bold, 'btn-outline-primary': !isActive.bold }"
          @click="formatDoc('bold')"
          title="Bold"
        >
          <i class="bi bi-type-bold"></i>
        </button>
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.italic, 'btn-outline-primary': !isActive.italic }"
          @click="formatDoc('italic')"
          title="Italic"
        >
          <i class="bi bi-type-italic"></i>
        </button>
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.underline, 'btn-outline-primary': !isActive.underline }"
          @click="formatDoc('underline')"
          title="Underline"
        >
          <i class="bi bi-type-underline"></i>
        </button>
      </div>

      <div class="btn-group me-2">
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.justifyLeft, 'btn-outline-primary': !isActive.justifyLeft }"
          @click="formatDoc('justifyLeft')"
          title="Align Left"
        >
          <i class="bi bi-text-left"></i>
        </button>
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.justifyCenter, 'btn-outline-primary': !isActive.justifyCenter }"
          @click="formatDoc('justifyCenter')"
          title="Align Center"
        >
          <i class="bi bi-text-center"></i>
        </button>
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.justifyRight, 'btn-outline-primary': !isActive.justifyRight }"
          @click="formatDoc('justifyRight')"
          title="Align Right"
        >
          <i class="bi bi-text-right"></i>
        </button>
      </div>

      <div class="btn-group me-2">
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.insertUnorderedList, 'btn-outline-primary': !isActive.insertUnorderedList }"
          @click="formatDoc('insertUnorderedList')"
          title="Bullet List"
        >
          <i class="bi bi-list-ul"></i>
        </button>
        <button 
          class="btn btn-sm" 
          :class="{ 'btn-primary': isActive.insertOrderedList, 'btn-outline-primary': !isActive.insertOrderedList }"
          @click="formatDoc('insertOrderedList')"
          title="Numbered List"
        >
          <i class="bi bi-list-ol"></i>
        </button>
      </div>

      <div class="btn-group me-2">
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="formatDoc('heading', 'h2')"
          title="Heading"
        >
          <i class="bi bi-type-h2"></i>
        </button>
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="formatDoc('insertParagraph')"
          title="Paragraph"
        >
          <i class="bi bi-paragraph"></i>
        </button>
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="formatDoc('insertHorizontalRule')"
          title="Horizontal Line"
        >
          <i class="bi bi-hr"></i>
        </button>
      </div>

      <div class="btn-group">
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="formatDoc('createLink')"
          title="Insert Link"
        >
          <i class="bi bi-link-45deg"></i>
        </button>
        <button 
          class="btn btn-sm btn-outline-primary" 
          @click="formatDoc('insertImage')"
          title="Insert Image"
        >
          <i class="bi bi-image"></i>
        </button>
      </div>
    </div>

    <div 
      class="editable-content" 
      ref="editor" 
      contenteditable="true" 
      @input="handleInput" 
      @keydown="handleKeyDown"
      @mouseup="checkStyles"
      @mousedown="checkStyles"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isActive: {
        bold: false,
        italic: false,
        underline: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        insertUnorderedList: false,
        insertOrderedList: false
      }
    };
  },
  mounted() {
    // Initialize the editor with content if provided
    if (this.modelValue) {
      this.$refs.editor.innerHTML = this.modelValue;
    }
    
    // Setup event listener for checking active styles
    document.addEventListener('selectionchange', this.checkStyles);
  },
  beforeUnmount() {
    document.removeEventListener('selectionchange', this.checkStyles);
  },
  watch: {
    modelValue(newVal) {
      // Only update the editor if the content is different
      if (this.$refs.editor && this.$refs.editor.innerHTML !== newVal) {
        this.$refs.editor.innerHTML = newVal;
      }
    }
  },
  methods: {
    handleInput() {
      this.$emit('update:modelValue', this.$refs.editor.innerHTML);
    },
    
    handleKeyDown(e) {
        console.log('Key pressed:', e);
      // Add special key handlers if needed
      this.checkStyles();
    },
    
    formatDoc(command, value = null) {
      // Handle special formatting cases
      if (command === 'createLink') {
        const url = prompt('Enter the URL:', 'http://');
        if (url) {
          document.execCommand(command, false, url);
        }
        this.handleInput();
        return;
      }
      
      if (command === 'insertImage') {
        const url = prompt('Enter image URL:', 'http://');
        if (url) {
          document.execCommand(command, false, url);
        }
        this.handleInput();
        return;
      }
      
      if (command === 'heading') {
        document.execCommand('formatBlock', false, value);
        this.handleInput();
        return;
      }
      
      // Standard formatting commands
      document.execCommand(command, false, value);
      this.handleInput();
      this.checkStyles();
    },
    
    checkStyles() {
      // Update active states for buttons
      this.isActive.bold = document.queryCommandState('bold');
      this.isActive.italic = document.queryCommandState('italic');
      this.isActive.underline = document.queryCommandState('underline');
      this.isActive.justifyLeft = document.queryCommandState('justifyLeft');
      this.isActive.justifyCenter = document.queryCommandState('justifyCenter');
      this.isActive.justifyRight = document.queryCommandState('justifyRight');
      this.isActive.insertUnorderedList = document.queryCommandState('insertUnorderedList');
      this.isActive.insertOrderedList = document.queryCommandState('insertOrderedList');
    }
  }
};
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.editable-content {
  min-height: 250px;
  padding: 0.5rem;
  outline: none;
  overflow-y: auto;
}

.editable-content:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
class StreamingController {
    private abortController: AbortController | null = null;
  
    startStreaming() {
      this.abortController = new AbortController();
      return this.abortController.signal;
    }
  
    stopStreaming() {
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
    }
  }

  export const streamingController = new StreamingController();
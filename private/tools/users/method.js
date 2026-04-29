
class METHOD {
    constructor(parent){
        this.parent = parent;
        this.api = this.parent.api;
        this.config = this.parent.config;
        this.handlers = this.parent.handlers;
        this.windows = this.parent.windows;
        this.modal = this.parent.modal;
    }
}
export default METHOD;